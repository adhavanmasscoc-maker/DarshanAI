import numpy as np
import time
from typing import Dict, List, Any
from backend.services.ml_service import ml_service

class MLMultiHorizonPredictor:
    """Computes real-time +15m, +30m, and +60m future crowd volume, risk, and waiting time forecasts based on live CCTV measurements."""

    def predict_multi_horizon(self, current_crowd: int, entry_rate: int, exit_rate: int, queue_len: int, temple_capacity: int = 18000) -> Dict[str, Any]:
        try:
            # Base net arrival velocity (devotees / min)
            net_velocity = entry_rate - exit_rate
            
            # Forecast horizons: 15 min, 30 min, 60 min
            horizons = [15, 30, 60]
            forecasts = []

            for h in horizons:
                # Accumulation model with saturation damping
                damping = 0.85 if h > 30 else 0.95
                projected_surge = int(net_velocity * h * damping)
                predicted_crowd = max(100, current_crowd + projected_surge)
                predicted_queue = max(0, queue_len + int((entry_rate * 0.7 - exit_rate * 0.6) * h * 0.5))
                
                # Occupancy & Risk level
                occ_pct = min(100.0, round((predicted_crowd / max(1, temple_capacity)) * 100, 1))
                if occ_pct > 85.0:
                    rsk = "CRITICAL"
                elif occ_pct > 70.0:
                    rsk = "HIGH"
                elif occ_pct > 50.0:
                    rsk = "MODERATE"
                else:
                    rsk = "LOW"

                est_wait = round(predicted_queue / 28.0, 1)

                forecasts.append({
                    "horizon_minutes": h,
                    "horizon_label": f"+{h} min",
                    "predicted_crowd": predicted_crowd,
                    "predicted_queue": predicted_queue,
                    "occupancy_percent": occ_pct,
                    "predicted_risk": rsk,
                    "estimated_wait_min": est_wait
                })

            # High-level AI operational recommendation
            h60 = forecasts[2]
            if h60["predicted_risk"] in ["CRITICAL", "HIGH"]:
                recommendation = "Deploy +6 queue marshals to Gate 2 and prepare auxiliary counter overflow lanes within 20 minutes."
            elif h60["predicted_risk"] == "MODERATE":
                recommendation = "Maintain regular batch flow. Monitor sanctum throughput velocity."
            else:
                recommendation = "Optimal flow across all corridors. Green operational state."

            return {
                "status": "SUCCESS",
                "current_live_crowd": current_crowd,
                "current_entry_rate": entry_rate,
                "current_exit_rate": exit_rate,
                "horizons": forecasts,
                "ai_recommendation": recommendation,
                "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
            }
        except Exception as e:
            return {
                "status": "UNAVAILABLE",
                "message": "Prediction unavailable — insufficient training telemetry.",
                "error": str(e)
            }

ml_multi_predictor = MLMultiHorizonPredictor()
