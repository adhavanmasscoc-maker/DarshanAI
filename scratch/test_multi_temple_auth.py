import requests
import json
import time

BASE_URL = "http://127.0.0.1:8000/api"

def run_tests():
    print("--- TESTING MULTI-TEMPLE USER REGISTRATION & AUTHENTICATION ---")
    ts = int(time.time())
    email_admin = f"admin_{ts}@kashivishwanath.org"
    email_staff = f"staff_{ts}@kashivishwanath.org"

    # 1. Register New Temple & Admin Account via Common /register
    reg_admin = requests.post(f"{BASE_URL}/auth/register", json={
        "full_name": "Mahant Kashi Lead",
        "email": email_admin,
        "mobile": "+91-9870001122",
        "temple_id": f"TEMP-{ts}",
        "temple_name": "Sri Kashi Vishwanath Temple",
        "role": "Temple Admin",
        "password": "KashiAdmin123!",
        "confirm_password": "KashiAdmin123!",
        "city": "Varanasi",
        "state": "Uttar Pradesh",
        "capacity": 20000
    })
    assert reg_admin.status_code == 200, f"Registration failed: {reg_admin.text}"
    adm_data = reg_admin.json()
    print(f"[OK] Registered Temple {adm_data['temple_id']} & Admin: {adm_data['full_name']} ({adm_data['email']})")

    # 2. Register Staff User (Receptionist) under same Temple
    reg_staff = requests.post(f"{BASE_URL}/auth/register", json={
        "full_name": "Sunil Kumar (Receptionist)",
        "email": email_staff,
        "mobile": "+91-9870003344",
        "temple_id": adm_data['temple_id'],
        "role": "Receptionist",
        "password": "Reception123!",
        "confirm_password": "Reception123!"
    })
    assert reg_staff.status_code == 200, f"Staff registration failed: {reg_staff.text}"
    stf_data = reg_staff.json()
    print(f"[OK] Registered Staff: {stf_data['full_name']} (Role: {stf_data['role']}, Temple: {stf_data['temple_id']})")

    # 3. Authenticate via Common /login Page API
    login_resp = requests.post(f"{BASE_URL}/auth/login", json={
        "email": email_admin,
        "password": "KashiAdmin123!",
        "temple_id": adm_data['temple_id']
    })
    assert login_resp.status_code == 200, f"Login failed: {login_resp.text}"
    auth_data = login_resp.json()
    print(f"[OK] Login Successful for {auth_data['full_name']} (JWT Token Received)")

    # 4. Verify Server-Side Data Isolation Context
    headers = {"Authorization": f"Bearer {auth_data['access_token']}"}
    me_resp = requests.get(f"{BASE_URL}/auth/me", headers=headers)
    assert me_resp.status_code == 200
    me_data = me_resp.json()
    print(f"[OK] Authenticated Context Verified: Temple = {me_data['temple_name']} ({me_data['temple_id']}), Role = {me_data['role']}")

    # 5. Test Forgot Password Token Generation
    forgot_resp = requests.post(f"{BASE_URL}/auth/forgot-password", json={
        "email": email_admin,
        "temple_id": adm_data['temple_id']
    })
    assert forgot_resp.status_code == 200
    f_data = forgot_resp.json()
    reset_tok = f_data.get("reset_token")
    print(f"[OK] Forgot Password Token Issued: {reset_tok}")

    # 6. Reset Password Execution
    reset_resp = requests.post(f"{BASE_URL}/auth/reset-password", json={
        "reset_token": reset_tok,
        "new_password": "NewKashiPassword123!",
        "confirm_password": "NewKashiPassword123!"
    })
    assert reset_resp.status_code == 200
    print(f"[OK] Password Reset Execution Completed!")

    print("\nALL MULTI-TEMPLE AUTHENTICATION TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    run_tests()
