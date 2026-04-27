# import os
# import requests

# GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
# OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

# def generate_crime_summary(data: dict) -> str:

#     prompt = f"""
#         You are a crime analysis AI.

#         Analyze the data and generate a realistic crime risk summary.

#         DATA:
#         Location: {data.get("location")}
#         Crime Type: {data.get("predicted_crime")}
#         Risk Level: {data.get("risk_level")}
#         Probability: {data.get("probability")}
#         Time: {data.get("time")}
#         Weapon: {data.get("weapon_used")}

#         RULES:
#         - Do NOT invent new facts
#         - Do NOT assume crimes happened
#         - Only describe risk and patterns
#         - Keep it realistic and analytical
#         - Mention possible reasons (time, area, behavior)
#         - Give a short recommendation

#         OUTPUT:
#         """

#     # ───────────── GEMINI FIRST ─────────────
#     try:
#         GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent"

#         res = requests.post(
#             f"{GEMINI_URL}?key={GEMINI_API_KEY}",
#             json={
#                 "contents": [{"parts": [{"text": prompt}]}]
#             },
#             timeout=10
#         )

#         data_json = res.json()
#         print("🔵 Gemini Response:", res.text)

#         if "candidates" in data_json:
#             return data_json["candidates"][0]["content"]["parts"][0]["text"]

#     except Exception as e:
#         print("Gemini failed:", e)

#     # ───────────── FALLBACK: OPENROUTER ─────────────
#     try:
#         res = requests.post(
#             "https://openrouter.ai/api/v1/chat/completions",
#             headers={
#                 "Authorization": f"Bearer {OPENROUTER_API_KEY}",
#                 "Content-Type": "application/json"
#             },
#             json={
#                 "model": "openai/gpt-3.5-turbo",
#                 "messages": [
#                     {"role": "user", "content": prompt}
#                 ]
#             },
#             timeout=10
#         )

#         data_json = res.json()
#         print("🟢 OpenRouter Response:", res.text)

#         if "choices" in data_json:
#             return data_json["choices"][0]["message"]["content"]

#         print("OpenRouter error:", data_json)

#     except Exception as e:
#         print("OpenRouter failed:", e)

#     # ───────────── FINAL FALLBACK ─────────────
#     return (
#         f"{data.get('predicted_crime', 'Crime')} risk detected in "
#         f"{data.get('location', 'this area')}. "
#         f"Stay cautious."
#     )



import os
import requests

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")


def generate_crime_summary(data: dict) -> str:
    prompt = f"""
You are a crime analysis AI.

Analyze the data and generate a realistic crime risk summary.

DATA:
Location: {data.get("location")}
Crime Type: {data.get("predicted_crime")}
Risk Level: {data.get("risk_level")}
Probability: {data.get("probability")}
Time: {data.get("time")}
Weapon: {data.get("weapon_used")}

RULES:
- Do NOT invent new facts
- Do NOT assume crimes happened
- Only describe risk and patterns
- Keep it realistic and analytical
- Mention possible reasons (time, area, behavior)
- Give a short recommendation

OUTPUT:
"""

    # ───────────── PRIMARY: OPENROUTER ─────────────
    if OPENROUTER_API_KEY:
        try:
            res = requests.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": "openai/gpt-3.5-turbo",
                    "messages": [
                        {"role": "user", "content": prompt}
                    ],
                },
                timeout=10,
            )

            data_json = res.json()
            print("🟢 OpenRouter Response:", res.status_code)

            if "choices" in data_json and len(data_json["choices"]) > 0:
                return data_json["choices"][0]["message"]["content"]

            print("OpenRouter invalid response:", data_json)

        except Exception as e:
            print("OpenRouter failed:", e)

    # ───────────── FALLBACK: GEMINI ─────────────
    if GEMINI_API_KEY:
        try:
            GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent"

            res = requests.post(
                f"{GEMINI_URL}?key={GEMINI_API_KEY}",
                json={
                    "contents": [{"parts": [{"text": prompt}]}]
                },
                timeout=10,
            )

            data_json = res.json()
            print("🔵 Gemini Response:", res.status_code)

            if "candidates" in data_json:
                return data_json["candidates"][0]["content"]["parts"][0]["text"]

            print("Gemini invalid response:", data_json)

        except Exception as e:
            print("Gemini failed:", e)

    # ───────────── FINAL FALLBACK ─────────────
    return (
        f"{data.get('predicted_crime', 'Crime')} risk detected in "
        f"{data.get('location', 'this area')}. Stay cautious."
    )