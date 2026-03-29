import pickle
import pandas as pd
from utils.preprocess import preprocess_data

# Load model
with open("models/crime_model.pkl", "rb") as f:
    model = pickle.load(f)

def predict_crime(input_data):
    df = pd.DataFrame([input_data])

    # Add dummy date for feature extraction
    df['date'] = "2025-01-01"

    df = preprocess_data(df)

    # Align columns (important for production)
    expected_columns = model.feature_names_in_

    for col in expected_columns:
        if col not in df.columns:
            df[col] = 0

    df = df[expected_columns]

    prediction = model.predict(df)[0]
    probabilities = model.predict_proba(df).max()

    # Risk level logic
    if probabilities > 0.7:
        risk = "HIGH"
    elif probabilities > 0.4:
        risk = "MEDIUM"
    else:
        risk = "LOW"

    return {
        "predicted_crime": prediction,
        "probability": float(probabilities),
        "risk_level": risk
    }