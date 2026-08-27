from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Index
from backend.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    temple_id = Column(String(50), ForeignKey("temples.temple_id"), nullable=True, index=True)
    email = Column(String(100), unique=True, index=True, nullable=False)
    mobile = Column(String(20), nullable=True)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(100), nullable=False)
    
    role = Column(String(50), default="VOLUNTEER")
    status = Column(String(20), default="Active")
    is_active = Column(Boolean, default=True)
    
    reset_token = Column(String(100), nullable=True)
    reset_token_expires = Column(DateTime, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)

    __table_args__ = (
        Index('idx_users_email_temple', 'email', 'temple_id'),
    )
