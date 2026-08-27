from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, JSON
from backend.database import Base

class CrowdObservation(Base):
    __tablename__ = "crowd_observations"

    id = Column(Integer, primary_key=True, index=True)
    temple_id = Column(String(50), ForeignKey("temples.temple_id"), nullable=False, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    visitor_count = Column(Integer, nullable=False)
    entry_rate = Column(Integer, default=0)
    exit_rate = Column(Integer, default=0)
    queue_length = Column(Integer, default=0)
    waiting_time = Column(Float, default=0.0)
    crowd_level = Column(String(30), default="LOW")
    risk_level = Column(String(30), default="LOW")
    open_gates = Column(Integer, default=4)
    staff_count = Column(Integer, default=20)
    zone_data = Column(JSON, nullable=True)

class TempleZone(Base):
    __tablename__ = "temple_zones"

    id = Column(Integer, primary_key=True, index=True)
    temple_id = Column(String(50), ForeignKey("temples.temple_id"), nullable=False, index=True)
    zone_code = Column(String(50), nullable=False)
    name = Column(String(100), nullable=False)
    capacity = Column(Integer, default=2000)
    current_visitors = Column(Integer, default=0)
    queue_length = Column(Integer, default=0)
    entry_rate = Column(Integer, default=0)
    exit_rate = Column(Integer, default=0)
    waiting_time = Column(Float, default=0.0)
    risk_level = Column(String(30), default="LOW")
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
