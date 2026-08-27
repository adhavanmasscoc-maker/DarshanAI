import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from backend.config import settings
from backend.database import engine, Base, SessionLocal
from backend.models.temple import Temple
from backend.models.user import User
from backend.models.alert import Alert
from backend.models.pilgrim import Pilgrim
from backend.services.auth_service import get_password_hash

from backend.routers import auth, temples, dashboard, ml, simulation, alerts, pilgrims

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="DARSHANAI - AI-Powered Multi-Temple Crowd Intelligence & Safety Management System"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(temples.router, prefix=settings.API_V1_STR)
app.include_router(dashboard.router, prefix=settings.API_V1_STR)
app.include_router(ml.router, prefix=settings.API_V1_STR)
app.include_router(simulation.router, prefix=settings.API_V1_STR)
app.include_router(alerts.router, prefix=settings.API_V1_STR)
app.include_router(pilgrims.router, prefix=settings.API_V1_STR)

@app.on_event("startup")
def startup_event():
    # Create all DB tables
    Base.metadata.create_all(bind=engine)
    seed_database()

def seed_database():
    db: Session = SessionLocal()
    try:
        # 1. Seed Temples if empty
        if db.query(Temple).count() == 0:
            print("[SEEDING] Adding initial temples...")
            t1 = Temple(
                temple_id="TEMPLE-001",
                name="Sri Somnath Jyotirlinga Temple",
                address="Prabhas Patan",
                city="Somnath",
                state="Gujarat",
                country="India",
                contact_number="+91-9876543210",
                email="contact@somnath.org",
                capacity=18000,
                opening_time="04:00 AM",
                closing_time="10:00 PM",
                status="ACTIVE",
                latitude=20.8880,
                longitude=70.4012
            )
            t2 = Temple(
                temple_id="TEMPLE-002",
                name="Sri Venkateswara Swamy Temple",
                address="Tirumala Hills",
                city="Tirupati",
                state="Andhra Pradesh",
                country="India",
                contact_number="+91-9876543211",
                email="contact@tirumala.org",
                capacity=25000,
                opening_time="03:00 AM",
                closing_time="11:30 PM",
                status="ACTIVE",
                latitude=13.6833,
                longitude=79.3472
            )
            t3 = Temple(
                temple_id="TEMPLE-003",
                name="Sri Meenakshi Sundareswarar Temple",
                address="Madurai Main",
                city="Madurai",
                state="Tamil Nadu",
                country="India",
                contact_number="+91-9876543212",
                email="contact@meenakshi.org",
                capacity=15000,
                opening_time="05:00 AM",
                closing_time="09:30 PM",
                status="ACTIVE",
                latitude=9.9195,
                longitude=78.1193
            )
            db.add_all([t1, t2, t3])
            db.commit()

        # 2. Seed Users if empty
        if db.query(User).count() == 0:
            print("[SEEDING] Adding initial users across roles...")
            users = [
                User(
                    temple_id=None,
                    email="superadmin@darshanai.com",
                    hashed_password=get_password_hash("SuperAdmin123!"),
                    full_name="Global Platform Super Admin",
                    role="SUPER_ADMIN",
                    is_active=True
                ),
                User(
                    temple_id="TEMPLE-001",
                    email="admin@temple001.com",
                    hashed_password=get_password_hash("TempleAdmin123!"),
                    full_name="Somnath Temple Administrator",
                    role="TEMPLE_ADMIN",
                    is_active=True
                ),
                User(
                    temple_id="TEMPLE-001",
                    email="manager@temple001.com",
                    hashed_password=get_password_hash("Manager123!"),
                    full_name="Rajesh Kumar (Operations Manager)",
                    role="MANAGER",
                    is_active=True
                ),
                User(
                    temple_id="TEMPLE-001",
                    email="security@temple001.com",
                    hashed_password=get_password_hash("Security123!"),
                    full_name="Vikram Singh (Chief Security Officer)",
                    role="SECURITY",
                    is_active=True
                ),
                User(
                    temple_id="TEMPLE-001",
                    email="medical@temple001.com",
                    hashed_password=get_password_hash("Medical123!"),
                    full_name="Dr. Ananya Sharma (First Aid Lead)",
                    role="MEDICAL",
                    is_active=True
                ),
                User(
                    temple_id="TEMPLE-001",
                    email="reception@temple001.com",
                    hashed_password=get_password_hash("Reception123!"),
                    full_name="Suresh Patel (Token Receptionist)",
                    role="RECEPTIONIST",
                    is_active=True
                ),
                User(
                    temple_id="TEMPLE-001",
                    email="volunteer@temple001.com",
                    hashed_password=get_password_hash("Volunteer123!"),
                    full_name="Amit Verma (Queue Volunteer Lead)",
                    role="VOLUNTEER",
                    is_active=True
                ),
                User(
                    temple_id="TEMPLE-002",
                    email="admin@temple002.com",
                    hashed_password=get_password_hash("TempleAdmin123!"),
                    full_name="Tirupati Temple Administrator",
                    role="TEMPLE_ADMIN",
                    is_active=True
                ),
                User(
                    temple_id="TEMPLE-003",
                    email="admin@temple003.com",
                    hashed_password=get_password_hash("TempleAdmin123!"),
                    full_name="Madurai Temple Administrator",
                    role="TEMPLE_ADMIN",
                    is_active=True
                )
            ]
            db.add_all(users)
            db.commit()

        # 3. Seed initial alerts if empty
        if db.query(Alert).count() == 0:
            print("[SEEDING] Adding sample safety alerts...")
            alerts = [
                Alert(
                    temple_id="TEMPLE-001",
                    severity="HIGH",
                    zone="Queue Complex",
                    description="Sudden 25% surge in queue density at Gate 2. Open backup counter 4.",
                    alert_type="CROWD_SURGE",
                    status="ACTIVE"
                ),
                Alert(
                    temple_id="TEMPLE-001",
                    severity="MEDIUM",
                    zone="Darshan Hall",
                    description="Average waiting time exceeded 40 minutes threshold.",
                    alert_type="RISK_SURGE",
                    status="ACTIVE"
                )
            ]
            db.add_all(alerts)
            db.commit()

        # 4. Seed initial multi-category devotees if empty
        if db.query(Pilgrim).count() == 0:
            print("[SEEDING] Adding multi-category sample devotees...")
            pilgrims = [
                Pilgrim(
                    temple_id="TEMPLE-001",
                    name="Amitabh Sen",
                    age=42,
                    phone="+91-9811122233",
                    group_size=5,
                    category="General Darshan",
                    darshan_type="General Darshan",
                    token="TKN-GEN-0104",
                    queue_position=1,
                    zone="Queue Complex",
                    counter="Counter 1",
                    estimated_wait_min=35.0,
                    status="WAITING"
                ),
                Pilgrim(
                    temple_id="TEMPLE-001",
                    name="Ramesh Sharma",
                    age=45,
                    phone="+91-9844455566",
                    group_size=4,
                    category="Special Darshan",
                    darshan_type="Special Darshan",
                    token="TKN-SPC-0102",
                    queue_position=2,
                    zone="Sanctum Corridor",
                    counter="Counter 3",
                    estimated_wait_min=15.0,
                    status="IN_DARSHAN"
                ),
                Pilgrim(
                    temple_id="TEMPLE-001",
                    name="Industrialist K. Singhania",
                    age=58,
                    phone="+91-9877788899",
                    group_size=2,
                    category="VIP",
                    darshan_type="VIP",
                    token="TKN-VIP-0012",
                    queue_position=3,
                    zone="VIP Gate",
                    counter="VIP Gate",
                    estimated_wait_min=5.0,
                    status="CALLED"
                ),
                Pilgrim(
                    temple_id="TEMPLE-001",
                    name="Priya Nair (Senior Citizen)",
                    age=72,
                    phone="+91-9822233344",
                    group_size=2,
                    category="Senior Citizen",
                    darshan_type="Senior Citizen",
                    token="TKN-SNR-0018",
                    queue_position=4,
                    zone="Queue Complex",
                    counter="Counter 3",
                    estimated_wait_min=12.0,
                    status="WAITING"
                ),
                Pilgrim(
                    temple_id="TEMPLE-001",
                    name="Divyang Pilgrim (Wheelchair)",
                    age=38,
                    phone="+91-9833344455",
                    group_size=1,
                    category="Divyang",
                    darshan_type="Divyang",
                    token="TKN-DIV-0005",
                    queue_position=5,
                    zone="Queue Complex",
                    counter="Counter 4",
                    estimated_wait_min=8.0,
                    status="SERVING"
                ),
                Pilgrim(
                    temple_id="TEMPLE-001",
                    name="Kavita Reddy & Family",
                    age=34,
                    phone="+91-9855566677",
                    group_size=6,
                    category="Children / Family",
                    darshan_type="Children / Family",
                    token="TKN-FAM-0021",
                    queue_position=6,
                    zone="Queue Complex",
                    counter="Counter 2",
                    estimated_wait_min=25.0,
                    status="WAITING"
                ),
                Pilgrim(
                    temple_id="TEMPLE-001",
                    name="Emergency Heat Paramedic Assist",
                    age=29,
                    phone="+91-9866677788",
                    group_size=1,
                    category="Medical / Emergency",
                    darshan_type="Medical / Emergency",
                    token="TKN-MED-0002",
                    queue_position=7,
                    zone="Medical Aid Station",
                    counter="Counter 4",
                    estimated_wait_min=0.0,
                    status="COMPLETED"
                )
            ]
            db.add_all(pilgrims)
            db.commit()

    finally:
        db.close()

@app.get("/")
def root():
    return {
        "title": settings.PROJECT_NAME,
        "status": "ONLINE",
        "docs_url": "/docs",
        "tagline": "Predict. Prevent. Protect."
    }
