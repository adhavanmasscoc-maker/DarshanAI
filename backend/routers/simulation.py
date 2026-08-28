import asyncio
import time
from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect, Query
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from typing import List, Optional
from jose import jwt, JWTError

from backend.config import settings
from backend.database import get_db
from backend.models.user import User
from backend.models.cctv import SimulationRun
from backend.dependencies.auth import get_current_user
from backend.services.simulation_service import simulation_manager

router = APIRouter(prefix="/simulation", tags=["Real-time Simulation"])

class ScenarioPayload(BaseModel):
    scenario: str

class SpeedPayload(BaseModel):
    speed: int

class WhatIfRequestPayload(BaseModel):
    temple_id: Optional[str] = "TEMPLE-001"
    base_crowd: int = Field(245, ge=10, le=50000, description="Current baseline crowd from CCTV")
    arrival_rate: int = Field(120, ge=10, le=3000, description="Expected arrivals per minute")
    counters: int = Field(4, ge=1, le=20, description="Number of active queue counters")
    duration_min: int = Field(30, ge=5, le=180, description="Simulation forecast duration in minutes")
    festival_multiplier: float = Field(1.0, ge=0.5, le=5.0, description="Festival crowd surge multiplier")

@router.post("/start")
def start_simulation(current_user: User = Depends(get_current_user)):
    temple_id = current_user.temple_id or "TEMPLE-001"
    simulator = simulation_manager.get_simulator(temple_id)
    simulator.start()
    return {"message": "Simulation started", "status": simulator.get_current_state()}

@router.post("/pause")
def pause_simulation(current_user: User = Depends(get_current_user)):
    temple_id = current_user.temple_id or "TEMPLE-001"
    simulator = simulation_manager.get_simulator(temple_id)
    simulator.pause()
    return {"message": "Simulation paused", "status": simulator.get_current_state()}

@router.post("/reset")
def reset_simulation(current_user: User = Depends(get_current_user)):
    temple_id = current_user.temple_id or "TEMPLE-001"
    simulator = simulation_manager.get_simulator(temple_id)
    simulator.reset()
    return {"message": "Simulation reset", "status": simulator.get_current_state()}

@router.post("/scenario")
def set_simulation_scenario(payload: ScenarioPayload, current_user: User = Depends(get_current_user)):
    temple_id = current_user.temple_id or "TEMPLE-001"
    simulator = simulation_manager.get_simulator(temple_id)
    success = simulator.set_scenario(payload.scenario)
    if not success:
        raise HTTPException(status_code=400, detail="Invalid scenario name.")
    return {"message": f"Scenario set to {payload.scenario}", "status": simulator.get_current_state()}

@router.post("/speed")
def set_simulation_speed(payload: SpeedPayload, current_user: User = Depends(get_current_user)):
    temple_id = current_user.temple_id or "TEMPLE-001"
    simulator = simulation_manager.get_simulator(temple_id)
    success = simulator.set_speed(payload.speed)
    if not success:
        raise HTTPException(status_code=400, detail="Invalid speed. Supported: 1, 5, 10, 30, 60")
    return {"message": f"Speed set to {payload.speed}x", "status": simulator.get_current_state()}

@router.get("/status")
def get_simulation_status(current_user: User = Depends(get_current_user)):
    temple_id = current_user.temple_id or "TEMPLE-001"
    simulator = simulation_manager.get_simulator(temple_id)
    return simulator.get_current_state()

@router.post("/what-if")
def run_what_if_scenario(
    payload: WhatIfRequestPayload,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Executes a multi-scenario What-If stress test initialized from current live CCTV baseline."""
    temple_id = current_user.temple_id or payload.temple_id or "TEMPLE-001"
    effective_arrival = int(payload.arrival_rate * payload.festival_multiplier)
    
    # 4 Comparative Scenarios
    scenarios_to_test = [
        {"name": "Current Setup", "counters": payload.counters, "arrival": effective_arrival, "desc": f"Configured {payload.counters} counters with {effective_arrival} dev/min inflow"},
        {"name": "Scenario A (+1 Counter)", "counters": payload.counters + 1, "arrival": effective_arrival, "desc": "Add +1 queue counter supervisor"},
        {"name": "Scenario B (+2 Counters & Surge Gate)", "counters": payload.counters + 2, "arrival": int(effective_arrival * 0.9), "desc": "+2 counters with Gate Inflow Regulation"},
        {"name": "Scenario C (Surge Stress Test)", "counters": payload.counters, "arrival": int(effective_arrival * 1.4), "desc": "+40% unmitigated festive arrival surge"}
    ]

    results = []
    recommendations = []

    for sc in scenarios_to_test:
        c_count = sc["counters"]
        arr = sc["arrival"]
        
        # Inflow vs Outflow capacity calculation
        total_inflow = arr * payload.duration_min
        service_capacity = c_count * 25 * payload.duration_min
        
        net_queue = max(0, total_inflow - service_capacity + int(payload.base_crowd * 0.35))
        final_crowd = payload.base_crowd + max(0, int(total_inflow * 0.65 - service_capacity * 0.45))
        wait_time = round(net_queue / max(1, c_count * 22.0), 1)
        occ_pct = min(100.0, round((final_crowd / 18000.0) * 100, 1))

        if occ_pct > 85.0 or wait_time > 45.0:
            risk = "CRITICAL"
        elif occ_pct > 70.0 or wait_time > 30.0:
            risk = "HIGH"
        elif occ_pct > 50.0 or wait_time > 15.0:
            risk = "MODERATE"
        else:
            risk = "LOW"

        res_item = {
            "scenario": sc["name"],
            "description": sc["desc"],
            "counters": c_count,
            "arrival_rate": arr,
            "projected_crowd": final_crowd,
            "projected_queue": net_queue,
            "estimated_wait_min": wait_time,
            "occupancy_percent": occ_pct,
            "risk_level": risk
        }
        results.append(res_item)

        # Store isolated simulation run in database
        sim_record = SimulationRun(
            temple_id=temple_id,
            scenario_name=sc["name"],
            base_crowd=payload.base_crowd,
            arrival_rate=arr,
            counters=c_count,
            duration_min=payload.duration_min,
            result_crowd=final_crowd,
            result_queue=net_queue,
            result_wait_min=wait_time,
            result_risk=risk
        )
        db.add(sim_record)

    db.commit()

    # Generate Recommendations
    current_res = results[0]
    best_opt = min(results[1:3], key=lambda x: x["estimated_wait_min"])

    if current_res["risk_level"] in ["CRITICAL", "HIGH"]:
        recommendations.append(f"⚠️ Recommendation: Open {best_opt['counters'] - current_res['counters']} additional queue counter(s) to reduce wait time from {current_res['estimated_wait_min']} min to {best_opt['estimated_wait_min']} min.")
        recommendations.append("🚨 Gate Control: Activate batch queue regulation at Shree Somnath Mahadwar Entry.")
    elif current_res["risk_level"] == "MODERATE":
        recommendations.append(f"ℹ️ Operational Note: Queue velocity is stable. Operating {payload.counters} counters is sufficient for current arrival of {payload.arrival_rate}/min.")
    else:
        recommendations.append("✅ Optimal Flow: Current capacity comfortably handles projected traffic.")

    return {
        "status": "SUCCESS",
        "baseline_cctv_crowd": payload.base_crowd,
        "duration_min": payload.duration_min,
        "scenarios": results,
        "ai_recommendations": recommendations,
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    }

@router.websocket("/ws/{temple_id}")
async def websocket_simulation_endpoint(
    websocket: WebSocket, 
    temple_id: str,
    token: str = Query(None)
):
    # Authenticate token via Query parameter
    if not token:
        await websocket.close(code=1008, reason="Missing token")
        return
        
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_temple_id = payload.get("temple_id")
        user_role = payload.get("role")
        
        # Enforce tenant isolation for websocket
        if user_role != "SUPER_ADMIN" and user_temple_id != temple_id:
            await websocket.close(code=1008, reason="Tenant isolation access violation")
            return
    except JWTError:
        await websocket.close(code=1008, reason="Invalid token")
        return

    await websocket.accept()
    simulator = simulation_manager.get_simulator(temple_id)
    
    try:
        while True:
            state = simulator.tick()
            await websocket.send_json(state)
            
            # Calculate sleep interval based on simulator speed
            sleep_duration = max(0.2, 1.5 / float(simulator.speed))
            await asyncio.sleep(sleep_duration)
    except WebSocketDisconnect:
        print(f"[WEBSOCKET] Client disconnected for temple {temple_id}")
    except Exception as e:
        print(f"[WEBSOCKET ERROR] {e}")
        await websocket.close()
