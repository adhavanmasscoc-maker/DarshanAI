from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from backend.database import get_db
from backend.models.alert import Alert
from backend.models.user import User
from backend.schemas.alert import AlertCreate, AlertResponse
from backend.dependencies.auth import get_current_user, require_role

router = APIRouter(prefix="/alerts", tags=["Alerts Management"])

@router.get("", response_model=List[AlertResponse])
def get_alerts(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role == "SUPER_ADMIN":
        return db.query(Alert).order_by(Alert.time.desc()).all()
    else:
        return db.query(Alert).filter(Alert.temple_id == current_user.temple_id).order_by(Alert.time.desc()).all()

@router.post("", response_model=AlertResponse)
def create_alert(
    payload: AlertCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    temple_id = current_user.temple_id or "TEMPLE-001"
    alert = Alert(
        temple_id=temple_id,
        severity=payload.severity,
        zone=payload.zone,
        description=payload.description,
        alert_type=payload.alert_type,
        status="ACTIVE"
    )
    db.add(alert)
    db.commit()
    db.refresh(alert)
    return alert

@router.put("/{id}/resolve", response_model=AlertResponse)
def resolve_alert(id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    alert = db.query(Alert).filter(Alert.id == id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
        
    if current_user.role != "SUPER_ADMIN" and current_user.temple_id != alert.temple_id:
        raise HTTPException(status_code=403, detail="Unauthorized access to alert record")
        
    alert.status = "RESOLVED"
    db.commit()
    db.refresh(alert)
    return alert
