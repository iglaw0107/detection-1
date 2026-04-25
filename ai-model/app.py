import os
from dotenv import load_dotenv
load_dotenv()
from flask import Flask, request, jsonify
from flask_cors import CORS
import random

from predict import predict_crime
from features.hotspot import predict_hotspots
from features.trends import analyze_trends
from features.area_risk import get_area_risk
from services.gemini_service import generate_crime_summary
from features.top_crimes import get_top_crimes
from features.crime_trends_v2 import get_crime_trends
from features.peak_time import get_peak_crime_time
from features.compare_locations import compare_locations


app = Flask(__name__)

# ─────────────────────────────────────────────
# CORS CONFIG
# ─────────────────────────────────────────────
allowed_origins_env = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://localhost:5000"
)
allowed_origins = [o.strip() for o in allowed_origins_env.split(",")]

CORS(app, origins=allowed_origins)


# ─────────────────────────────────────────────
# HEALTH CHECK
# ─────────────────────────────────────────────
@app.route("/api/v1/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "service": "crimeai-ml"
    })


# ─────────────────────────────────────────────
# PREDICT CRIME
# ─────────────────────────────────────────────
@app.route("/api/v1/predict", methods=["POST"])
def predict():
    data = request.json or {}

    location = data.get("location")
    time = data.get("time")

    if not location or not time:
        return jsonify({"error": "Missing location/time"}), 400

    result = predict_crime(data)

    # AI summary (Gemini)
    result["aiSummary"] = generate_crime_summary({
        "location": location,
        "risk_level": result.get("risk_level"),
        "probability": result.get("probability"),
        "predicted_crime": result.get("predicted_crime"),
        "time": time,
        "weapon_used": data.get("weapon_used", "Unknown"),
        "context": f"Prediction based on crime patterns in {location}"
    })
    return jsonify(result)


# ─────────────────────────────────────────────
# HOTSPOTS
# ─────────────────────────────────────────────
@app.route("/api/v1/hotspots", methods=["POST"])
def hotspots():
    data = request.json or {}

    city = data.get("city")
    top_n = data.get("topN", 5)

    result = predict_hotspots(city=city, top_n=top_n)

    if not result.get("success"):
        return jsonify(result), 500

    return jsonify(result)


# ─────────────────────────────────────────────
# DETECT (VIDEO ANALYSIS - MOCK)
# ─────────────────────────────────────────────
@app.route("/api/v1/detect", methods=["POST"])
def detect():
    data = request.json or {}

    video_path = data.get("videoPath")
    camera_id = data.get("cameraId", "cam_unknown")
    location = data.get("location", "Unknown Location")

    if not video_path:
        return jsonify({"error": "videoPath required"}), 400

    # ─────────────────────────────
    # GET HOTSPOTS (REAL DATA)
    # ─────────────────────────────
    hotspot_result = predict_hotspots(city=location, top_n=3)

    hotspots = hotspot_result.get("hotspots", []) \
        if hotspot_result.get("success") else []

    primary = hotspots[0] if hotspots else {}

    # ─────────────────────────────
    # BASE CONFIDENCE FROM RISK
    # ─────────────────────────────
    risk_score = primary.get("riskScore", 5)

    base_confidence = min(0.9, 0.4 + (risk_score / 20))

    # ─────────────────────────────
    # TIME-BASED BOOST
    # ─────────────────────────────
    hour = random.randint(0, 23)

    if 20 <= hour or hour <= 5:
        base_confidence += 0.1

    # ─────────────────────────────
    # RANDOM VARIATION (AI FEEL)
    # ─────────────────────────────
    confidence = round(
        min(0.95, max(0.3, base_confidence + random.uniform(-0.1, 0.1))),
        2
    )

    # ─────────────────────────────
    # SEVERITY LOGIC
    # ─────────────────────────────
    severity = (
        "high" if confidence > 0.8 else
        "medium" if confidence > 0.6 else
        "low"
    )

    # ─────────────────────────────
    # CRIME TYPE
    # ─────────────────────────────
    crime_type = primary.get(
        "mostCommonCrime",
        random.choice(["theft", "robbery", "assault"])
    )

    # ─────────────────────────────
    # AI SUMMARY
    # ─────────────────────────────
    summary = generate_crime_summary({
        "location": location,
        "risk_level": severity,
        "probability": confidence,
        "predicted_crime": crime_type,
        "time": "Live camera feed",
        "weapon_used": "Unknown",
        "context": f"Real-time detection from camera {camera_id}"
    })

    recommendation = (
        primary.get("recommendation")
        if primary
        else f"Increase monitoring and patrol near {location}."
    )

    # ─────────────────────────────
    # FINAL RESPONSE
    # ─────────────────────────────
    return jsonify({
        "detectedEvents": [
            {
                "crimeType": crime_type,
                "severity": severity,
                "confidenceScore": confidence,
                "timestampInVideo": f"00:00:{random.randint(5, 40)}",
                "aiSummary": summary,
                "recommendation": recommendation,
            }
        ]
    })

# ─────────────────────────────────────────────
# TRENDS
# ─────────────────────────────────────────────
@app.route("/api/v1/trends", methods=["POST"])
def trends():
    data = request.json or {}

    result = analyze_trends(
        group_by=data.get("groupBy", "month"),
        city=data.get("city"),
        crime_type=data.get("crimeType"),
        start_date=data.get("startDate"),
        end_date=data.get("endDate"),
    )

    if not result.get("success"):
        return jsonify(result), 500

    return jsonify(result)


# ─────────────────────────────────────────────
# AREA RISK
# ─────────────────────────────────────────────
@app.route("/api/v1/area-risk", methods=["POST"])
def area_risk():
    data = request.json or {}

    city = data.get("city")

    if not city:
        return jsonify({"error": "city is required"}), 400

    result = get_area_risk(city=city)

    if not result.get("success"):
        return jsonify(result), 404

    weapon = "Unknown"
    if result.get("weaponStats") and len(result["weaponStats"]) > 0:
        weapon = result["weaponStats"][0].get("weapon", "Unknown")

    summary = result.get("summary", {})

    result["aiSummary"] = generate_crime_summary({
        "location": city,
        "risk_level": result.get("riskLevel"),
        "probability": result.get("riskScore", 0) / 10,
        "predicted_crime": summary.get("mostCommonCrime"),
        "time": summary.get("mostDangerousTime"),
        "weapon_used": weapon,
        "context": f"Total crimes: {summary.get('totalCrimes')}, trend-based analysis"
    })

    return jsonify(result)

@app.route("/api/v1/top-crimes", methods=["POST"])
def top_crimes():
    data = request.json or {}

    location = data.get("location")
    years = data.get("years", 3)

    if not location:
        return jsonify({"error": "location required"}), 400

    result = get_top_crimes(location, years)

    return jsonify(result)




@app.route("/api/v1/crime-trends-v2", methods=["POST"])
def crime_trends_v2():
    data = request.json or {}
    location = data.get("location")

    return jsonify(get_crime_trends(location))


@app.route("/api/v1/peak-time", methods=["POST"])
def peak_time():
    data = request.json or {}
    location = data.get("location")

    return jsonify(get_peak_crime_time(location))

@app.route("/api/v1/compare-locations", methods=["POST"])
def compare():
    data = request.json or {}
    locations = data.get("locations", [])

    return jsonify(compare_locations(locations))


# ─────────────────────────────────────────────
# RUN SERVER
# ─────────────────────────────────────────────
if __name__ == "__main__":
    port = int(os.getenv("PORT", 10000))
    debug = os.getenv("FLASK_ENV", "production") == "development"

    app.run(host="0.0.0.0", port=port, debug=debug)