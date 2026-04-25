import pandas as pd
from utils.data_loader import get_dataset


def get_top_crimes(location: str, years: int = 3):
    try:
        df = get_dataset()

        # Normalize columns
        df.columns = df.columns.str.strip().str.replace(' ', '_').str.lower()

        # Parse date
        df['date'] = pd.to_datetime(df['date'], errors='coerce')

        # Filter last N years
        cutoff = pd.Timestamp.now() - pd.DateOffset(years=years)
        df = df[df['date'] >= cutoff]

        # Filter location
        df = df[df['location'].str.contains(location, case=False, na=False)]

        if df.empty:
            return {"success": False, "error": "No data found"}

        # Top crimes
        crime_counts = (
            df['crime_type']
            .value_counts()
            .head(5)
        )

        top_crimes = [
            {"crimeType": k, "count": int(v)}
            for k, v in crime_counts.items()
        ]

        return {
            "success": True,
            "location": location,
            "years": years,
            "topCrimes": top_crimes
        }

    except Exception as e:
        return {"success": False, "error": str(e)}