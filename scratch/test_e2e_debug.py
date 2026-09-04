import requests
import json
import time

BASE_URL = "http://127.0.0.1:8000/api"

def debug_e2e():
    # 1. Sign-Up check
    test_email = f"officer_{int(time.time())}@temple001.org"
    reg_payload = {
        "email": test_email,
        "full_name": "Test Operations Officer",
        "password": "SecurePassword123!",
        "confirm_password": "SecurePassword123!",
        "role": "SECURITY",
        "temple_id": "TEMPLE-001"
    }
    r1 = requests.post(f"{BASE_URL}/auth/register", json=reg_payload)
    print(f"Register status: {r1.status_code}, response: {r1.text}")

    # 2. Super admin login
    r_sa = requests.post(f"{BASE_URL}/auth/login", json={"email": "superadmin@darshanai.com", "password": "SuperAdmin123!"})
    print(f"Super admin login: {r_sa.status_code}, response: {r_sa.text}")
    sa_token = r_sa.json().get("access_token")
    sa_headers = {"Authorization": f"Bearer {sa_token}"}

    # 3. Devotee registration
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
    r_dev = requests.post(f"{BASE_URL}/pilgrims/register", headers=sa_headers, json=dev_payload)
    print(f"Devotee register status: {r_dev.status_code}, response: {r_dev.text}")

    # 4. ML Predict
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
    print(f"ML predict status: {r_ml.status_code}, response: {r_ml.text}")

if __name__ == "__main__":
    debug_e2e()
