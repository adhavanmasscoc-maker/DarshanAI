from fastapi import APIRouter, Depends, HTTPException
from backend.models.user import User
from backend.schemas.prediction import PredictPayload, PredictionResponse
from backend.dependencies.auth import get_current_user
from backend.services.ml_service import ml_service

router = APIRouter(prefix="/ml", tags=["Machine Learning"])

@router.post("/crowd-prediction")
def predict_crowd_visitor_count(payload: PredictPayload, current_user: User = Depends(get_current_user)):
    res = ml_service.predict(payload.model_dump())
    return {"predicted_visitor_count": res["predicted_visitor_count"]}

@router.post("/crowd-classification")
def classify_crowd_level(payload: PredictPayload, current_user: User = Depends(get_current_user)):
    res = ml_service.predict(payload.model_dump())
    return {"predicted_crowd_level": res["predicted_crowd_level"]}

@router.post("/risk-prediction")
def predict_risk_level(payload: PredictPayload, current_user: User = Depends(get_current_user)):
    res = ml_service.predict(payload.model_dump())
    return {"predicted_risk_level": res["predicted_risk_level"]}

@router.post("/waiting-time")
def predict_waiting_time(payload: PredictPayload, current_user: User = Depends(get_current_user)):
    res = ml_service.predict(payload.model_dump())
    return {"predicted_waiting_time": res["predicted_waiting_time"]}

@router.post("/anomaly")
def detect_anomaly(payload: PredictPayload, current_user: User = Depends(get_current_user)):
    res = ml_service.predict(payload.model_dump())
    return {
        "is_anomaly": res["is_anomaly"],
        "anomaly_score": res["anomaly_score"]
    }

@router.post("/full-inference", response_model=PredictionResponse)
def full_ml_inference(payload: PredictPayload, current_user: User = Depends(get_current_user)):
    res = ml_service.predict(payload.model_dump())
    return PredictionResponse(**res)

@router.get("/model-performance")
def get_model_performance(current_user: User = Depends(get_current_user)):
    return ml_service.metrics

@router.get("/feature-importance")
def get_feature_importance(current_user: User = Depends(get_current_user)):
    return ml_service.feature_importance
