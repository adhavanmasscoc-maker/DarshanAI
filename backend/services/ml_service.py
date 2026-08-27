import os
import json
import joblib
import pandas as pd
import numpy as np

class MLService:
    def __init__(self):
        self.models_dir = "models"
        self.preprocessor = None
        self.crowd_regressor = None
        self.crowd_classifier = None
        self.risk_classifier = None
        self.waiting_time_model = None
        self.anomaly_detector = None
        self.metrics = {}
        self.feature_importance = {}
        self.load_all_artifacts()

    def load_all_artifacts(self):
        try:
            self.preprocessor = joblib.load(os.path.join(self.models_dir, "preprocessing_pipeline.pkl"))
            self.crowd_regressor = joblib.load(os.path.join(self.models_dir, "crowd_regressor.pkl"))
            self.crowd_classifier = joblib.load(os.path.join(self.models_dir, "crowd_classifier.pkl"))
            self.risk_classifier = joblib.load(os.path.join(self.models_dir, "risk_classifier.pkl"))
            self.waiting_time_model = joblib.load(os.path.join(self.models_dir, "waiting_time_model.pkl"))
            self.anomaly_detector = joblib.load(os.path.join(self.models_dir, "anomaly_model.pkl"))
            
            with open(os.path.join(self.models_dir, "model_metrics.json"), "r") as f:
                self.metrics = json.load(f)
                
            with open(os.path.join(self.models_dir, "feature_importance.json"), "r") as f:
                self.feature_importance = json.load(f)
                
            print("[ML SERVICE] All models & evaluation metrics successfully loaded into memory.")
        except Exception as e:
            print(f"[ML SERVICE ERROR] Could not load ML artifacts: {e}")

    def predict(self, payload: dict):
        if not self.preprocessor:
            raise RuntimeError("ML Models are not loaded.")

        X_scaled = self.preprocessor.transform_single(payload)

        pred_vis = int(self.crowd_regressor.predict(X_scaled)[0])
        pred_crw = str(self.crowd_classifier.predict(X_scaled)[0])
        pred_rsk = str(self.risk_classifier.predict(X_scaled)[0])
        pred_wt = round(float(self.waiting_time_model.predict(X_scaled)[0]), 1)
        
        is_anom, anom_score = self.anomaly_detector.predict_anomaly(X_scaled)
        
        recs = self._generate_recommendations(pred_crw, pred_rsk, payload.get("queue_length", 0), is_anom)
        
        return {
            "predicted_visitor_count": pred_vis,
            "predicted_crowd_level": pred_crw,
            "predicted_risk_level": pred_rsk,
            "predicted_waiting_time": pred_wt,
            "is_anomaly": is_anom,
            "anomaly_score": anom_score,
            "recommendations": recs
        }

    def _generate_recommendations(self, crowd_lvl, risk_lvl, queue_len, is_anomaly):
        recs = []
        if is_anomaly:
            recs.append("🚨 Anomaly Warning: Unusual surge pattern detected. Inspect gate throughput immediately.")
        if risk_lvl in ["HIGH", "CRITICAL"]:
            recs.append("⚠️ Safety Action: Open auxiliary entry gates and activate batch queue control.")
        elif risk_lvl == "MEDIUM":
            recs.append("ℹ️ Operational Note: Monitor sanctum hall density and deploy standby staff.")
        else:
            recs.append("✅ Operational Status: All parameters within standard safety limits.")
        return recs

ml_service = MLService()
