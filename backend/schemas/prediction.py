from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class PredictPayload(BaseModel):
    hour: int = 8
    day_of_week: int = 5
    month: int = 10
    is_weekend: int = 1
    is_holiday: int = 0
    is_festival: int = 0
    festival_type: str = "None"
    special_event: int = 0
    weather: str = "Clear"
    temperature: float = 28.5
    rainfall: float = 0.0
    previous_hour_visitors: int = 3500
    previous_day_visitors: int = 18000
    entry_rate: int = 1200
    exit_rate: int = 1000
    queue_length: int = 750
    number_of_open_gates: int = 5
    staff_available: int = 30
    average_service_time: float = 2.4

class PredictionResponse(BaseModel):
    predicted_visitor_count: int
    predicted_crowd_level: str
    predicted_risk_level: str
    predicted_waiting_time: float
    is_anomaly: bool
    anomaly_score: float
    recommendations: List[str]

    class Config:
        from_attributes = True
