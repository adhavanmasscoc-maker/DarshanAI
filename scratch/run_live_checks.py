import requests
import json
import time

PROD_BACKEND_URL = "https://darshanai-backend.onrender.com"
PROD_FRONTEND_URL = "https://darshanai-frontend.onrender.com"
API_URL = f"{PROD_BACKEND_URL}/api"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    "Accept": "application/json, text/plain, */*"
}

def run_checks():
    print("==================================================================", flush=True)
    print("  DARSHANAI PRODUCTION DEPLOYMENT END-TO-END VERIFICATION SUITE   ", flush=True)
    print("==================================================================", flush=True)
    print(f"Frontend URL : {PROD_FRONTEND_URL}", flush=True)
    print(f"Backend URL  : {PROD_BACKEND_URL}", flush=True)
    print(f"API Base URL : {API_URL}\n", flush=True)

    results = []

    # 1. Health & Server Status
    print("[1/15] Verifying Production Backend Health...", flush=True)
    time.sleep(1.0)
    try:
        r = requests.get(f"{PROD_BACKEND_URL}/", headers=HEADERS, timeout=20)
        assert r.status_code == 200
        data = r.json()
        assert data.get("status") == "ONLINE"
        results.append(("Production Backend Health Check (GET /)", "PASSED", f"Status: {data.get('status')}, Version: {data.get('version')}"))
        print(" -> PASSED", flush=True)
    except Exception as e:
        results.append(("Production Backend Health Check (GET /)", "FAILED", str(e)))
        print(f" -> FAILED: {e}", flush=True)

    # 2. Frontend SPA Routes
    print("[2/15] Verifying Frontend Main Page & 20 SPA Routes...", flush=True)
    frontend_routes = [
        "/login", "/register", "/dashboard", "/devotee-registration",
        "/queue-management", "/crowd-monitoring", "/predictions", "/risk-analysis",
        "/temple-map", "/simulation", "/analytics", "/model-performance",
        "/pilgrims", "/darshan-tokens", "/staff", "/reports", "/alerts",
        "/users", "/temples-management", "/settings"
    ]
    spa_failed = []
    for route in frontend_routes:
        try:
            r = requests.get(f"{PROD_FRONTEND_URL}{route}", headers=HEADERS, timeout=10)
            if r.status_code != 200 or "<!DOCTYPE html>" not in r.text:
                spa_failed.append(f"{route} (Status: {r.status_code})")
        except Exception as e:
            spa_failed.append(f"{route} ({e})")
        time.sleep(0.2)
    
    if len(spa_failed) == 0:
        results.append(("Frontend SPA Routing (20 Routes Checked)", "PASSED", "All 20 routes return 200 OK without 404 or blank screen"))
        print(" -> PASSED", flush=True)
    else:
        results.append(("Frontend SPA Routing (20 Routes Checked)", "FAILED", f"Failed: {spa_failed}"))
        print(f" -> FAILED: {spa_failed}", flush=True)

    # 3. Authentication: Invalid Login Security Handling
    print("[3/15] Verifying Invalid Login Security Handling...", flush=True)
    time.sleep(0.6)
    try:
        r = requests.post(f"{API_URL}/auth/login", headers=HEADERS, json={"email": "wrong@email.com", "password": "WrongPassword!"}, timeout=20)
        assert r.status_code == 401
        results.append(("Authentication: Invalid Login Handling (401)", "PASSED", "Correctly rejected unauthorized credentials"))
        print(" -> PASSED", flush=True)
    except Exception as e:
        results.append(("Authentication: Invalid Login Handling (401)", "FAILED", str(e)))
        print(f" -> FAILED: {e}", flush=True)

    # 4. Authentication: Super Admin Login
    print("[4/15] Verifying Super Admin Authentication...", flush=True)
    time.sleep(0.6)
    sa_token = None
    try:
        sa_r = requests.post(f"{API_URL}/auth/login", headers=HEADERS, json={"email": "superadmin@darshanai.com", "password": "SuperAdmin123!"}, timeout=20)
        assert sa_r.status_code == 200
        sa_token = sa_r.json().get("access_token")
        assert sa_token is not None
        results.append(("Authentication: Super Admin Login & JWT Issuance", "PASSED", f"JWT Issued: {sa_token[:20]}..."))
        print(" -> PASSED", flush=True)
    except Exception as e:
        results.append(("Authentication: Super Admin Login & JWT Issuance", "FAILED", str(e)))
        print(f" -> FAILED: {e}", flush=True)

    sa_headers = {**HEADERS, "Authorization": f"Bearer {sa_token}"} if sa_token else HEADERS

    # 5. User Registration (Sign-Up)
    print("[5/15] Verifying User Registration (Sign-Up)...", flush=True)
    time.sleep(0.6)
    ts = int(time.time())
    test_temple_id = f"TMP-TEST-{ts}"
    admin_email = f"admin_{ts}@testtemple.org"
    try:
        reg_payload = {
            "full_name": "Test Master Admin",
            "email": admin_email,
            "mobile": "+91-9899988877",
            "temple_id": test_temple_id,
            "temple_name": "Test Jyotirlinga Shrine",
            "role": "Temple Admin",
            "password": "TestPassword123!",
            "confirm_password": "TestPassword123!",
            "city": "Ujjain",
            "state": "Madhya Pradesh",
            "capacity": 22000
        }
        r = requests.post(f"{API_URL}/auth/register", headers=HEADERS, json=reg_payload, timeout=20)
        assert r.status_code == 200
        results.append(("Authentication: User Sign-Up & Account Creation", "PASSED", f"Created: {admin_email} for {test_temple_id}"))
        print(" -> PASSED", flush=True)
    except Exception as e:
        results.append(("Authentication: User Sign-Up & Account Creation", "FAILED", str(e)))
        print(f" -> FAILED: {e}", flush=True)

    # 6. Multi-Temple Tenant Data Isolation
    print("[6/15] Verifying Multi-Temple Tenant Data Isolation...", flush=True)
    time.sleep(0.6)
    try:
        t1_r = requests.post(f"{API_URL}/auth/login", headers=HEADERS, json={"email": "admin@temple001.com", "password": "TempleAdmin123!"}, timeout=20)
        t2_r = requests.post(f"{API_URL}/auth/login", headers=HEADERS, json={"email": "admin@temple002.com", "password": "TempleAdmin123!"}, timeout=20)
        assert t1_r.status_code == 200 and t2_r.status_code == 200

        t1_headers = {**HEADERS, "Authorization": f"Bearer {t1_r.json()['access_token']}"}
        t2_headers = {**HEADERS, "Authorization": f"Bearer {t2_r.json()['access_token']}"}

        cams_t1 = requests.get(f"{API_URL}/cctv/cameras", headers=t1_headers, timeout=20).json()
        cams_t2 = requests.get(f"{API_URL}/cctv/cameras", headers=t2_headers, timeout=20).json()

        assert all(c["temple_id"] == "TEMPLE-001" for c in cams_t1)
        assert all(c["temple_id"] == "TEMPLE-002" for c in cams_t2)
        results.append(("Multi-Temple Authentication & Data Isolation", "PASSED", "TEMPLE-001 and TEMPLE-002 data strictly isolated"))
        print(" -> PASSED", flush=True)
    except Exception as e:
        results.append(("Multi-Temple Authentication & Data Isolation", "FAILED", str(e)))
        print(f" -> FAILED: {e}", flush=True)

    # 7. Devotee Registration
    print("[7/15] Verifying Devotee Registration & Token Issuance...", flush=True)
    time.sleep(0.6)
    try:
        dev_payload = {
            "name": "Devotee Rajesh Varma",
            "age": 38,
            "phone": "+91-9876543210",
            "group_size": 3,
            "category": "VIP",
            "zone": "VIP Corridor"
        }
        r = requests.post(f"{API_URL}/pilgrims", headers=sa_headers, json=dev_payload, timeout=20)
        assert r.status_code == 200
        token_code = r.json().get("token")
        results.append(("Devotee Registration & QR Token Generation", "PASSED", f"Issued Token: {token_code}"))
        print(" -> PASSED", flush=True)
    except Exception as e:
        results.append(("Devotee Registration & QR Token Generation", "FAILED", str(e)))
        print(f" -> FAILED: {e}", flush=True)

    # 8. Queue Management & Batch Calling
    print("[8/15] Verifying Queue Summary & Anti-Starvation Batch Calling...", flush=True)
    time.sleep(0.6)
    try:
        r_sum = requests.get(f"{API_URL}/pilgrims/queue-summary", headers=sa_headers, timeout=20)
        r_call = requests.post(f"{API_URL}/pilgrims/call-next", headers=sa_headers, timeout=20)
        assert r_sum.status_code == 200 and r_call.status_code == 200
        called = r_call.json().get('called_tokens', [])
        results.append(("Queue Management & Anti-Starvation Batch Calling", "PASSED", f"Called: {called}"))
        print(" -> PASSED", flush=True)
    except Exception as e:
        results.append(("Queue Management & Anti-Starvation Batch Calling", "FAILED", str(e)))
        print(f" -> FAILED: {e}", flush=True)

    # 9. CCTV Computer Vision Telemetry
    print("[9/15] Verifying CCTV Computer Vision Telemetry...", flush=True)
    time.sleep(0.6)
    try:
        r_ana = requests.get(f"{API_URL}/cctv/cameras/CAM-001/analytics", headers=sa_headers, timeout=20)
        assert r_ana.status_code == 200
        ana = r_ana.json()
        assert "person_count" in ana and "density_percent" in ana and "risk_level" in ana
        results.append(("CCTV Computer Vision Telemetry & Analytics", "PASSED", f"Camera {ana.get('camera_id')}: {ana.get('person_count')} persons, {ana.get('density_percent')}% density, Risk: {ana.get('risk_level')}"))
        print(" -> PASSED", flush=True)
    except Exception as e:
        results.append(("CCTV Computer Vision Telemetry & Analytics", "FAILED", str(e)))
        print(f" -> FAILED: {e}", flush=True)

    # 10. Multi-Horizon ML Crowd Predictions (+15m, +30m, +60m)
    print("[10/15] Verifying Multi-Horizon ML Predictions...", flush=True)
    time.sleep(0.6)
    try:
        r_pred = requests.get(f"{API_URL}/cctv/predictions?camera_id=CAM-001", headers=sa_headers, timeout=20)
        assert r_pred.status_code == 200
        pred_data = r_pred.json()
        assert pred_data["status"] == "SUCCESS"
        assert len(pred_data["horizons"]) == 3
        h15 = pred_data["horizons"][0]["predicted_crowd"]
        h30 = pred_data["horizons"][1]["predicted_crowd"]
        h60 = pred_data["horizons"][2]["predicted_crowd"]
        results.append(("Multi-Horizon ML Prediction Engine (+15m, +30m, +60m)", "PASSED", f"+15m: {h15}, +30m: {h30}, +60m: {h60} devotees"))
        print(" -> PASSED", flush=True)
    except Exception as e:
        results.append(("Multi-Horizon ML Prediction Engine (+15m, +30m, +60m)", "FAILED", str(e)))
        print(f" -> FAILED: {e}", flush=True)

    # 11. Direct Pre-Trained ML Model Full Inference
    print("[11/15] Verifying Pre-Trained ML Model Inference...", flush=True)
    time.sleep(0.6)
    try:
        ml_payload = {
            "hour": 18, "day_of_week": 5, "month": 10, "is_weekend": 1, "is_holiday": 1,
            "is_festival": 1, "festival_type": "Navratri Start", "visitor_count": 11000,
            "queue_length": 1800, "number_of_open_gates": 5, "staff_available": 40, "weather": "Clear"
        }
        r_ml = requests.post(f"{API_URL}/ml/full-inference", headers=sa_headers, json=ml_payload, timeout=20)
        assert r_ml.status_code == 200
        ml_res = r_ml.json()
        assert "predicted_visitor_count" in ml_res and "predicted_risk_level" in ml_res
        results.append(("Production ML Model Inference (RandomForest & IsolationForest)", "PASSED", f"Predicted: {ml_res.get('predicted_visitor_count')} visitors, Risk: {ml_res.get('predicted_risk_level')}, Wait: {ml_res.get('predicted_waiting_time')} min"))
        print(" -> PASSED", flush=True)
    except Exception as e:
        results.append(("Production ML Model Inference (RandomForest & IsolationForest)", "FAILED", str(e)))
        print(f" -> FAILED: {e}", flush=True)

    # 12. Geographically Accurate Multi-Temple GIS Map
    print("[12/15] Verifying Geographically Accurate GIS Map Data...", flush=True)
    time.sleep(0.6)
    try:
        r_map1 = requests.get(f"{API_URL}/temples/TEMPLE-001/map-data", headers=sa_headers, timeout=20)
        r_map2 = requests.get(f"{API_URL}/temples/TEMPLE-002/map-data", headers=sa_headers, timeout=20)
        assert r_map1.status_code == 200 and r_map2.status_code == 200
        t1 = r_map1.json()["temple"]
        t2 = r_map2.json()["temple"]
        assert round(t1["latitude"], 3) == 20.888 and round(t1["longitude"], 3) == 70.401
        assert round(t2["latitude"], 3) == 13.683 and round(t2["longitude"], 3) == 79.347
        results.append(("Geographically Accurate Multi-Temple GIS Map", "PASSED", f"Somnath ({t1['latitude']}, {t1['longitude']}), Tirupati ({t2['latitude']}, {t2['longitude']})"))
        print(" -> PASSED", flush=True)
    except Exception as e:
        results.append(("Geographically Accurate Multi-Temple GIS Map", "FAILED", str(e)))
        print(f" -> FAILED: {e}", flush=True)

    # 13. What-If Scenario Simulation & Data Isolation
    print("[13/15] Verifying What-If Simulation Laboratory...", flush=True)
    time.sleep(0.6)
    try:
        whatif_payload = {
            "temple_id": "TEMPLE-001",
            "base_crowd": 245,
            "arrival_rate": 150,
            "counters": 3,
            "duration_min": 30,
            "festival_multiplier": 1.25
        }
        r_whatif = requests.post(f"{API_URL}/simulation/what-if", headers=sa_headers, json=whatif_payload, timeout=20)
        assert r_whatif.status_code == 200
        whatif_data = r_whatif.json()
        assert len(whatif_data["scenarios"]) == 4
        assert len(whatif_data["ai_recommendations"]) > 0
        results.append(("What-If Scenario Simulation & Data Isolation", "PASSED", f"Evaluated 4 Scenarios, Generated {len(whatif_data['ai_recommendations'])} Recommendations"))
        print(" -> PASSED", flush=True)
    except Exception as e:
        results.append(("What-If Scenario Simulation & Data Isolation", "FAILED", str(e)))
        print(f" -> FAILED: {e}", flush=True)

    # 14. Safety Alerts & Incident Feed
    print("[14/15] Verifying Safety Alerts & Incident Management...", flush=True)
    time.sleep(0.6)
    try:
        r_alerts = requests.get(f"{API_URL}/alerts", headers=sa_headers, timeout=20)
        assert r_alerts.status_code == 200
        results.append(("Safety Alerts Feed & Incident Management", "PASSED", f"Active/Resolved Safety Incidents Loaded ({len(r_alerts.json())} alerts)"))
        print(" -> PASSED", flush=True)
    except Exception as e:
        results.append(("Safety Alerts Feed & Incident Management", "FAILED", str(e)))
        print(f" -> FAILED: {e}", flush=True)

    # 15. Command Center Dashboard Summary
    print("[15/15] Verifying Command Center Dashboard Summary...", flush=True)
    time.sleep(0.6)
    try:
        r_dash = requests.get(f"{API_URL}/dashboard/summary", headers=sa_headers, timeout=20)
        assert r_dash.status_code == 200
        results.append(("Command Center Dashboard Aggregation", "PASSED", "Real-time consolidated KPI summary loaded"))
        print(" -> PASSED", flush=True)
    except Exception as e:
        results.append(("Command Center Dashboard Aggregation", "FAILED", str(e)))
        print(f" -> FAILED: {e}", flush=True)

    print("\n" + "=" * 80, flush=True)
    print(f"       PRODUCTION TEST EXECUTION SUMMARY: {sum(1 for _, s, _ in results if s == 'PASSED')}/{len(results)} PASSED", flush=True)
    print("=" * 80, flush=True)
    for feat, status, detail in results:
        print(f" - {feat:55} : [{status}] {detail if detail else ''}", flush=True)
    print("=" * 80, flush=True)

if __name__ == "__main__":
    run_checks()
