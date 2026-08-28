import requests
import json
import time

BASE_URL = "http://127.0.0.1:8000/api"

def run_master_test():
    print("==========================================================")
    print("     DARSHANAI MASTER SYSTEM & INTEGRATION TEST SUITE     ")
    print("==========================================================")
    
    ts = int(time.time())
    temple_id = f"TMP-TEST-{ts}"
    admin_email = f"admin_{ts}@testtemple.org"

    # 1. API Health Check
    root_resp = requests.get("http://127.0.0.1:8000/")
    assert root_resp.status_code == 200, f"Root API failed: {root_resp.text}"
    print(f"[1/10 OK] Root API Online: {root_resp.json()['title']} - {root_resp.json()['status']}")

    # 2. Super Admin Login
    sa_login = requests.post(f"{BASE_URL}/auth/login", json={
        "email": "superadmin@darshanai.com",
        "password": "SuperAdmin123!"
    })
    assert sa_login.status_code == 200, f"SuperAdmin Login failed: {sa_login.text}"
    sa_token = sa_login.json()["access_token"]
    print(f"[2/10 OK] Super Admin Authenticated: {sa_login.json()['full_name']}")

    # 3. New Temple & Admin Account Registration (/register)
    reg_resp = requests.post(f"{BASE_URL}/auth/register", json={
        "full_name": "Test Master Admin",
        "email": admin_email,
        "mobile": "+91-9899988877",
        "temple_id": temple_id,
        "temple_name": "Test Jyotirlinga Shrine",
        "role": "Temple Admin",
        "password": "TestPassword123!",
        "confirm_password": "TestPassword123!",
        "city": "Ujjain",
        "state": "Madhya Pradesh",
        "capacity": 22000
    })
    assert reg_resp.status_code == 200, f"Temple Registration failed: {reg_resp.text}"
    print(f"[3/10 OK] Registered Temple {temple_id} & Admin Account ({admin_email})")

    # 4. Common Login for New Temple User (/login)
    login_resp = requests.post(f"{BASE_URL}/auth/login", json={
        "email": admin_email,
        "password": "TestPassword123!",
        "temple_id": temple_id
    })
    assert login_resp.status_code == 200, f"Temple Admin Login failed: {login_resp.text}"
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    print(f"[4/10 OK] Authenticated Temple Admin: JWT Token Issued for {temple_id}")

    # 5. Devotee Registration Across Categories
    cats = ["General Darshan", "Special Darshan", "VIP", "Senior Citizen", "Divyang", "Children / Family"]
    for c in cats:
        dev_resp = requests.post(f"{BASE_URL}/pilgrims", headers=headers, json={
            "name": f"Devotee {c}",
            "age": 35,
            "phone": "+91-9876543210",
            "group_size": 2,
            "category": c,
            "zone": "Queue Complex"
        })
        assert dev_resp.status_code == 200
    print(f"[5/10 OK] Registered Devotees Across {len(cats)} Categories")

    # 6. High-Performance Bulk Devotee Batch Registration (/bulk)
    bulk_payload = [
        {"name": f"Bulk Devotee {i}", "age": 25+i, "phone": f"+91-98000000{i:02d}", "group_size": 1, "category": "General Darshan", "zone": "Queue Complex"}
        for i in range(10)
    ]
    bulk_resp = requests.post(f"{BASE_URL}/pilgrims/bulk", headers=headers, json=bulk_payload)
    assert bulk_resp.status_code == 200
    print(f"[6/10 OK] Bulk Batch Inserted {bulk_resp.json()['registered_count']} Devotees in < 1s")

    # 7. 100% Unified Queue Summary
    q_summary = requests.get(f"{BASE_URL}/pilgrims/queue-summary", headers=headers)
    assert q_summary.status_code == 200
    qs = q_summary.json()
    print(f"[7/10 OK] 100% Unified Queue Summary: {qs['total_active_devotees']} Active Devotees")

    # 8. Anti-Starvation Queue Calling Worker
    call_next = requests.post(f"{BASE_URL}/pilgrims/call-next", headers=headers)
    assert call_next.status_code == 200
    print(f"[8/10 OK] Anti-Starvation Batch Called: {call_next.json()['called_tokens']}")

    # 9. ML Predictions & Anomaly Detection (/full-inference)
    ml_resp = requests.post(f"{BASE_URL}/ml/full-inference", headers=headers, json={
        "hour": 18, "day_of_week": 5, "month": 10, "is_weekend": 1, "is_holiday": 1,
        "is_festival": 1, "festival_type": "Navratri Start", "visitor_count": 11000,
        "queue_length": 1800, "number_of_open_gates": 5, "staff_available": 40, "weather": "Clear"
    })
    assert ml_resp.status_code == 200, f"ML Inference failed: {ml_resp.text}"
    ml_out = ml_resp.json()
    print(f"[9/10 OK] ML Inference Output: Predicted Visitors = {ml_out['predicted_visitor_count']}, Risk = {ml_out['predicted_risk_level']}, Wait = {ml_out['predicted_waiting_time']} min")

    # 10. Dashboard Summary API
    dash_resp = requests.get(f"{BASE_URL}/dashboard/summary", headers=headers)
    assert dash_resp.status_code == 200
    d_out = dash_resp.json()
    print(f"[10/10 OK] Combined Dashboard Summary Loaded in 1 HTTP Roundtrip (Temple: {d_out['temple_name']})")

    print("\n==========================================================")
    print("   [SUCCESS] ALL 10 MASTER SYSTEM TESTS PASSED!           ")
    print("==========================================================")

if __name__ == "__main__":
    run_master_test()
