import pandas as pd
from utils.data_loader import get_dataset

def get_peak_crime_time(location: str):
    try:
        df = get_dataset()
        df.columns = df.columns.str.strip().str.replace(' ', '_').str.lower()

        df = df[df['location'].str.contains(location, case=False, na=False)]

        df['hour'] = pd.to_datetime(df['time'], errors='coerce').dt.hour

        def get_slot(h):
            if 5 <= h < 12:
                return "Morning"
            elif 12 <= h < 17:
                return "Afternoon"
            elif 17 <= h < 21:
                return "Evening"
            return "Night"

        df['time_slot'] = df['hour'].apply(lambda x: get_slot(x) if pd.notna(x) else "Unknown")

        peak = df['time_slot'].value_counts().idxmax()

        return {
            "success": True,
            "location": location,
            "peakTime": peak
        }

    except Exception as e:
        return {"success": False, "error": str(e)}