from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
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
    capacity: int = 18000
    opening_time: str = "04:00 AM"
    closing_time: str = "10:00 PM"
    status: str = "ACTIVE"
    latitude: float = 20.8880
    longitude: float = 70.4012
    zoom_level: int = 18

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
    zoom_level: Optional[int] = None

class TempleLocationUpdate(BaseModel):
    latitude: float = Field(..., ge=-90.0, le=90.0, description="Geographic Latitude between -90 and 90")
    longitude: float = Field(..., ge=-180.0, le=180.0, description="Geographic Longitude between -180 and 180")
    address: Optional[str] = None
    zoom_level: Optional[int] = Field(18, ge=10, le=21)

class ZoneLocationUpdate(BaseModel):
    latitude: float = Field(..., ge=-90.0, le=90.0)
    longitude: float = Field(..., ge=-180.0, le=180.0)
    capacity: Optional[int] = None
    name: Optional[str] = None

class TempleZoneResponse(BaseModel):
    id: int
    zone_code: str
    name: str
    zone_type: str
    latitude: float
    longitude: float
    capacity: int
    current_devotees: int
    occupancy_percent: int
    queue_length: int
    estimated_wait_min: float
    risk_level: str # LOW, MODERATE, HIGH, CRITICAL
    is_verified: bool
    icon_type: str
    staff_assigned: int
    ai_predicted_devotees_30min: int
    ai_recommendation: str

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
    zoom_level: int
    created_at: datetime

    class Config:
        from_attributes = True

class TempleMapResponse(BaseModel):
    temple: TempleResponse
    zones: List[TempleZoneResponse]
    boundary_coordinates: Optional[List[List[float]]] = None
    mode: str = "LIVE DATA"
    total_inside_devotees: int
    total_waiting_devotees: int
    overall_temple_risk: str
