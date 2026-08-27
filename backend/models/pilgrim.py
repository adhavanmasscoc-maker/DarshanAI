from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float, Index
from backend.database import Base

class Pilgrim(Base):
    __tablename__ = "pilgrims"

    id = Column(Integer, primary_key=True, index=True)
    temple_id = Column(String(50), ForeignKey("temples.temple_id"), nullable=False, index=True)
    name = Column(String(100), nullable=False)
    age = Column(Integer, nullable=False)
    phone = Column(String(20), nullable=False)
    group_size = Column(Integer, default=1)
    
    category = Column(String(50), default="General Darshan", index=True)
    darshan_type = Column(String(50), default="General Queue")
    
    token = Column(String(50), unique=True, index=True, nullable=False)
    queue_position = Column(Integer, default=1)
    zone = Column(String(100), default="Queue Complex")
    counter = Column(String(50), default="Counter 1")
    estimated_wait_min = Column(Float, default=30.0)
    
    status = Column(String(30), default="WAITING", index=True)
    
    registration_time = Column(DateTime, default=datetime.utcnow)
    called_time = Column(DateTime, nullable=True)
    exit_time = Column(DateTime, nullable=True)

    __table_args__ = (
        Index('idx_pilgrims_temple_status', 'temple_id', 'status'),
        Index('idx_pilgrims_temple_category', 'temple_id', 'category'),
    )
