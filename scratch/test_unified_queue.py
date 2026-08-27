import requests
import json

BASE_URL = "http://127.0.0.1:8000/api"

def run_tests():
    print("--- TESTING 100% UNIFIED DEVOTEE QUEUE & TOKEN ENGINE ---")
    
    # 1. Login as Temple Admin via JSON /api/auth/login
    login_resp = requests.post(f"{BASE_URL}/auth/login", json={
        "email": "admin@temple001.com",
        "password": "TempleAdmin123!",
        "temple_id": "TEMPLE-001"
    })
    if login_resp.status_code != 200:
        print(f"[FAIL] Login failed: {login_resp.text}")
        return
        
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    print("[OK] Authenticated as Temple Admin.")

    # 2. Get Queue Summary (100% Devotees & 8 Categories)
    summary_resp = requests.get(f"{BASE_URL}/pilgrims/queue-summary", headers=headers)
    assert summary_resp.status_code == 200
    summary = summary_resp.json()
    print("[OK] Queue Summary Received:")
    print(f"   Total Devotees in Queue: {summary['total_active_devotees']}")
    print(f"   Category Breakdown: {json.dumps(summary['category_breakdown'], indent=2)}")

    # 3. Create Devotee Token across Divyang Category
    create_resp = requests.post(f"{BASE_URL}/pilgrims", headers=headers, json={
        "name": "Sunita Devi (Divyang)",
        "age": 45,
        "phone": "+91-9877700011",
        "group_size": 2,
        "category": "Divyang",
        "zone": "Queue Complex"
    })
    assert create_resp.status_code == 200
    p = create_resp.json()
    print(f"[OK] Registered Divyang Token: {p['token']} (Category: {p['category']}, Status: {p['status']})")

    # 4. Call Next Anti-Starvation Batch
    call_resp = requests.post(f"{BASE_URL}/pilgrims/call-next", headers=headers)
    assert call_resp.status_code == 200
    call_data = call_resp.json()
    print(f"[OK] Anti-Starvation Batch Called: {call_data['called_tokens']} (Ratio: {call_data['ratio_applied']})")

    # 5. Transition Token Lifecycle Status
    trans_resp = requests.put(f"{BASE_URL}/pilgrims/{p['id']}/status", headers=headers, json={
        "status": "SERVING",
        "counter": "Counter 4"
    })
    assert trans_resp.status_code == 200
    p_trans = trans_resp.json()
    print(f"[OK] Status Transition Successful: {p_trans['token']} -> {p_trans['status']} at {p_trans['counter']}")

    print("\nALL UNIFIED QUEUE TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    run_tests()
