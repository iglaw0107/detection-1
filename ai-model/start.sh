#!/bin/bash
set -e  

echo "🚀 Starting CrimeAI ML service..."

mkdir -p models

# Download model if not exists
if [ ! -f "models/crime_model.pkl" ]; then
  echo "⬇️ Downloading model..."
  curl -L "https://drive.google.com/uc?export=download&confirm=$(curl -sL "https://drive.google.com/uc?export=download&id=1kOSfD6BzPxCmz1EHvmil0S6m0HXUcnrg" | grep -o 'confirm=[^&]*' | sed 's/confirm=//')&id=1kOSfD6BzPxCmz1EHvmil0S6m0HXUcnrg" -o models/crime_model.pkl
fi

gunicorn app:app --bind 0.0.0.0:$PORT