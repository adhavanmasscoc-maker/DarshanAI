import os
import joblib
import numpy as np
from sklearn.ensemble import IsolationForest

class CrowdAnomalyDetector:
    def __init__(self, contamination=0.03, random_state=42):
        self.model = IsolationForest(
            n_estimators=100,
            contamination=contamination,
            random_state=random_state,
            n_jobs=-1
        )
        self.is_fitted = False

    def fit(self, X):
        self.model.fit(X)
        self.is_fitted = True
        return self

    def predict_anomaly(self, X_scaled):
        """Returns True if anomaly, False if normal, plus anomaly score."""
        if not self.is_fitted:
            raise RuntimeError("Anomaly model is not fitted yet.")
            
        preds = self.model.predict(X_scaled) # -1 for anomaly, 1 for normal
        scores = self.model.score_samples(X_scaled) # lower score means higher anomaly likelihood
        
        is_anomaly = bool(preds[0] == -1)
        anomaly_score = round(float(-scores[0]), 4) # normalized positive score
        
        return is_anomaly, anomaly_score
