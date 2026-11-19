import json
from sqlalchemy.orm import Session
from app.models import Vessel, FeederService, VoyageSchedule, RegionalAgent

def seed_database(db: Session, force: bool = False):
    # Check if already correctly seeded with 1 vessel and 1 office
    if not force:
        vessel_count = db.query(Vessel).count()
        agent_count = db.query(RegionalAgent).count()
        if vessel_count == 1 and agent_count == 1:
            return

    # Clear existing data if reseeding
    db.query(VoyageSchedule).delete()
    db.query(Vessel).delete()
    db.query(FeederService).delete()
    db.query(RegionalAgent).delete()
    db.commit()

    # 1. Feeder Services (Primary: SMNK Sohar - Mundra - Nhava Sheva - Karachi Loop)
    services_data = [
        {
            "code": "SMNK",
            "name": "Sohar - Mundra - Nhava Sheva - Karachi Express Loop",
            "description": "Direct weekly feeder loop connecting Oman gateway Sohar with Mundra, Nhava Sheva, and Karachi with dedicated fast turnaround.",
            "transit_days": 11,
            "frequency": "Weekly Fixed Day",
            "port_rotation_json": json.dumps([
                {"port_name": "Sohar", "unlocode": "OMSOH", "lat": 24.498, "lng": 56.628, "day_of_week": "Monday", "terminal": "Oman International Container Terminal (OICT)"},
                {"port_name": "Mundra", "unlocode": "INMUN", "lat": 22.842, "lng": 69.712, "day_of_week": "Thursday", "terminal": "Adani Mundra Container Terminal (MICT)"},
                {"port_name": "Nhava Sheva (JNPT)", "unlocode": "INNSA", "lat": 18.950, "lng": 72.951, "day_of_week": "Saturday", "terminal": "Gateway Terminals India (GTI / BMCT)"},
                {"port_name": "Karachi", "unlocode": "PKKHI", "lat": 24.805, "lng": 66.975, "day_of_week": "Monday", "terminal": "South Asia Pakistan Terminals (SAPT)"},
                {"port_name": "Sohar", "unlocode": "OMSOH", "lat": 24.498, "lng": 56.628, "day_of_week": "Thursday", "terminal": "Oman International Container Terminal (OICT)"}
            ])
        }
    ]

    for s in services_data:
        db.add(FeederService(**s))
    db.commit()

    # 2. Vessels (Single Flagship Feeder: MAVERICK SOHAR)
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
            "current_lat": 23.820,
            "current_lng": 61.450,
            "current_status": "Underway using Engine - 15.4 kn (En Route to Mundra)",
            "service_code": "SMNK"
        }
    ]

    for v in vessels_data:
        db.add(Vessel(**v))
    db.commit()

    # 3. Voyage Schedules (Weekly Port Calls for MAVERICK SOHAR on SMNK)
    schedules_data = [
        {
            "vessel_name": "MAVERICK SOHAR",
            "voyage_no": "SMNK-001E",
            "service_code": "SMNK",
            "pol": "Sohar (OMSOH)",
            "pod": "Mundra (INMUN)",
            "etd": "2026-11-23T06:00:00Z",
            "eta": "2026-11-26T14:00:00Z",
            "cutoff_date": "2026-11-22T18:00:00Z",
            "status": "On Schedule"
        },
        {
            "vessel_name": "MAVERICK SOHAR",
            "voyage_no": "SMNK-001E",
            "service_code": "SMNK",
            "pol": "Mundra (INMUN)",
            "pod": "Nhava Sheva (INNSA)",
            "etd": "2026-11-27T02:00:00Z",
            "eta": "2026-11-28T18:00:00Z",
            "cutoff_date": "2026-11-26T16:00:00Z",
            "status": "On Schedule"
        },
        {
            "vessel_name": "MAVERICK SOHAR",
            "voyage_no": "SMNK-001W",
            "service_code": "SMNK",
            "pol": "Nhava Sheva (INNSA)",
            "pod": "Karachi (PKKHI)",
            "etd": "2026-11-29T10:00:00Z",
            "eta": "2026-12-01T08:00:00Z",
            "cutoff_date": "2026-11-28T22:00:00Z",
            "status": "On Schedule"
        },
        {
            "vessel_name": "MAVERICK SOHAR",
            "voyage_no": "SMNK-001W",
            "service_code": "SMNK",
            "pol": "Karachi (PKKHI)",
            "pod": "Sohar (OMSOH)",
            "etd": "2026-12-02T04:00:00Z",
            "eta": "2026-12-04T12:00:00Z",
            "cutoff_date": "2026-12-01T20:00:00Z",
            "status": "On Schedule"
        }
    ]

    for sch in schedules_data:
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
    print("Database seeding completed: 1 vessel, 1 office, 1 express service.")
