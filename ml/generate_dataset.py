import os
import csv
import math
import random
from datetime import datetime, timedelta

def generate_synthetic_dataset(num_records=52000, output_path="data/crowd_dataset.csv"):
    os.makedirs("data", exist_ok=True)
    
    headers = [
        "timestamp", "temple_id", "day_of_week", "month", "festival", "holiday",
        "weather", "temperature", "rainfall", "entry_count", "exit_count",
        "current_crowd", "queue_length", "active_counters", "average_service_time",
        "darshan_type", "staff_count", "security_count", "zone_id", "zone_capacity",
        "waiting_time", "crowd_density", "risk_level"
    ]
    
    start_time = datetime(2025, 1, 1, 4, 0, 0)
    temple_ids = ["TEMPLE-001", "TEMPLE-002", "TEMPLE-003"]
    weathers = ["Clear", "Sunny", "Cloudy", "Rainy", "Heavy Rain"]
    darshan_types = ["General Darshan", "Special Darshan", "VIP", "Senior Citizen", "Divyang", "Children / Family"]
    zones = [
        ("main_entrance", 3000), ("queue_area", 4500), ("darshan_hall", 2500),
        ("prasadam_area", 2000), ("exit_gates", 2000), ("parking_lot", 5000)
    ]
    
    print(f"[DATASET GENERATOR] Generating {num_records:,} realistic operational records...")
    
    with open(output_path, mode="w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        
        current_time = start_time
        for i in range(num_records):
            temple_id = random.choice(temple_ids)
            day_of_week = current_time.weekday() # 0-6
            month = current_time.month
            hour = current_time.hour
            
            is_weekend = 1 if day_of_week >= 5 else 0
            is_holiday = 1 if (month == 10 and 15 <= current_time.day <= 25) or (month == 11 and current_time.day <= 10) else 0
            is_festival = 1 if (month == 10 and 18 <= current_time.day <= 22) or (month == 3 and current_time.day == 25) else 0
            
            # Weather logic
            if month in [6, 7, 8]:
                weather = random.choice(["Cloudy", "Rainy", "Heavy Rain"])
                rainfall = round(random.uniform(5.0, 35.0), 1) if weather != "Cloudy" else 0.0
                temp = round(random.uniform(24.0, 29.0), 1)
            else:
                weather = random.choice(["Clear", "Sunny", "Cloudy"])
                rainfall = 0.0
                temp = round(random.uniform(20.0, 34.0), 1)

            # Operational relationships
            base_multiplier = 1.0
            if is_festival: base_multiplier *= 2.2
            elif is_holiday: base_multiplier *= 1.6
            elif is_weekend: base_multiplier *= 1.35
            
            is_peak_hour = (7 <= hour <= 11) or (16 <= hour <= 20)
            if is_peak_hour: base_multiplier *= 1.4
            
            # Entry / Exit counts
            entry_count = int(max(100, 800 * base_multiplier + random.randint(-150, 150)))
            exit_count = int(max(80, 750 * base_multiplier + random.randint(-120, 120)))
            current_crowd = int(max(400, (entry_count * 2.8) + random.randint(-200, 200)))
            
            active_counters = random.randint(4, 8) if is_festival or is_peak_hour else random.randint(3, 5)
            queue_length = int(max(50, (current_crowd * 0.32) - (active_counters * 40) + random.randint(-30, 30)))
            
            avg_service_time = round(random.uniform(2.0, 4.5), 1)
            waiting_time = round(max(5.0, (queue_length / max(1, active_counters * 25.0)) * avg_service_time), 1)
            
            darshan_type = random.choice(darshan_types)
            staff_count = random.randint(35, 60) if is_festival else random.randint(20, 35)
            security_count = random.randint(20, 40) if is_festival else random.randint(10, 25)
            
            zone_id, zone_cap = random.choice(zones)
            crowd_density = round(min(1.2, (current_crowd * 0.2) / float(zone_cap)), 3)
            
            if crowd_density > 0.85 or queue_length > 2500:
                risk_level = "Critical"
            elif crowd_density > 0.70 or queue_length > 1500:
                risk_level = "High"
            elif crowd_density > 0.45 or queue_length > 800:
                risk_level = "Moderate"
            else:
                risk_level = "Low"

            row = [
                current_time.strftime("%Y-%m-%d %H:%M:%S"), temple_id, day_of_week, month,
                is_festival, is_holiday, weather, temp, rainfall, entry_count, exit_count,
                current_crowd, queue_length, active_counters, avg_service_time,
                darshan_type, staff_count, security_count, zone_id, zone_cap,
                waiting_time, crowd_density, risk_level
            ]
            writer.writerow(row)
            
            current_time += timedelta(minutes=10)

    print(f"[OK] Generated {num_records:,} records in {output_path}")

if __name__ == "__main__":
    generate_synthetic_dataset()
