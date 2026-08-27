from pydantic import BaseModel, EmailStr
from typing import Optional

class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    temple_id: Optional[str] = None

class RegisterUserRequest(BaseModel):
    full_name: str
    email: EmailStr
    mobile: str
    temple_id: str
    temple_name: Optional[str] = None
    role: str = "Temple Admin" # Temple Admin, Receptionist, Queue Manager, Security, Volunteer
    password: str
    confirm_password: str
    
    # Optional inline temple onboarding details if temple does not exist
    city: Optional[str] = "Somnath"
    state: Optional[str] = "Gujarat"
    capacity: Optional[int] = 18000
    opening_time: Optional[str] = "04:00 AM"
    closing_time: Optional[str] = "10:00 PM"

class ForgotPasswordRequest(BaseModel):
    email: EmailStr
    temple_id: str

class ResetPasswordRequest(BaseModel):
    reset_token: str
    new_password: str
    confirm_password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int
    email: str
    full_name: str
    role: str
    temple_id: Optional[str]
    temple_name: str

class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    role: str
    temple_id: Optional[str]
    temple_name: str
    status: str
    is_active: bool

    class Config:
        from_attributes = True
