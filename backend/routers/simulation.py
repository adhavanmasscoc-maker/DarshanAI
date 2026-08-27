import asyncio
from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect, Query
from pydantic import BaseModel
from jose import jwt, JWTError

from backend.config import settings
from backend.models.user import User
from backend.dependencies.auth import get_current_user
from backend.services.simulation_service import simulation_manager

router = APIRouter(prefix="/simulation", tags=["Real-time Simulation"])

class ScenarioPayload(BaseModel):
    scenario: str

class SpeedPayload(BaseModel):
    speed: int

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
