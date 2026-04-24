import os
import urllib.request
import joblib  # Use joblib instead of pickle for memory efficiency
import pandas as pd
from utils.preprocess import preprocess_data

# Configuration
MODEL_PATH = "models/crime_model.pkl"
DROPBOX_URL = "https://www.dropbox.com/scl/fi/c9q1yw1o1npx4ltmyh17q/crime_model.pkl?rlkey=ug4epwpuc1ibg8c07c5inrme8&st=e5vm582t&dl=1"

def download_model():
    """Downloads the model from Dropbox if it doesn't exist locally."""
    if not os.path.exists("models"):
        os.makedirs("models")
    
    if not os.path.exists(MODEL_PATH):
        print("⬇️ Downloading model from Dropbox... this may take a moment.")
        try:
            # Using urlretrieve to save the 706MB file directly to disk
            urllib.request.urlretrieve(DROPBOX_URL, MODEL_PATH)
            print(f"✅ Download complete: {MODEL_PATH}")
        except Exception as e:
            print(f"❌ Download failed: {e}")
            raise

# 1. Ensure model exists
download_model()

# 2. Load the model globally (only once)
# Note: joblib is better than pickle for large numpy-based models
try:
    print("🧠 Loading ML model into memory...")
    model = joblib.load(MODEL_PATH)
    print("✅ Model loaded successfully.")
except Exception as e:
    print(f"❌ Error loading model: {e}")
    # Fallback to pickle if joblib fails, though joblib is recommended
    import pickle
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

    # Preprocess
    df = pd.DataFrame([data])
    df = preprocess_data(df)

    # Align columns with training features
    # This prevents errors if input data is missing specific categories
    expected_columns = model.feature_names_in_
    for col in expected_columns:
        if col not in df.columns:
            df[col] = 0
    df = df[expected_columns]

    # Inference
    prediction = model.predict(df)[0]
    probabilities = model.predict_proba(df).max()

    # Risk Logic
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