from typing import Dict
from ml.simulation_engine import TempleSimulationEngine

class SimulationManager:
    def __init__(self):
        self.simulators: Dict[str, TempleSimulationEngine] = {}

    def get_simulator(self, temple_id: str) -> TempleSimulationEngine:
        if temple_id not in self.simulators:
            self.simulators[temple_id] = TempleSimulationEngine(temple_id=temple_id)
        return self.simulators[temple_id]

simulation_manager = SimulationManager()
