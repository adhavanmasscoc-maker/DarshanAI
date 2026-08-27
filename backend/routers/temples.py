from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from backend.database import get_db
from backend.models.temple import Temple
from backend.models.user import User
from backend.schemas.temple import TempleCreate, TempleUpdate, TempleResponse
from backend.dependencies.auth import get_current_user, require_role

router = APIRouter(prefix="/temples", tags=["Temples Management"])

@router.get("", response_model=List[TempleResponse])
def get_temples(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role == "SUPER_ADMIN":
        return db.query(Temple).all()
    else:
        return db.query(Temple).filter(Temple.temple_id == current_user.temple_id).all()

@router.post("", response_model=TempleResponse)
def create_temple(
    payload: TempleCreate, 
    current_user: User = Depends(require_role(["SUPER_ADMIN"])), 
    db: Session = Depends(get_db)
):
    existing = db.query(Temple).filter(Temple.temple_id == payload.temple_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Temple ID already exists.")
        
    temple = Temple(**payload.model_dump())
    db.add(temple)
    db.commit()
    db.refresh(temple)
    return temple

@router.get("/{id}", response_model=TempleResponse)
def get_temple_by_id(id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    temple = db.query(Temple).filter(Temple.id == id).first()
    if not temple:
        raise HTTPException(status_code=404, detail="Temple not found")
        
    if current_user.role != "SUPER_ADMIN" and current_user.temple_id != temple.temple_id:
        raise HTTPException(status_code=403, detail="Unauthorized access to another temple's data")
        
    return temple

@router.put("/{id}", response_model=TempleResponse)
def update_temple(
    id: int, 
    payload: TempleUpdate, 
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    temple = db.query(Temple).filter(Temple.id == id).first()
    if not temple:
        raise HTTPException(status_code=404, detail="Temple not found")
        
    if current_user.role != "SUPER_ADMIN" and current_user.temple_id != temple.temple_id:
        raise HTTPException(status_code=403, detail="Unauthorized modification")
        
    update_data = payload.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(temple, key, value)
        
    db.commit()
    db.refresh(temple)
    return temple
