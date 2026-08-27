import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler, LabelEncoder

class TempleDataPreprocessor:
    def __init__(self):
        self.scaler = StandardScaler()
        self.weather_categories = ["Clear", "Cloudy", "Light Rain", "Heavy Rain"]
        self.festival_categories = [
            "None", "Maha Pongal / Makar Sankranti", "Maha Shivratri", "Holi Utsav", 
            "Rama Navami", "Krishna Janmashtami", "Navratri Start", 
            "Dussehra / Vijayadashami", "Diwali Deepavali", "Vaikunta Ekadasi"
        ]
        self.feature_names = None
        self.is_fitted = False

    def engineer_features(self, df):
        data = df.copy()
        
        # Cyclical Encodings
        data["hour_sin"] = np.sin(2 * np.pi * data["hour"] / 24.0)
        data["hour_cos"] = np.cos(2 * np.pi * data["hour"] / 24.0)
        data["month_sin"] = np.sin(2 * np.pi * data["month"] / 12.0)
        data["month_cos"] = np.cos(2 * np.pi * data["month"] / 12.0)
        
        # Operational Ratios
        gates = np.maximum(1, data["number_of_open_gates"])
        staff = np.maximum(1, data["staff_available"])
        
        data["queue_per_gate"] = data["queue_length"] / gates
        data["entry_per_staff"] = data["entry_rate"] / staff
        data["net_flow_rate"] = data["entry_rate"] - data["exit_rate"]
        
        # One-Hot Weather
        for w in self.weather_categories:
            data[f"weather_{w}"] = (data["weather"] == w).astype(int)
            
        # Binary Festival indicator
        data["is_major_festival"] = data["festival_type"].apply(lambda x: 1 if x != "None" else 0)
        
        return data

    def get_feature_columns(self):
        return [
            "hour", "day_of_week", "month", "is_weekend", "is_holiday", 
            "is_festival", "special_event", "temperature", "rainfall",
            "previous_hour_visitors", "previous_day_visitors",
            "entry_rate", "exit_rate", "queue_length", "number_of_open_gates",
            "staff_available", "average_service_time",
            "hour_sin", "hour_cos", "month_sin", "month_cos",
            "queue_per_gate", "entry_per_staff", "net_flow_rate",
            "weather_Clear", "weather_Cloudy", "weather_Light Rain", "weather_Heavy Rain",
            "is_major_festival"
        ]

    def fit_transform(self, df):
        df_engineered = self.engineer_features(df)
        feature_cols = self.get_feature_columns()
        self.feature_names = feature_cols
        
        X = df_engineered[feature_cols].copy()
        # Handle missing if any
        X = X.fillna(X.mean())
        
        X_scaled = self.scaler.fit_transform(X)
        self.is_fitted = True
        return X_scaled, feature_cols

    def transform_single(self, input_dict):
        """Preprocesses a single real-time payload dictionary for model inference."""
        df = pd.DataFrame([input_dict])
        
        # Defaults if missing
        if "weather" not in df.columns:
            df["weather"] = "Clear"
        if "festival_type" not in df.columns:
            df["festival_type"] = "None"
        if "month" not in df.columns:
            df["month"] = 1
        if "day_of_week" not in df.columns:
            df["day_of_week"] = 0
            
        df_engineered = self.engineer_features(df)
        feature_cols = self.get_feature_columns()
        
        X = df_engineered[feature_cols].copy()
        X = X.fillna(0)
        
        X_scaled = self.scaler.transform(X)
        return X_scaled
