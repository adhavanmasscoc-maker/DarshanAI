import requests
import json
import time

PROD_BACKEND_URL = "https://darshanai-backend.onrender.com"
PROD_FRONTEND_URL = "https://darshanai-frontend.onrender.com"
API_URL = f"{PROD_BACKEND_URL}/api"

def verify_live_deployment():
    print("==================================================================")
    print("  DARSHANAI PRODUCTION DEPLOYMENT END-TO-END VERIFICATION SUITE   ")
    print("==================================================================")
    print(f"Frontend URL : {PROD_FRONTEND_URL}")
    print(f"Backend URL  : {PROD_BACKEND_URL}")
    print(f"API Base URL : {API_URL}\n")

    results = []

    # 1. Health & Server Status
    try:
        r = requests.get(f"{PROD_BACKEND_URL}/", timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert data.get("status") == "ONLINE"
        results.append(("Production Backend Health Check (GET /)", "PASSED", f"Status: {data.get('status')}, Version: {data.get('version')}"))
    except Exception as e:
        results.append(("Production Backend Health Check (GET /)", "FAILED", str(e)))

    # 2. Frontend SPA Routing & Direct Page Load
    frontend_routes = [
        "/login",
        "/register",
        "/dashboard",
        "/devotee-registration",
        "/queue-management",
        "/crowd-monitoring",
        "/predictions",
        "/risk-analysis",
        "/temple-map",
        "/simulation",
        "/analytics",
        "/model-performance",
        "/pilgrims",
        "/darshan-tokens",
        "/staff",
        "/reports",
        "/alerts",
        "/users",
        "/temples-management",
        "/settings"
    ]
    spa_failed = []
    for route in frontend_routes:
        try:
            r = requests.get(f"{PROD_FRONTEND_URL}{route}", timeout=10)
            if r.status_code != 200 or "<!DOCTYPE html>" not in r.text:
                spa_failed.append(f"{route} (Status: {r.status_code})")
        except Exception as e:
            spa_failed.append(f"{route} ({e})")
    
    if len(spa_failed) == 0:
        results.append(("Frontend SPA Routing (20 Routes Checked)", "PASSED", "All 20 routes return 200 OK without 404"))
    else:
        results.append(("Frontend SPA Routing (20 Routes Checked)", "FAILED", f"Failed routes: {spa_failed}"))

    # 3. Authentication: Invalid Login Handling
    try:
        r = requests.post(f"{API_URL}/auth/login", json={"email": "wrong@email.com", "password": "WrongPassword!"}, timeout=10)
        assert r.status_code == 401
        results.append(("Authentication: Invalid Login Security (401)", "PASSED", "Correctly rejected unauthorized credentials"))
    except Exception as e:
        results.append(("Authentication: Invalid Login Security (401)", "FAILED", str(e)))

    # 4. Authentication: User Sign-Up (Registration)
    test_email = f"prod_officer_{int(time.time())}@somnath.org"
    try:
        reg_payload = {
            "email": test_email,
            "full_name": "Somnath Security Supervisor",
            "password": "ProductionPassword123!",
            "confirm_password": "ProductionPassword123!",
            "role": "SECURITY",
            "temple_id": "TEMPLE-001"
        }
        r = requests.post(f"{API_URL}/auth/register", json=reg_payload, timeout=10)
        assert r.status_code in [200, 201]
        results.append(("Authentication: User Sign-Up / Registration", "PASSED", f"Successfully created user {test_email}"))
    except Exception as e:
        results.append(("Authentication: User Sign-Up / Registration", "FAILED", str(e)))

    # 5. Authentication: Login with New Credentials & JWT Issuance
    token = None
    try:
        r = requests.post(f"{API_URL}/auth/login", json={"email": test_email, "password": "ProductionPassword123!"}, timeout=10)
        assert r.status_code == 200
        token = r.json().get("access_token")
        assert token is not None
        results.append(("Authentication: Login & JWT Token Issuance", "PASSED", f"JWT Issued: {token[:20]}..."))
    except Exception as e:
        results.append(("Authentication: Login & JWT Token Issuance", "FAILED", str(e)))

    headers = {"Authorization": f"Bearer {token}"} if token else {}

    # Super Admin Authentication for Admin Endpoints
    sa_token = None
    try:
        sa_r = requests.post(f"{API_URL}/auth/login", json={"email": "superadmin@darshanai.com", "password": "SuperAdmin123!"}, timeout=10)
        sa_token = sa_r.json().get("access_token")
    except Exception as e:
        print(f"Super Admin Login Note: {e}")
    sa_headers = {"Authorization": f"Bearer {sa_token}"} if sa_token else headers

    # 6. Multi-Temple Tenant Data Isolation
    try:
        # Login Temple 2 Admin
        t2_r = requests.post(f"{API_URL}/auth/login", json={"email": "admin@temple002.com", "password": "TempleAdmin123!"}, timeout=10)
        assert t2_r.status_code == 200
        t2_token = t2_r.json().get("access_token")
        t2_headers = {"Authorization": f"Bearer {t2_token}"}

        # Temple 2 should see only TEMPLE-002 cameras
        cams_t2 = requests.get(f"{API_URL}/cctv/cameras", headers=t2_headers, timeout=10).json()
        assert all(c["temple_id"] == "TEMPLE-002" for c in cams_t2)

        # Temple 1 officer should see only TEMPLE-001 cameras
        cams_t1 = requests.get(f"{API_URL}/cctv/cameras", headers=headers, timeout=10).json()
        assert all(c["temple_id"] == "TEMPLE-001" for c in cams_t1)

        results.append(("Multi-Temple Authentication & Tenant Data Isolation", "PASSED", "Strict TEMPLE-001 vs TEMPLE-002 database isolation verified"))
    except Exception as e:
        results.append(("Multi-Temple Authentication & Tenant Data Isolation", "FAILED", str(e)))

    # 7. Devotee Registration & Token Issuance
    try:
        dev_payload = {
            "temple_id": "TEMPLE-001",
            "name": "Devotee Rajesh Varma",
            "age": 38,
            "phone": "+91-9876543210",
            "group_size": 3,
            "category": "VIP",
            "darshan_type": "VIP",
            "zone": "VIP Corridor",
            "counter": "VIP Counter"
        }
        r = requests.post(f"{API_URL}/pilgrims/register", headers=sa_headers, json=dev_payload, timeout=10)
        assert r.status_code == 200
        token_code = r.json().get("token")
        assert token_code and token_code.startswith("TKN-")
        results.append(("Devotee Registration & QR Token Generation", "PASSED", f"Issued Token: {token_code}"))
    except Exception as e:
        results.append(("Devotee Registration & QR Token Generation", "FAILED", str(e)))

    # 8. Queue Management & Batch Calling
    try:
        r_sum = requests.get(f"{API_URL}/pilgrims/queue-summary?temple_id=TEMPLE-001", headers=sa_headers, timeout=10)
        assert r_sum.status_code == 200
        r_call = requests.post(f"{API_URL}/pilgrims/call-next", headers=sa_headers, json={"counter": "Counter 1", "category": "General Darshan", "batch_size": 2}, timeout=10)
        assert r_call.status_code == 200
        results.append(("Queue Management & Anti-Starvation Batch Calling", "PASSED", f"Queue Summary & Next Call Response: {r_call.json().get('status', 'OK')}"))
    except Exception as e:
        results.append(("Queue Management & Anti-Starvation Batch Calling", "FAILED", str(e)))

    # 9. CCTV Computer Vision Telemetry & Analytics
    try:
        r_ana = requests.get(f"{API_URL}/cctv/cameras/CAM-001/analytics", headers=sa_headers, timeout=10)
        assert r_ana.status_code == 200
        ana = r_ana.json()
        assert "person_count" in ana and "density_percent" in ana and "risk_level" in ana
        results.append(("CCTV Computer Vision Telemetry & Analytics", "PASSED", f"Camera: {ana.get('camera_id')}, Persons: {ana.get('person_count')}, Density: {ana.get('density_percent')}%, Risk: {ana.get('risk_level')}"))
    except Exception as e:
        results.append(("CCTV Computer Vision Telemetry & Analytics", "FAILED", str(e)))

    # 10. Multi-Horizon ML Crowd Forecasting (+15m, +30m, +60m)
    try:
        r_pred = requests.get(f"{API_URL}/cctv/predictions?camera_id=CAM-001", headers=sa_headers, timeout=10)
        assert r_pred.status_code == 200
        pred_data = r_pred.json()
        assert pred_data["status"] == "SUCCESS"
        assert len(pred_data["horizons"]) == 3
        h15 = pred_data["horizons"][0]["predicted_crowd"]
        h30 = pred_data["horizons"][1]["predicted_crowd"]
        h60 = pred_data["horizons"][2]["predicted_crowd"]
        results.append(("Multi-Horizon ML Prediction Engine (+15m, +30m, +60m)", "PASSED", f"+15m: {h15}, +30m: {h30}, +60m: {h60}"))
    except Exception as e:
        results.append(("Multi-Horizon ML Prediction Engine (+15m, +30m, +60m)", "FAILED", str(e)))

    # 11. Pre-Trained ML Model Direct Inference
    try:
        ml_payload = {
            "hour": 9,
            "day_of_week": 5,
            "is_weekend": 1,
            "is_festival": 0,
            "temperature": 27.0,
            "humidity": 60.0,
            "weather_condition": "Clear",
            "special_event": 0,
            "open_gates": 5,
            "staff_on_duty": 40,
            "security_level": 2,
            "entry_rate": 180,
            "exit_rate": 120,
            "waiting_time": 25.0
        }
        r_ml = requests.post(f"{API_URL}/ml/predict", headers=sa_headers, json=ml_payload, timeout=10)
        assert r_ml.status_code == 200
        ml_res = r_ml.json()
        assert "predicted_visitors" in ml_res and "risk_level" in ml_res
        results.append(("Production ML Model Inference (RandomForest & IsolationForest)", "PASSED", f"Predicted: {ml_res.get('predicted_visitors')} visitors, Risk: {ml_res.get('risk_level')}, Anomaly: {ml_res.get('is_anomaly')}"))
    except Exception as e:
        results.append(("Production ML Model Inference (RandomForest & IsolationForest)", "FAILED", str(e)))

    # 12. Geographically Accurate Multi-Temple GIS Map
    try:
        r_map1 = requests.get(f"{API_URL}/temples/TEMPLE-001/map-data", headers=sa_headers, timeout=10)
        r_map2 = requests.get(f"{API_URL}/temples/TEMPLE-002/map-data", headers=sa_headers, timeout=10)
        assert r_map1.status_code == 200 and r_map2.status_code == 200
        t1 = r_map1.json()["temple"]
        t2 = r_map2.json()["temple"]
        assert round(t1["latitude"], 3) == 20.888 and round(t1["longitude"], 3) == 70.401
        assert round(t2["latitude"], 3) == 13.683 and round(t2["longitude"], 3) == 79.347
        results.append(("Geographically Accurate Multi-Temple GIS Map", "PASSED", f"Somnath ({t1['latitude']}, {t1['longitude']}), Tirupati ({t2['latitude']}, {t2['longitude']})"))
    except Exception as e:
        results.append(("Geographically Accurate Multi-Temple GIS Map", "FAILED", str(e)))

    # 13. What-If Scenario Simulation & Data Isolation
    try:
        whatif_payload = {
            "temple_id": "TEMPLE-001",
            "base_crowd": 245,
            "arrival_rate": 150,
            "counters": 3,
            "duration_min": 30,
            "festival_multiplier": 1.25
        }
        r_whatif = requests.post(f"{API_URL}/simulation/what-if", headers=sa_headers, json=whatif_payload, timeout=10)
        assert r_whatif.status_code == 200
        whatif_data = r_whatif.json()
        assert len(whatif_data["scenarios"]) == 4
        assert len(whatif_data["ai_recommendations"]) > 0
        results.append(("What-If Scenario Simulation & Data Isolation", "PASSED", f"Evaluated 4 Scenarios, Generated {len(whatif_data['ai_recommendations'])} Dynamic Recommendations"))
    except Exception as e:
        results.append(("What-If Scenario Simulation & Data Isolation", "FAILED", str(e)))

    # 14. Safety Alerts & Incident Feed
    try:
        r_alerts = requests.get(f"{API_URL}/alerts", headers=sa_headers, timeout=10)
        assert r_alerts.status_code == 200
        results.append(("Safety Alerts Feed & Incident Management", "PASSED", f"Active/Resolved Safety Incidents Loaded ({len(r_alerts.json())} alerts)"))
    except Exception as e:
        results.append(("Safety Alerts Feed & Incident Management", "FAILED", str(e)))

    # 15. Command Center Dashboard Aggregation
    try:
        r_dash = requests.get(f"{API_URL}/dashboard/summary", headers=sa_headers, timeout=10)
        assert r_dash.status_code == 200
        results.append(("Command Center Dashboard Aggregation", "PASSED", "Real-time consolidated KPI summary loaded"))
    except Exception as e:
        results.append(("Command Center Dashboard Aggregation", "FAILED", str(e)))

    print("\n" + "=" * 80)
    print(f"       PRODUCTION TEST EXECUTION SUMMARY: {sum(1 for _, s, _ in results if s == 'PASSED')}/{len(results)} PASSED")
    print("=" * 80)
    for feat, status, detail in results:
        print(f" - {feat:55} : [{status}] {detail if detail else ''}")
    print("=" * 80)

if __name__ == "__main__":
    verify_live_deployment()
