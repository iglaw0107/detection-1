import pandas as pd
import pickle
from sklearn.ensemble import RandomForestClassifier
from utils.preprocess import preprocess_data

# Load data
df = pd.read_csv("data/crime_data.csv")

# Preprocess
df = preprocess_data(df)

# Target (crime type classification)
y = df['crime_type']
X = df.drop(columns=['crime_type', 'time', 'date'])

# Train model
model = RandomForestClassifier(n_estimators=100)
model.fit(X, y)

# Save model
with open("models/crime_model.pkl", "wb") as f:
    pickle.dump(model, f)

print("✅ Model trained and saved")