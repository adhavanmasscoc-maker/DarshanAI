from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from backend.database import Base

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    temple_id = Column(String(50), ForeignKey("temples.temple_id"), nullable=False, index=True)
    severity = Column(String(20), nullable=False) # LOW, MEDIUM, HIGH, CRITICAL
    zone = Column(String(100), default="General Premises")
    time = Column(DateTime, default=datetime.utcnow)
    description = Column(String(300), nullable=False)
    alert_type = Column(String(50), default="CROWD_SURGE") # CROWD_SURGE, RISK_SURGE, ANOMALY, MEDICAL, SECURITY
    status = Column(String(20), default="ACTIVE") # ACTIVE, RESOLVED
    created_at = Column(DateTime, default=datetime.utcnow)
