import os
import joblib
import pandas as pd
from utils.preprocess import preprocess_data

# ─────────────────────────────────────────────
# CONFIG
# ─────────────────────────────────────────────
MODEL_PATH = os.getenv("MODEL_PATH", "models/crime_model.pkl")

# ─────────────────────────────────────────────
# LOAD MODEL (ONLY ONCE)
# ─────────────────────────────────────────────
model = None

def load_model():
    global model

    if model is not None:
        return model

    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(
            f"Model not found at {MODEL_PATH}. "
            f"Make sure it exists before starting server."
        )

    print("🧠 Loading ML model into memory...")
    model = joblib.load(MODEL_PATH)
    print("✅ Model loaded successfully.")

    return model


# ─────────────────────────────────────────────
# PREDICT FUNCTION
# ─────────────────────────────────────────────
def predict_crime(input_data: dict) -> dict:
    model = load_model()

    data = dict(input_data)

    # Normalize keys
    if 'location' in data:
        data['city'] = data.pop('location')

    if 'time' in data and 'time_of_occurrence' not in data:
        data['time_of_occurrence'] = data.pop('time')
    elif 'time_of_occurrence' not in data:
        data['time_of_occurrence'] = "00:00"

    # Convert to dataframe
    df = pd.DataFrame([data])

    # Preprocess
    df = preprocess_data(df)

    # Align with trained features
    expected_columns = model.feature_names_in_

    for col in expected_columns:
        if col not in df.columns:
            df[col] = 0

    df = df[expected_columns]

    # Prediction
    prediction = model.predict(df)[0]
    probability = model.predict_proba(df).max()

    # Risk logic
    if probability > 0.7:
        risk = "HIGH"
        recommendation = "Avoid this area. Contact police if necessary."
    elif probability > 0.4:
        risk = "MEDIUM"
        recommendation = "Stay alert and avoid isolated areas."
    else:
        risk = "LOW"
        recommendation = "Area is relatively safe. Stay cautious."

    return {
        "predicted_crime": prediction,
        "probability": round(float(probability), 2),
        "risk_level": risk,
        "recommendation": recommendation,
        "input_summary": {
            "location": data.get("city", "Unknown"),
            "time": data.get("time_of_occurrence", "Unknown"),
            "weapon_used": data.get("weapon_used", "Not provided")
        }
    }