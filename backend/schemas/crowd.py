from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime

class CrowdObservationCreate(BaseModel):
    visitor_count: int
    entry_rate: int
    exit_rate: int
    queue_length: int
    waiting_time: float
    crowd_level: str
    risk_level: str
    open_gates: int = 4
    staff_count: int = 20
    zone_data: Optional[Dict[str, Any]] = None

class CrowdObservationResponse(BaseModel):
    id: int
    temple_id: str
    timestamp: datetime
    visitor_count: int
    entry_rate: int
    exit_rate: int
    queue_length: int
    waiting_time: float
    crowd_level: str
    risk_level: str
    open_gates: int
    staff_count: int
    zone_data: Optional[Dict[str, Any]]

    class Config:
        from_attributes = True
