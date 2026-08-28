import requests
import json

BASE_URL = "http://127.0.0.1:8000/api"

def run_cctv_and_whatif_tests():
    print("==========================================================")
    print("  TESTING CCTV CROWD MONITORING, ML PREDICTION & WHAT-IF   ")
    print("==========================================================")

    # 1. Authenticate
    login_resp = requests.post(f"{BASE_URL}/auth/login", json={
        "email": "superadmin@darshanai.com",
        "password": "SuperAdmin123!"
    })
    assert login_resp.status_code == 200, f"Login failed: {login_resp.text}"
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    print("[1/6 OK] Super Admin Authenticated")

    # 2. Test Camera Listing
    cams_resp = requests.get(f"{BASE_URL}/cctv/cameras", headers=headers)
    assert cams_resp.status_code == 200, f"Cameras failed: {cams_resp.text}"
    cameras = cams_resp.json()
    assert len(cameras) >= 5, f"Expected at least 5 cameras, got {len(cameras)}"
    print(f"[2/6 OK] Retrieved {len(cameras)} Configured CCTV Cameras with Detection Metrics")

    # 3. Test Camera Analytics & Live CV Processing
    ana_resp = requests.get(f"{BASE_URL}/cctv/cameras/CAM-001/analytics", headers=headers)
    assert ana_resp.status_code == 200, f"Analytics failed: {ana_resp.text}"
    analytics = ana_resp.json()
    assert "person_count" in analytics
    assert "entry_rate" in analytics
    assert "density_percent" in analytics
    assert "risk_level" in analytics
    print(f"[3/6 OK] CAM-001 Computer Vision Analytics: Person Count={analytics['person_count']}, Inflow={analytics['entry_rate']}/min, Density={analytics['density_percent']}%, Risk={analytics['risk_level']}")

    # 4. Test Multi-Horizon ML Predictions (+15m, +30m, +60m)
    pred_resp = requests.get(f"{BASE_URL}/cctv/predictions?camera_id=CAM-001", headers=headers)
    assert pred_resp.status_code == 200, f"Predictions failed: {pred_resp.text}"
    pred_data = pred_resp.json()
    assert pred_data["status"] == "SUCCESS"
    assert len(pred_data["horizons"]) == 3
    print(f"[4/6 OK] Multi-Horizon ML Predictions Verified: +15m={pred_data['horizons'][0]['predicted_crowd']}, +30m={pred_data['horizons'][1]['predicted_crowd']}, +60m={pred_data['horizons'][2]['predicted_crowd']}")

    # 5. Test Edge Detection Ingestion
    ingest_resp = requests.post(f"{BASE_URL}/cctv/detection", json={
        "temple_id": "TEMPLE-001",
        "zone_code": "main_entrance",
        "camera_id": "EDGE-CAM-01",
        "person_count": 88,
        "entry_rate": 55,
        "exit_rate": 18,
        "density_percent": 29.3,
        "risk_level": "LOW"
    })
    assert ingest_resp.status_code == 200
    print("[5/6 OK] Edge AI Detection Ingestion Endpoint Verified")

    # 6. Test What-If Multi-Scenario Simulation & AI Recommendations
    whatif_resp = requests.post(f"{BASE_URL}/simulation/what-if", headers=headers, json={
        "temple_id": "TEMPLE-001",
        "base_crowd": 245,
        "arrival_rate": 150,
        "counters": 3,
        "duration_min": 30,
        "festival_multiplier": 1.25
    })
    assert whatif_resp.status_code == 200, f"What-If failed: {whatif_resp.text}"
    whatif_data = whatif_resp.json()
    assert whatif_data["status"] == "SUCCESS"
    assert len(whatif_data["scenarios"]) == 4
    assert len(whatif_data["ai_recommendations"]) > 0
    print(f"[6/6 OK] What-If Scenario Simulation Matrix Verified: {len(whatif_data['scenarios'])} Scenarios Evaluated, {len(whatif_data['ai_recommendations'])} Recommendations Produced")

    print("\n==========================================================")
    print("   [SUCCESS] ALL CCTV, ML PREDICTION & WHAT-IF TESTS PASSED! ")
    print("==========================================================")

if __name__ == "__main__":
    run_cctv_and_whatif_tests()
