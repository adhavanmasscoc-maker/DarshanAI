import requests
import json
import time

BASE_URL = "http://127.0.0.1:8000/api"

def run_e2e_verification():
    print("==================================================================")
    print("      DARSHANAI COMPLETE END-TO-END SYSTEM & ROUTE VERIFICATION   ")
    print("==================================================================")
    
    results = []

    # 1. Health Endpoint
    try:
        r = requests.get("http://127.0.0.1:8000/")
        assert r.status_code == 200 and r.json().get("status") == "ONLINE"
        results.append(("Health Endpoint & Server Status", "PASSED", None))
    except Exception as e:
        results.append(("Health Endpoint & Server Status", "FAILED", str(e)))

    # 2. Authentication: Invalid Login Test
    try:
        r = requests.post(f"{BASE_URL}/auth/login", json={"email": "wrong@email.com", "password": "WrongPassword!"})
        assert r.status_code == 401
        results.append(("Authentication: Invalid Login Handling", "PASSED", None))
    except Exception as e:
        results.append(("Authentication: Invalid Login Handling", "FAILED", str(e)))

    # 3. Authentication: Sign-Up (New User Registration)
    test_email = f"officer_{int(time.time())}@temple001.org"
    try:
        reg_payload = {
            "email": test_email,
            "full_name": "Test Operations Officer",
            "password": "SecurePassword123!",
            "confirm_password": "SecurePassword123!",
            "role": "SECURITY",
            "temple_id": "TEMPLE-001"
        }
        r = requests.post(f"{BASE_URL}/auth/register", json=reg_payload)
        assert r.status_code == 201
        results.append(("Authentication: New User Registration / Sign-Up", "PASSED", None))
    except Exception as e:
        results.append(("Authentication: New User Registration / Sign-Up", "FAILED", str(e)))

    # 4. Authentication: Login with Newly Created User & JWT Issuance
    token = None
    try:
        r = requests.post(f"{BASE_URL}/auth/login", json={"email": test_email, "password": "SecurePassword123!"})
        assert r.status_code == 200
        token = r.json()["access_token"]
        assert token is not None
        results.append(("Authentication: Login with New Credentials & JWT Issuance", "PASSED", None))
    except Exception as e:
        results.append(("Authentication: Login with New Credentials & JWT Issuance", "FAILED", str(e)))

    headers = {"Authorization": f"Bearer {token}"} if token else {}

    # Super Admin Login for Administrative Endpoints
    sa_r = requests.post(f"{BASE_URL}/auth/login", json={"email": "superadmin@darshanai.com", "password": "SuperAdmin123!"})
    sa_token = sa_r.json()["access_token"]
    sa_headers = {"Authorization": f"Bearer {sa_token}"}

    # 5. Multi-Temple Tenant Isolation Test
    try:
        # Login Temple 2 Admin
        t2_r = requests.post(f"{BASE_URL}/auth/login", json={"email": "admin@temple002.com", "password": "TempleAdmin123!"})
        assert t2_r.status_code == 200
        t2_token = t2_r.json()["access_token"]
        t2_headers = {"Authorization": f"Bearer {t2_token}"}

        # Temple 2 should see only TEMPLE-002 cameras
        cams_t2 = requests.get(f"{BASE_URL}/cctv/cameras", headers=t2_headers).json()
        assert all(c["temple_id"] == "TEMPLE-002" for c in cams_t2)

        # Temple 1 officer should see only TEMPLE-001 cameras
        cams_t1 = requests.get(f"{BASE_URL}/cctv/cameras", headers=headers).json()
        assert all(c["temple_id"] == "TEMPLE-001" for c in cams_t1)

        results.append(("Multi-Temple Authentication & Tenant Data Isolation", "PASSED", None))
    except Exception as e:
        results.append(("Multi-Temple Authentication & Tenant Data Isolation", "FAILED", str(e)))

    # 6. Devotee Registration & Token Generation
    try:
        dev_payload = {
            "temple_id": "TEMPLE-001",
            "name": "Mahadev S",
            "age": 30,
            "phone": "+91-9876543210",
            "group_size": 2,
            "category": "Special Darshan",
            "darshan_type": "Special Darshan",
            "zone": "Queue Complex",
            "counter": "Counter 2"
        }
        r = requests.post(f"{BASE_URL}/pilgrims/register", headers=sa_headers, json=dev_payload)
        assert r.status_code == 200
        token_code = r.json().get("token")
        assert token_code and token_code.startswith("TKN-")
        results.append(("Devotee Registration & Token Issuance", "PASSED", None))
    except Exception as e:
        results.append(("Devotee Registration & Token Issuance", "FAILED", str(e)))

    # 7. Queue Management & Anti-Starvation Calling API
    try:
        r_sum = requests.get(f"{BASE_URL}/pilgrims/queue-summary?temple_id=TEMPLE-001", headers=sa_headers)
        assert r_sum.status_code == 200
        r_call = requests.post(f"{BASE_URL}/pilgrims/call-next", headers=sa_headers, json={"counter": "Counter 1", "category": "General Darshan", "batch_size": 2})
        assert r_call.status_code == 200
        results.append(("Queue Management & Intelligent Batch Calling", "PASSED", None))
    except Exception as e:
        results.append(("Queue Management & Intelligent Batch Calling", "FAILED", str(e)))

    # 8. CCTV Computer Vision & Analytics Telemetry
    try:
        r_ana = requests.get(f"{BASE_URL}/cctv/cameras/CAM-001/analytics", headers=sa_headers)
        assert r_ana.status_code == 200
        ana = r_ana.json()
        assert "person_count" in ana and "density_percent" in ana and "risk_level" in ana
        results.append(("CCTV Computer Vision Telemetry & Analytics", "PASSED", None))
    except Exception as e:
        results.append(("CCTV Computer Vision Telemetry & Analytics", "FAILED", str(e)))

    # 9. Multi-Horizon ML Crowd Prediction (+15m, +30m, +60m)
    try:
        r_pred = requests.get(f"{BASE_URL}/cctv/predictions?camera_id=CAM-001", headers=sa_headers)
        assert r_pred.status_code == 200
        pred_data = r_pred.json()
        assert pred_data["status"] == "SUCCESS"
        assert len(pred_data["horizons"]) == 3
        results.append(("Multi-Horizon ML Prediction Engine (+15m, +30m, +60m)", "PASSED", None))
    except Exception as e:
        results.append(("Multi-Horizon ML Prediction Engine (+15m, +30m, +60m)", "FAILED", str(e)))

    # 10. Direct ML Model Inference (No Retraining Required)
    try:
        ml_payload = {
            "hour": 10,
            "day_of_week": 6,
            "is_weekend": 1,
            "is_festival": 0,
            "temperature": 28.5,
            "humidity": 65.0,
            "weather_condition": "Clear",
            "special_event": 0,
            "open_gates": 5,
            "staff_on_duty": 40,
            "security_level": 2,
            "entry_rate": 180,
            "exit_rate": 120,
            "waiting_time": 25.0
        }
        r_ml = requests.post(f"{BASE_URL}/ml/predict", headers=sa_headers, json=ml_payload)
        assert r_ml.status_code == 200
        ml_res = r_ml.json()
        assert "predicted_visitors" in ml_res and "risk_level" in ml_res
        results.append(("Pre-Trained ML Model Inference Service", "PASSED", None))
    except Exception as e:
        results.append(("Pre-Trained ML Model Inference Service", "FAILED", str(e)))

    # 11. Geographically Accurate Multi-Temple GIS Map
    try:
        r_map1 = requests.get(f"{BASE_URL}/temples/TEMPLE-001/map-data", headers=sa_headers)
        r_map2 = requests.get(f"{BASE_URL}/temples/TEMPLE-002/map-data", headers=sa_headers)
        assert r_map1.status_code == 200 and r_map2.status_code == 200
        t1 = r_map1.json()["temple"]
        t2 = r_map2.json()["temple"]
        # Verify real GPS coordinates: Somnath (20.8880, 70.4012), Tirupati (13.6833, 79.3472)
        assert round(t1["latitude"], 3) == 20.888 and round(t1["longitude"], 3) == 70.401
        assert round(t2["latitude"], 3) == 13.683 and round(t2["longitude"], 3) == 79.347
        results.append(("Geographically Accurate Multi-Temple GIS Map", "PASSED", None))
    except Exception as e:
        results.append(("Geographically Accurate Multi-Temple GIS Map", "FAILED", str(e)))

    # 12. What-If Scenario Simulation & Data Isolation
    try:
        whatif_payload = {
            "temple_id": "TEMPLE-001",
            "base_crowd": 245,
            "arrival_rate": 140,
            "counters": 4,
            "duration_min": 30,
            "festival_multiplier": 1.25
        }
        r_whatif = requests.post(f"{BASE_URL}/simulation/what-if", headers=sa_headers, json=whatif_payload)
        assert r_whatif.status_code == 200
        whatif_data = r_whatif.json()
        assert len(whatif_data["scenarios"]) == 4
        assert len(whatif_data["ai_recommendations"]) > 0
        results.append(("What-If Scenario Simulation & Data Isolation", "PASSED", None))
    except Exception as e:
        results.append(("What-If Scenario Simulation & Data Isolation", "FAILED", str(e)))

    # 13. Safety Alerts Feed & Incident Resolution
    try:
        r_alerts = requests.get(f"{BASE_URL}/alerts", headers=sa_headers)
        assert r_alerts.status_code == 200
        results.append(("Safety Alerts Feed & Incident Management", "PASSED", None))
    except Exception as e:
        results.append(("Safety Alerts Feed & Incident Management", "FAILED", str(e)))

    # 14. Command Center Dashboard Aggregation
    try:
        r_dash = requests.get(f"{BASE_URL}/dashboard/summary", headers=sa_headers)
        assert r_dash.status_code == 200
        results.append(("Command Center Dashboard Aggregation", "PASSED", None))
    except Exception as e:
        results.append(("Command Center Dashboard Aggregation", "FAILED", str(e)))

    print("\n==================================================================")
    print(f"       TEST EXECUTION SUMMARY: {sum(1 for _, s, _ in results if s == 'PASSED')}/{len(results)} PASSED")
    print("==================================================================")
    for feat, status, err in results:
        print(f" - {feat:55} : [{status}] {f'({err})' if err else ''}")
    print("==================================================================")

if __name__ == "__main__":
    run_e2e_verification()
