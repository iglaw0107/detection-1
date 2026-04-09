# ai-model/predict.py
import pickle
import pandas as pd
from utils.preprocess import preprocess_data

MODEL_PATH = "models/crime_model.pkl"

with open(MODEL_PATH, "rb") as f:
    model = pickle.load(f)

def predict_crime(input_data: dict) -> dict:
    data = dict(input_data)  # copy to avoid mutating original

    # Normalize key names
    if 'location' in data:
        data['city'] = data.pop('location')
    if 'time' in data and 'time_of_occurrence' not in data:
        data['time_of_occurrence'] = data.pop('time')
    elif 'time_of_occurrence' not in data:
        data['time_of_occurrence'] = "00:00"

    df = pd.DataFrame([data])
    df = preprocess_data(df)

    # Align columns with training features
    expected_columns = model.feature_names_in_
    for col in expected_columns:
        if col not in df.columns:
            df[col] = 0
    df = df[expected_columns]

    prediction = model.predict(df)[0]
    probabilities = model.predict_proba(df).max()

    if probabilities > 0.7:
        risk = "HIGH"
        recommendation = "Avoid this area. Contact police if necessary."
    elif probabilities > 0.4:
        risk = "MEDIUM"
        recommendation = "Stay alert and avoid isolated areas."
    else:
        risk = "LOW"
        recommendation = "Area is relatively safe. Stay cautious."

    return {
        "predicted_crime": prediction,
        "probability": round(float(probabilities), 2),
        "risk_level": risk,
        "recommendation": recommendation,
        "input_summary": {
            "location": data.get("city", "Unknown"),
            "time": data.get("time_of_occurrence", "Unknown"),
            "weapon_used": data.get("weapon_used", "Not provided")
        }
    }