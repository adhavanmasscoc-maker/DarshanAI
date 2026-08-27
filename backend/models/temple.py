from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean
from backend.database import Base

class Temple(Base):
    __tablename__ = "temples"

    id = Column(Integer, primary_key=True, index=True)
    temple_id = Column(String(50), unique=True, index=True, nullable=False) # e.g. TEMPLE-001
    name = Column(String(200), nullable=False)
    address = Column(String(300), nullable=True)
    city = Column(String(100), nullable=False)
    state = Column(String(100), nullable=False)
    country = Column(String(100), default="India")
    contact_number = Column(String(30), nullable=True)
    email = Column(String(100), nullable=True)
    capacity = Column(Integer, default=15000)
    opening_time = Column(String(20), default="04:00 AM")
    closing_time = Column(String(20), default="10:00 PM")
    status = Column(String(20), default="ACTIVE") # ACTIVE, INACTIVE, MAINTENANCE
    latitude = Column(Float, default=12.9716)
    longitude = Column(Float, default=77.5946)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
