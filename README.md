#  CLg-project

## Overview

This project is an **AI-powered crime detection and prediction system** designed to assist law enforcement agencies in monitoring suspicious activities and identifying high-risk areas.

The system combines:

* **Computer Vision** for detecting suspicious activities from video footage
* **Machine Learning** for predicting crime-prone areas based on historical data

> ⚠️ This repository currently contains the **MVP planning phase (Step 1)** — implementation will be added in future updates.

---

## 🎯 MVP Goal (Phase 1)

The goal of this phase is to **define a clear and achievable scope** for the project before starting development.

We focus on:

* Avoiding over-complexity
* Building a working prototype first
* Expanding features incrementally

---

## ✅ Features (MVP Scope)

### ✔️ Included in MVP

* 🎥 Upload video (instead of live CCTV)
* 🤖 Detect objects / suspicious activity using AI (YOLO)
* 📊 Basic crime prediction using historical data
* 📈 Simple dashboard for visualization
* 🚨 Alert system (UI / console-based)

---

### ❌ Not Included (Future Scope)

* Live CCTV streaming
* Mobile application
* Advanced deep learning models (LSTM, GNN, etc.)
* Face recognition
* Real-world police system integration

---

## 👤 User Flow

### Police/User Journey:

1. User logs into the system
2. Uploads a video file
3. System analyzes video using AI
4. Suspicious activity is detected
5. Alert is generated
6. User views results on dashboard
7. User checks predicted crime hotspots

---

## ⚙️ System Flow

1. Video is uploaded to backend
2. Backend processes video using AI model
3. AI detects objects / suspicious activity
4. System generates alert if needed
5. Data is stored in database
6. Frontend displays results and insights

---

## 📥 Inputs

* Video file (for detection)
* Crime dataset (CSV format)
* User input (location, time)

---

## 📤 Outputs

* Detected objects / suspicious activity
* Alert notifications
* Crime prediction results
* Dashboard analytics

---

## 🧠 Key Idea

> A system that uses AI to **detect crimes in real-time and predict future crime hotspots**, helping authorities take proactive action.

---

## 🛠️ Planned Tech Stack

### Frontend

* React (Vite)

### Backend

* Flask (Python)

### AI/ML

* YOLOv8 (object detection)
* Scikit-learn (prediction)

### Database

* MongoDB

---

## 📁 Project Structure (Planned)

```
crime-ai-system/
│
├── frontend/        # React app
├── backend/         # Flask APIs
├── ai-model/        # ML & CV models
├── database/        # DB configs
└── datasets/        # Training data
```

---

## 🧩 Development Strategy

* Start with **MVP (basic working system)**
* Focus on **functionality over perfection**
* Gradually add advanced features

---

## 🚀 Next Steps (Upcoming Phases)

* Setup development environment
* Implement AI detection model
* Build prediction model
* Create backend APIs
* Develop frontend dashboard
* Integrate full system

---

## 📌 Status

🟡 Phase: Planning (Step 1 Completed)
🔜 Next: Project Setup & Environment Configuration

---

## 👨‍💻 Contributors

* Shivam Sharma
* Team Members

---

## ⭐ Note

This project is being developed as a **final year B.Tech project** and will be updated step-by-step with complete implementation.
