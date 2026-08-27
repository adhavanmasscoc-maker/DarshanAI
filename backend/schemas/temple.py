from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class TempleCreate(BaseModel):
    temple_id: str
    name: str
    address: Optional[str] = None
    city: str
    state: str
    country: str = "India"
    contact_number: Optional[str] = None
    email: Optional[str] = None
    capacity: int = 15000
    opening_time: str = "04:00 AM"
    closing_time: str = "10:00 PM"
    status: str = "ACTIVE"
    latitude: float = 12.9716
    longitude: float = 77.5946

class TempleUpdate(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    contact_number: Optional[str] = None
    email: Optional[str] = None
    capacity: Optional[int] = None
    opening_time: Optional[str] = None
    closing_time: Optional[str] = None
    status: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class TempleResponse(BaseModel):
    id: int
    temple_id: str
    name: str
    address: Optional[str]
    city: str
    state: str
    country: str
    contact_number: Optional[str]
    email: Optional[str]
    capacity: int
    opening_time: str
    closing_time: str
    status: str
    latitude: float
    longitude: float
    created_at: datetime

    class Config:
        from_attributes = True
