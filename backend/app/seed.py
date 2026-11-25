import json
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from app.database import Base, engine
from app.models import Vessel, FeederService, VoyageSchedule, RegionalAgent


def _build_smnk_schedules() -> list[dict]:
    """Generate two rolling weekly SMNK feeder rotation cycles anchored to Monday UTC."""
    now = datetime.now(timezone.utc)
    week_monday = (now - timedelta(days=now.weekday())).replace(hour=0, minute=0, second=0, microsecond=0)

    def fmt(dt: datetime) -> str:
        return dt.strftime("%Y-%m-%dT%H:%M:%SZ")

    legs = [
        ("E", "Sohar (OMSOH)", "Nhava Sheva (INNSA)", 6, 3 * 24 + 14, -12, "On Schedule"),
        ("E", "Nhava Sheva (INNSA)", "Mundra (INMUN)", 4 * 24 + 2, 5 * 24 + 18, 3 * 24 + 16, "On Schedule"),
        ("W", "Mundra (INMUN)", "Karachi (PKKHI)", 6 * 24 + 10, 8 * 24 + 8, 5 * 24 + 22, "On Schedule"),
        ("W", "Karachi (PKKHI)", "Sohar (OMSOH)", 9 * 24 + 4, 11 * 24 + 12, 8 * 24 + 20, "On Schedule"),
    ]

    schedules: list[dict] = []
    for cycle_idx in range(1, 3):
        cycle_base = week_monday + timedelta(days=(cycle_idx - 1) * 7)
        for suffix, pol, pod, etd_h, eta_h, cutoff_h, status in legs:
            schedules.append(
                {
                    "vessel_name": "MAVERICK SOHAR",
                    "voyage_no": f"SMNK-{cycle_idx:03d}{suffix}",
                    "service_code": "SMNK",
                    "pol": pol,
                    "pod": pod,
                    "etd": fmt(cycle_base + timedelta(hours=etd_h)),
                    "eta": fmt(cycle_base + timedelta(hours=eta_h)),
                    "cutoff_date": fmt(cycle_base + timedelta(hours=cutoff_h)),
                    "status": status,
                }
            )
    return schedules


def seed_database(db: Session, force: bool = False):
    # Ensure all tables exist before querying or seeding
    Base.metadata.create_all(bind=engine)

    # Check if already seeded specifically with SMNK feeder configuration
    if not force:
        vessel_count = db.query(Vessel).count()
        agent_count = db.query(RegionalAgent).count()
        smnk_count = db.query(FeederService).filter(FeederService.code == "SMNK").count()
        if vessel_count == 1 and agent_count == 1 and smnk_count == 1:
            return

    # Clear existing data if reseeding
    db.query(VoyageSchedule).delete()
    db.query(Vessel).delete()
    db.query(FeederService).delete()
    db.query(RegionalAgent).delete()
    db.commit()

    # 1. Feeder Services (Primary: SMNK Sohar - Nhava Sheva - Mundra - Karachi Loop)
    services_data = [
        {
            "code": "SMNK",
            "name": "Sohar - Nhava Sheva - Mundra - Karachi Dedicated Feeder Loop",
            "description": "Dedicated regional container feeder service linking Sohar Gateway with Nhava Sheva, Mundra, and Karachi, connecting key trade markets across the Arabian Gulf, India, and Pakistan.",
            "transit_days": 11,
            "frequency": "Weekly Fixed Day",
            "port_rotation_json": json.dumps([
                {"port_name": "Sohar", "unlocode": "OMSOH", "lat": 24.498, "lng": 56.628, "day_of_week": "Day 1 (Mon)", "terminal": "Oman International Container Terminal (OICT) – Strategic gateway to the Arabian Gulf"},
                {"port_name": "Nhava Sheva (JNPT)", "unlocode": "INNSA", "lat": 18.950, "lng": 72.951, "day_of_week": "Day 4 (Thu)", "terminal": "Gateway Terminals India (GTI / BMCT) – Major container gateway for India's western coast"},
                {"port_name": "Mundra", "unlocode": "INMUN", "lat": 22.842, "lng": 69.712, "day_of_week": "Day 6 (Sat)", "terminal": "Adani Mundra Container Terminal (MICT) – Important commercial and container hub"},
                {"port_name": "Karachi", "unlocode": "PKKHI", "lat": 24.805, "lng": 66.975, "day_of_week": "Day 8 (Mon)", "terminal": "South Asia Pakistan Terminals (SAPT) – Key gateway for Pakistan's international trade"},
                {"port_name": "Sohar", "unlocode": "OMSOH", "lat": 24.498, "lng": 56.628, "day_of_week": "Day 11 (Thu)", "terminal": "Oman International Container Terminal (OICT) – Return Gateway"}
            ])
        }
    ]

    for s in services_data:
        db.add(FeederService(**s))
    db.commit()

    # 2. Vessels (Single Flagship Feeder: MAVERICK SOHAR aligned strictly with SMNK)
    vessels_data = [
        {
            "name": "MAVERICK SOHAR",
            "imo": "9418298",
            "call_sign": "A6MAV",
            "flag": "UAE",
            "built_year": 2021,
            "port_of_registry": "Dubai",
            "nominal_cap_teu": 1850,
            "effective_cap_teu": 1520,
            "reefer_plugs": 260,
            "gear": False,
            "bow_thruster": True,
            "grt": 16800.0,
            "nrt": 7950.0,
            "dwt": 22400.0,
            "loa": 172.0,
            "breadth": 27.4,
            "summer_draft": 8.5,
            "current_lat": 24.498,
            "current_lng": 56.628,
            "current_status": "SMNK Corridor — Weekly Scheduled Service",
            "service_code": "SMNK"
        }
    ]

    for v in vessels_data:
        db.add(Vessel(**v))
    db.commit()

    # 3. Voyage Schedules (Rolling SMNK Weekly Port Calls: Sohar -> Nhava Sheva -> Mundra -> Karachi -> Sohar)
    for sch in _build_smnk_schedules():
        db.add(VoyageSchedule(**sch))
    db.commit()

    # 4. Regional Agents (Single Global Corporate Operations HQ in Dubai)
    agents_data = [
        {
            "country": "UAE",
            "city": "Dubai",
            "office_name": "Maverick Shipping Hub HQ",
            "address": "Level 14, Tower 3, JAFZA One, Jebel Ali Free Zone, Dubai, UAE",
            "phone": "+971 4 210 51 05",
            "email": "commercial.uae@maverickshipping.com",
            "lat": 24.996,
            "lng": 55.086
        }
    ]

    for ag in agents_data:
        db.add(RegionalAgent(**ag))
    db.commit()
    print("Database seeding completed: 1 vessel, 1 office, SMNK feeder service.")
