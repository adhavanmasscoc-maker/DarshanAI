import requests
import json

BASE_URL = "http://127.0.0.1:8000/api"

def run_map_tests():
    print("==========================================================")
    print("     TESTING GEOGRAPHICALLY ACCURATE TEMPLE MAP GIS       ")
    print("==========================================================")

    # 1. Authenticate as Super Admin
    login_resp = requests.post(f"{BASE_URL}/auth/login", json={
        "email": "superadmin@darshanai.com",
        "password": "SuperAdmin123!"
    })
    assert login_resp.status_code == 200, f"Login failed: {login_resp.text}"
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    print("[1/5 OK] Super Admin Authenticated")

    # 2. Test TEMPLE-001 (Somnath Temple, Gujarat) Map Data
    res_somnath = requests.get(f"{BASE_URL}/temples/TEMPLE-001/map-data", headers=headers)
    assert res_somnath.status_code == 200, f"Failed Somnath map: {res_somnath.text}"
    som_data = res_somnath.json()
    assert abs(som_data["temple"]["latitude"] - 20.8880) < 0.001
    assert abs(som_data["temple"]["longitude"] - 70.4012) < 0.001
    assert len(som_data["zones"]) >= 10
    print(f"[2/5 OK] Verified Somnath Temple GIS: Lat={som_data['temple']['latitude']}, Lng={som_data['temple']['longitude']}, Zones={len(som_data['zones'])}")

    # 3. Test TEMPLE-002 (Tirupati Balaji, AP) Map Data
    res_tirupati = requests.get(f"{BASE_URL}/temples/TEMPLE-002/map-data", headers=headers)
    assert res_tirupati.status_code == 200
    tir_data = res_tirupati.json()
    assert abs(tir_data["temple"]["latitude"] - 13.6833) < 0.001
    assert abs(tir_data["temple"]["longitude"] - 79.3472) < 0.001
    print(f"[3/5 OK] Verified Tirupati Temple GIS: Lat={tir_data['temple']['latitude']}, Lng={tir_data['temple']['longitude']}, Zones={len(tir_data['zones'])}")

    # 4. Test TEMPLE-003 (Madurai Meenakshi, TN) Map Data
    res_madurai = requests.get(f"{BASE_URL}/temples/TEMPLE-003/map-data", headers=headers)
    assert res_madurai.status_code == 200
    mad_data = res_madurai.json()
    assert abs(mad_data["temple"]["latitude"] - 9.9195) < 0.001
    assert abs(mad_data["temple"]["longitude"] - 78.1193) < 0.001
    print(f"[4/5 OK] Verified Madurai Meenakshi Temple GIS: Lat={mad_data['temple']['latitude']}, Lng={mad_data['temple']['longitude']}, Zones={len(mad_data['zones'])}")

    # 5. Test Temple Location Update with Validation
    upd_resp = requests.put(f"{BASE_URL}/temples/TEMPLE-001/location", headers=headers, json={
        "latitude": 20.88805,
        "longitude": 70.40125,
        "address": "Prabhas Patan Coastal Highway, Somnath",
        "zoom_level": 18
    })
    assert upd_resp.status_code == 200
    print("[5/5 OK] Temple Location Update & Validation Verified")

    print("\n==========================================================")
    print("   [SUCCESS] ALL REAL TEMPLE MAP GIS TESTS PASSED!        ")
    print("==========================================================")

if __name__ == "__main__":
    run_map_tests()
