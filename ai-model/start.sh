#!/bin/bash
set -e

echo "🚀 Starting CrimeAI ML service..."

mkdir -p models

# The File ID from your URL
FILE_ID="1kOSfD6BzPxCmz1EHvmil0S6m0HXUcnrg"
FILENAME="models/crime_model.pkl"

if [ ! -f "$FILENAME" ]; then
    echo "⬇️ Downloading model from Google Drive..."
    
    # 1. Get the confirmation token
    CONFIRM=$(curl -sc /tmp/gcookie "https://drive.google.com/uc?export=download&id=${FILE_ID}" | grep -o 'confirm=[^&]*' | sed 's/confirm=//')
    
    # 2. Download the actual file using the token and the cookie
    curl -Lb /tmp/gcookie "https://drive.google.com/uc?export=download&confirm=${CONFIRM}&id=${FILE_ID}" -o "$FILENAME"
    
    echo "✅ Download complete."
else
    echo "📦 Model already exists, skipping download."
fi

echo "🔥 Launching Gunicorn..."
gunicorn app:app --bind 0.0.0.0:$PORT