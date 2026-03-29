from flask import Flask, request, jsonify
from predict import predict_crime

app = Flask(__name__)

@app.route("/predict-crime", methods=["POST"])
def predict():
    data = request.json

    location = data.get("location")
    time = data.get("time")

    if not location or not time:
        return jsonify({"error": "Missing fields"}), 400

    result = predict_crime({
        "location": location,
        "time": time
    })

    return jsonify(result)

if __name__ == "__main__":
    app.run(port=5001, debug=True)