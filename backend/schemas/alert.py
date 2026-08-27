from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AlertCreate(BaseModel):
    severity: str # LOW, MEDIUM, HIGH, CRITICAL
    zone: str = "General Premises"
    description: str
    alert_type: str = "CROWD_SURGE" # CROWD_SURGE, RISK_SURGE, ANOMALY, MEDICAL, SECURITY

class AlertResponse(BaseModel):
    id: int
    temple_id: str
    severity: str
    zone: str
    time: datetime
    description: str
    alert_type: str
    status: str

    class Config:
        from_attributes = True
