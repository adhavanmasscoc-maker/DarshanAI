from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey
from backend.database import Base

class TempleZone(Base):
    __tablename__ = "temple_zones"

    id = Column(Integer, primary_key=True, index=True)
    temple_id = Column(String(50), ForeignKey("temples.temple_id"), nullable=False, index=True)
    zone_code = Column(String(50), nullable=False) # e.g. main_entrance, queue_complex, sanctum
    name = Column(String(150), nullable=False)
    zone_type = Column(String(50), default="QUEUE") # ENTRY, REGISTRATION, QUEUE, VIP, SANCTUM, WAITING, MEDICAL, SECURITY, PRASADAM, EXIT, PARKING
    
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    capacity = Column(Integer, default=2000)
    is_verified = Column(Boolean, default=True) # True = Verified GPS, False = Operational Simulation
    icon_type = Column(String(50), default="MapPin")
    staff_assigned = Column(Integer, default=5)

    created_at = Column(DateTime, default=datetime.utcnow)
