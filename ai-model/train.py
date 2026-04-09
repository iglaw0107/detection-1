# ai-model/train.py
import pandas as pd
import pickle
import os
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
from utils.preprocess import preprocess_data

# ── Config: add new dataset paths here in future
DATASET_PATH = os.getenv("DATASET_PATH", "data/crime_dataset_india.csv")
MODEL_PATH   = os.getenv("MODEL_PATH", "models/crime_model.pkl")

def load_and_normalize(path):
    """Load CSV and normalize column names."""
    df = pd.read_csv(path, skipinitialspace=True)
    df.columns = df.columns.str.strip().str.replace(' ', '_').str.lower()

    # Normalize column names to standard internal names
    rename_map = {
        'crime_type': 'crime_type',
        'date':       'date_of_occurrence',
        'time':       'time_of_occurrence',
        'location':   'city',
        # Chicago dataset columns (for future use):
        'primary_type':    'crime_type',
        'date':            'date_of_occurrence',
        'block':           'city',
    }
    df.rename(columns={k: v for k, v in rename_map.items() if k in df.columns}, inplace=True)

    print(f"Loaded: {path} | Shape: {df.shape}")
    print(f"Columns: {df.columns.tolist()}")
    return df

def train():
    df = load_and_normalize(DATASET_PATH)

    if 'crime_type' not in df.columns:
        raise ValueError("Dataset must have a 'crime_type' (or equivalent) column")

    # Drop rows where target is missing
    df = df.dropna(subset=['crime_type'])
    df['crime_type'] = df['crime_type'].str.strip().str.lower()

    print(f"\nCrime type distribution:\n{df['crime_type'].value_counts()}")

    df = preprocess_data(df)

    y = df['crime_type']
    drop_cols = [
        'crime_type', 'time_of_occurrence', 'date_of_occurrence',
        'report_number', 'date_reported', 'date_case_closed'
    ]
    X = df.drop(columns=[col for col in drop_cols if col in df.columns])

    print(f"\nFeatures used: {X.columns.tolist()}")
    print(f"Training samples: {len(X)}")

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    model = RandomForestClassifier(
        n_estimators=100,
        random_state=42,
        n_jobs=-1,
        class_weight='balanced'  # handles imbalanced crime types
    )
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    print(f"\nModel Performance:\n{classification_report(y_test, y_pred)}")

    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    with open(MODEL_PATH, "wb") as f:
        pickle.dump(model, f)

    print(f"\n✅ Model saved to {MODEL_PATH}")

if __name__ == "__main__":
    train()