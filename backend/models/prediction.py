from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean, JSON
from backend.database import Base

class PredictionLog(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    temple_id = Column(String(50), ForeignKey("temples.temple_id"), nullable=False, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    predicted_visitor_count = Column(Integer, nullable=False)
    predicted_crowd_level = Column(String(30), nullable=False)
    predicted_risk_level = Column(String(30), nullable=False)
    predicted_waiting_time = Column(Float, nullable=False)
    is_anomaly = Column(Boolean, default=False)
    anomaly_score = Column(Float, default=0.0)
    recommendations = Column(JSON, nullable=True)
