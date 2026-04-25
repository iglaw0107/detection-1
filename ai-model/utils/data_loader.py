import pandas as pd
import os

DATASET_PATH = os.getenv("DATASET_PATH", "data/crime_dataset_india.csv")

_df = None

def get_dataset():
    global _df

    if _df is not None:
        return _df

    if not os.path.exists(DATASET_PATH):
        raise FileNotFoundError(f"Dataset not found at {DATASET_PATH}")

    print("📊 Loading dataset into memory...")
    _df = pd.read_csv(DATASET_PATH)
    print("✅ Dataset loaded.")

    return _df