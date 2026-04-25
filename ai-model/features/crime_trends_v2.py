import pandas as pd
from utils.data_loader import get_dataset

def get_crime_trends(location: str):
    try:
        df = get_dataset()
        df.columns = df.columns.str.strip().str.replace(' ', '_').str.lower()

        df['date'] = pd.to_datetime(df['date'], errors='coerce')

        df = df[df['location'].str.contains(location, case=False, na=False)]

        if df.empty:
            return {"success": False, "error": "No data found"}

        df['month'] = df['date'].dt.to_period('M').astype(str)

        trend = df.groupby('month').size().reset_index(name='count')

        return {
            "success": True,
            "location": location,
            "trend": trend.to_dict(orient='records')
        }

    except Exception as e:
        return {"success": False, "error": str(e)}