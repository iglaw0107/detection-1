import pandas as pd
from utils.data_loader import get_dataset

def compare_locations(locations: list):
    try:
        df = get_dataset()
        df.columns = df.columns.str.strip().str.replace(' ', '_').str.lower()

        result = {}

        for loc in locations:
            count = df[df['location'].str.contains(loc, case=False, na=False)].shape[0]
            result[loc] = int(count)

        return {
            "success": True,
            "comparison": result
        }

    except Exception as e:
        return {"success": False, "error": str(e)}