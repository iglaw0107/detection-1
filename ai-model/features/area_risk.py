import pandas as pd
from utils.data_loader import get_dataset

# ─────────────────────────────────────────────
# CLEAN DATASET LOADING
# ─────────────────────────────────────────────
def load_dataset() -> pd.DataFrame:
    df = get_dataset()

    # Normalize column names
    df.columns = (
        df.columns
        .str.strip()
        .str.replace(' ', '_')
        .str.lower()
    )

    # 🔥 FIX: map real dataset columns → expected
    df.rename(columns={
        'date': 'date_of_occurrence',
        'time': 'time_of_occurrence',
        'location': 'city',
        'crime_type': 'crime_type',
        'weapon_used': 'weapon_used'
    }, inplace=True)

    return df


# ─────────────────────────────────────────────
# AREA RISK FUNCTION
# ─────────────────────────────────────────────
def get_area_risk(city: str) -> dict:
    try:
        df = load_dataset()

        # Filter city
        df_city = df[df['city'].str.lower().str.contains(city.lower(), na=False)]

        if df_city.empty:
            return {
                "success": False,
                "error": f"No data for {city}"
            }

        total_crimes = len(df_city)

        # ── Crime Breakdown ─────────────────────
        crime_counts = (
            df_city['crime_type']
            .value_counts()
            .reset_index()
        )
        crime_counts.columns = ['crimeType', 'count']

        # ── Weapon Stats (FIXED) ────────────────
        weapon_stats = []
        if 'weapon_used' in df_city.columns:
            weapon_counts = df_city['weapon_used'].value_counts().head(5)

            weapon_stats = [
                {"weapon": k, "count": int(v)}
                for k, v in weapon_counts.items()
            ]

        # ── Time Parsing ───────────────────────
        df_city['hour'] = pd.to_datetime(
            df_city['time_of_occurrence'],
            format='%H:%M',
            errors='coerce'
        ).dt.hour

        df_city['time_slot'] = df_city['hour'].apply(
            lambda h: (
                "Morning" if 5 <= h < 12 else
                "Afternoon" if 12 <= h < 17 else
                "Evening" if 17 <= h < 21 else
                "Night"
            ) if pd.notna(h) else "Unknown"
        )

        time_counts = df_city['time_slot'].value_counts()

        most_dangerous_time = time_counts.idxmax() if not time_counts.empty else "Unknown"

        # ── Weekday ────────────────────────────
        df_city['date_parsed'] = pd.to_datetime(
            df_city['date_of_occurrence'],
            errors='coerce'
        )

        df_city['weekday'] = df_city['date_parsed'].dt.day_name()

        weekday_counts = df_city['weekday'].value_counts()

        most_dangerous_day = weekday_counts.idxmax() if not weekday_counts.empty else "Unknown"

        # ── Simple Risk Score ──────────────────
        risk_score = min(10, round(total_crimes / 500, 1))

        risk_level = (
            "HIGH" if risk_score > 7 else
            "MEDIUM" if risk_score > 4 else
            "LOW"
        )

        return {
            "success": True,
            "city": city,
            "riskScore": risk_score,
            "riskLevel": risk_level,

            "summary": {
                "totalCrimes": total_crimes,
                "mostCommonCrime": crime_counts.iloc[0]['crimeType'],
                "mostDangerousTime": most_dangerous_time,
                "mostDangerousDay": most_dangerous_day
            },

            "crimeBreakdown": crime_counts.head(5).to_dict(orient='records'),
            "weaponStats": weapon_stats
        }

    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }