from pydantic import BaseModel
from typing import Optional, Dict, List
from datetime import datetime

class PilgrimCreate(BaseModel):
    name: str
    age: int
    phone: str
    group_size: int = 1
    category: str = "General Darshan" # General Darshan, Special Darshan, VIP, Senior Citizen, Divyang, Children / Family, Medical / Emergency, Other
    darshan_type: Optional[str] = None
    zone: Optional[str] = "Queue Complex"
    counter: Optional[str] = "Counter 1"

class PilgrimStatusUpdate(BaseModel):
    status: str # WAITING, CALLED, SERVING, IN_DARSHAN, COMPLETED, SKIPPED, CANCELLED, EXITED
    counter: Optional[str] = None

class PilgrimResponse(BaseModel):
    id: int
    temple_id: str
    name: str
    age: int
    phone: str
    group_size: int
    category: str
    darshan_type: Optional[str]
    token: str
    queue_position: int
    zone: str
    counter: str
    estimated_wait_min: float
    status: str
    registration_time: datetime
    called_time: Optional[datetime] = None
    exit_time: Optional[datetime] = None

    class Config:
        from_attributes = True

class QueueSummaryResponse(BaseModel):
    total_active_devotees: int
    category_breakdown: Dict[str, int]
    status_breakdown: Dict[str, int]
    counter_allocations: Dict[str, str]
    current_token_serving: str
    estimated_avg_wait_min: float
