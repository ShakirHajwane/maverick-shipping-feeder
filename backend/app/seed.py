import json
from sqlalchemy.orm import Session
from app.models import Vessel, FeederService, VoyageSchedule, RegionalAgent

def seed_database(db: Session):
    # Check if already seeded
    if db.query(FeederService).first():
        return

    # 1. Feeder Services
    services_data = [
        {
            "code": "JSA",
            "name": "Jebel Ali - Red Sea Express",
            "description": "High-frequency feeder corridor linking Arabian Gulf hub Jebel Ali directly with key Red Sea ports.",
            "transit_days": 12,
            "frequency": "Weekly",
            "port_rotation_json": json.dumps([
                {"port_name": "Jebel Ali", "unlocode": "AEJEA", "lat": 25.021, "lng": 55.059, "day_of_week": "Sunday", "terminal": "Terminal 2"},
                {"port_name": "Jeddah Islamic Port", "unlocode": "SAJED", "lat": 21.485, "lng": 39.172, "day_of_week": "Thursday", "terminal": "Red Sea Gateway"},
                {"port_name": "Port Sudan", "unlocode": "SDPZU", "lat": 19.617, "lng": 37.216, "day_of_week": "Saturday", "terminal": "North Quay"},
                {"port_name": "Ain Sokhna", "unlocode": "EGSOK", "lat": 29.623, "lng": 32.339, "day_of_week": "Monday", "terminal": "DP World Sokhna"},
                {"port_name": "Aqaba", "unlocode": "JOAQB", "lat": 29.516, "lng": 35.006, "day_of_week": "Wednesday", "terminal": "ACT Terminal"}
            ])
        },
        {
            "code": "GALEX",
            "name": "Gulf Asia Liner Express",
            "description": "Flagship trans-ocean feeder and trunk connector linking UAE ports with Indian Subcontinent and Southeast Asian megahubs.",
            "transit_days": 21,
            "frequency": "Twice Weekly",
            "port_rotation_json": json.dumps([
                {"port_name": "Jebel Ali", "unlocode": "AEJEA", "lat": 25.021, "lng": 55.059, "day_of_week": "Monday", "terminal": "Terminal 1 & 3"},
                {"port_name": "Mundra", "unlocode": "INMUN", "lat": 22.842, "lng": 69.712, "day_of_week": "Thursday", "terminal": "MICT Mundra"},
                {"port_name": "Colombo", "unlocode": "LKCMB", "lat": 6.949, "lng": 79.843, "day_of_week": "Sunday", "terminal": "CICT Colombo"},
                {"port_name": "Port Klang", "unlocode": "MYPKG", "lat": 2.999, "lng": 101.392, "day_of_week": "Wednesday", "terminal": "Westports"},
                {"port_name": "Singapore", "unlocode": "SGSIN", "lat": 1.284, "lng": 103.851, "day_of_week": "Friday", "terminal": "PSA Pasir Panjang"}
            ])
        },
        {
            "code": "AES",
            "name": "Arabian Emirates - Suez Feeder",
            "description": "Rapid feeder connection linking the Gulf ports with the Suez Canal maritime corridor.",
            "transit_days": 14,
            "frequency": "Weekly",
            "port_rotation_json": json.dumps([
                {"port_name": "Jebel Ali", "unlocode": "AEJEA", "lat": 25.021, "lng": 55.059, "day_of_week": "Tuesday", "terminal": "Terminal 2"},
                {"port_name": "Khalifa Port", "unlocode": "AEKHL", "lat": 24.811, "lng": 54.654, "day_of_week": "Wednesday", "terminal": "CSP Abu Dhabi"},
                {"port_name": "King Abdulaziz Dammam", "unlocode": "SADMN", "lat": 26.434, "lng": 50.103, "day_of_week": "Friday", "terminal": "Saudi Global Ports"},
                {"port_name": "Sohar", "unlocode": "OMSOH", "lat": 24.498, "lng": 56.628, "day_of_week": "Sunday", "terminal": "OICT Terminal"},
                {"port_name": "Salalah", "unlocode": "OMSLL", "lat": 16.949, "lng": 54.004, "day_of_week": "Tuesday", "terminal": "APM Terminals"},
                {"port_name": "Ain Sokhna", "unlocode": "EGSOK", "lat": 29.623, "lng": 32.339, "day_of_week": "Saturday", "terminal": "DP World Sokhna"}
            ])
        },
        {
            "code": "CCG",
            "name": "Central Coast & Gulf Service",
            "description": "Intra-Gulf shuttle network serving key Northern and Central Arabian Gulf consumer markets.",
            "transit_days": 9,
            "frequency": "Twice Weekly",
            "port_rotation_json": json.dumps([
                {"port_name": "Jebel Ali", "unlocode": "AEJEA", "lat": 25.021, "lng": 55.059, "day_of_week": "Saturday", "terminal": "Terminal 2"},
                {"port_name": "Hamad Port", "unlocode": "QAQAT", "lat": 25.013, "lng": 51.613, "day_of_week": "Monday", "terminal": "QTerminals"},
                {"port_name": "Shuwaikh", "unlocode": "KWSWK", "lat": 29.356, "lng": 47.925, "day_of_week": "Wednesday", "terminal": "Kuwait Ports Authority"},
                {"port_name": "Khalifa Bin Salman Bahrain", "unlocode": "BHBAH", "lat": 26.184, "lng": 50.687, "day_of_week": "Friday", "terminal": "APM Terminals Bahrain"},
                {"port_name": "Umm Qasr", "unlocode": "IQUQR", "lat": 30.038, "lng": 47.930, "day_of_week": "Sunday", "terminal": "BGT Terminal"}
            ])
        },
        {
            "code": "IMS",
            "name": "India Middle East Shuttle",
            "description": "Dedicated express feeder linking West Coast India container hubs directly with Jebel Ali gateway.",
            "transit_days": 8,
            "frequency": "Weekly",
            "port_rotation_json": json.dumps([
                {"port_name": "Jebel Ali", "unlocode": "AEJEA", "lat": 25.021, "lng": 55.059, "day_of_week": "Sunday", "terminal": "Terminal 3"},
                {"port_name": "Mundra", "unlocode": "INMUN", "lat": 22.842, "lng": 69.712, "day_of_week": "Wednesday", "terminal": "AMCT Terminal"},
                {"port_name": "Nhava Sheva (JNPT)", "unlocode": "INNSA", "lat": 18.950, "lng": 72.951, "day_of_week": "Friday", "terminal": "GTI / NSIGT"},
                {"port_name": "Kandla (Deendayal)", "unlocode": "INIXY", "lat": 23.004, "lng": 70.219, "day_of_week": "Sunday", "terminal": "ICTT Terminal"}
            ])
        },
        {
            "code": "UAE-COASTAL",
            "name": "Emirates Coastal Feeder Hub",
            "description": "Green coastal feeder connector linking small regional UAE ports with the transshipment center at Jebel Ali.",
            "transit_days": 4,
            "frequency": "Tri-Weekly",
            "port_rotation_json": json.dumps([
                {"port_name": "Jebel Ali", "unlocode": "AEJEA", "lat": 25.021, "lng": 55.059, "day_of_week": "Monday", "terminal": "Terminal 1"},
                {"port_name": "Sharjah (Port Khalid)", "unlocode": "AESHJ", "lat": 25.361, "lng": 55.378, "day_of_week": "Tuesday", "terminal": "Gulftainer Sharjah"},
                {"port_name": "Ajman Port", "unlocode": "AEAJM", "lat": 25.421, "lng": 55.441, "day_of_week": "Wednesday", "terminal": "Ajman Port Authority"},
                {"port_name": "Ras Al Khaimah (Saqr)", "unlocode": "AERKT", "lat": 25.975, "lng": 56.052, "day_of_week": "Thursday", "terminal": "Saqr Port"},
                {"port_name": "Fujairah Port", "unlocode": "AEFJR", "lat": 25.176, "lng": 56.362, "day_of_week": "Friday", "terminal": "Fujairah Container Terminal"}
            ])
        }
    ]

    for s in services_data:
        db.add(FeederService(**s))
    db.commit()

    # 2. Vessels
    vessels_data = [
        # Under 1500 TEU
        {
            "name": "GFS RHINE",
            "imo": "9338278",
            "call_sign": "A8OK8",
            "flag": "Liberia",
            "built_year": 2008,
            "port_of_registry": "Monrovia",
            "nominal_cap_teu": 1118,
            "effective_cap_teu": 940,
            "reefer_plugs": 220,
            "gear": True,
            "bow_thruster": True,
            "grt": 9981.0,
            "nrt": 4890.0,
            "dwt": 13760.0,
            "loa": 147.8,
            "breadth": 23.4,
            "summer_draft": 8.5,
            "current_lat": 25.021,
            "current_lng": 55.059,
            "current_status": "Underway using Engine - 14.2 kn",
            "service_code": "JSA"
        },
        {
            "name": "ACACIA HAWK",
            "imo": "9471185",
            "call_sign": "9V2931",
            "flag": "Singapore",
            "built_year": 2012,
            "port_of_registry": "Singapore",
            "nominal_cap_teu": 990,
            "effective_cap_teu": 820,
            "reefer_plugs": 150,
            "gear": False,
            "bow_thruster": True,
            "grt": 8900.0,
            "nrt": 4200.0,
            "dwt": 11850.0,
            "loa": 139.5,
            "breadth": 22.6,
            "summer_draft": 7.9,
            "current_lat": 22.842,
            "current_lng": 69.712,
            "current_status": "At Anchor - Waiting Berth",
            "service_code": "IMS"
        },
        {
            "name": "CALLIOPE",
            "imo": "9623817",
            "call_sign": "5BEA4",
            "flag": "Cyprus",
            "built_year": 2015,
            "port_of_registry": "Limassol",
            "nominal_cap_teu": 1440,
            "effective_cap_teu": 1210,
            "reefer_plugs": 280,
            "gear": True,
            "bow_thruster": True,
            "grt": 12500.0,
            "nrt": 6100.0,
            "dwt": 17200.0,
            "loa": 161.2,
            "breadth": 25.0,
            "summer_draft": 9.1,
            "current_lat": 27.810,
            "current_lng": 34.320,
            "current_status": "Underway using Engine - 15.6 kn",
            "service_code": "AES"
        },
        {
            "name": "GFS RHEA",
            "imo": "9512398",
            "call_sign": "3FBM8",
            "flag": "Panama",
            "built_year": 2011,
            "port_of_registry": "Panama City",
            "nominal_cap_teu": 1200,
            "effective_cap_teu": 1010,
            "reefer_plugs": 200,
            "gear": True,
            "bow_thruster": True,
            "grt": 10450.0,
            "nrt": 5120.0,
            "dwt": 14300.0,
            "loa": 152.0,
            "breadth": 23.8,
            "summer_draft": 8.7,
            "current_lat": 29.356,
            "current_lng": 47.925,
            "current_status": "Moored at Berth 4",
            "service_code": "CCG"
        },
        {
            "name": "DP WORLD MARJAN",
            "imo": "9811402",
            "call_sign": "A6E21",
            "flag": "UAE",
            "built_year": 2018,
            "port_of_registry": "Dubai",
            "nominal_cap_teu": 850,
            "effective_cap_teu": 720,
            "reefer_plugs": 120,
            "gear": False,
            "bow_thruster": True,
            "grt": 7650.0,
            "nrt": 3580.0,
            "dwt": 9950.0,
            "loa": 128.4,
            "breadth": 20.8,
            "summer_draft": 7.2,
            "current_lat": 25.176,
            "current_lng": 56.362,
            "current_status": "Underway using Engine - 12.8 kn",
            "service_code": "UAE-COASTAL"
        },
        {
            "name": "JEVAN STAR",
            "imo": "9741289",
            "call_sign": "9HA38",
            "flag": "Malta",
            "built_year": 2016,
            "port_of_registry": "Valletta",
            "nominal_cap_teu": 720,
            "effective_cap_teu": 610,
            "reefer_plugs": 90,
            "gear": True,
            "bow_thruster": False,
            "grt": 6800.0,
            "nrt": 3100.0,
            "dwt": 8900.0,
            "loa": 122.0,
            "breadth": 19.8,
            "summer_draft": 6.8,
            "current_lat": 25.361,
            "current_lng": 55.378,
            "current_status": "Underway using Engine - 11.5 kn",
            "service_code": "UAE-COASTAL"
        },
        # 1500 to 8000 TEU
        {
            "name": "GFS ROJA",
            "imo": "9687422",
            "call_sign": "D5LK9",
            "flag": "Liberia",
            "built_year": 2014,
            "port_of_registry": "Monrovia",
            "nominal_cap_teu": 2824,
            "effective_cap_teu": 2380,
            "reefer_plugs": 450,
            "gear": False,
            "bow_thruster": True,
            "grt": 29800.0,
            "nrt": 14200.0,
            "dwt": 38200.0,
            "loa": 212.0,
            "breadth": 32.2,
            "summer_draft": 11.5,
            "current_lat": 21.485,
            "current_lng": 39.172,
            "current_status": "Underway using Engine - 17.1 kn",
            "service_code": "JSA"
        },
        {
            "name": "X-PRESS CAPELLA",
            "imo": "9845123",
            "call_sign": "9V6482",
            "flag": "Singapore",
            "built_year": 2020,
            "port_of_registry": "Singapore",
            "nominal_cap_teu": 4250,
            "effective_cap_teu": 3600,
            "reefer_plugs": 600,
            "gear": False,
            "bow_thruster": True,
            "grt": 41500.0,
            "nrt": 21000.0,
            "dwt": 52000.0,
            "loa": 255.0,
            "breadth": 37.3,
            "summer_draft": 12.8,
            "current_lat": 1.284,
            "current_lng": 103.851,
            "current_status": "Underway using Engine - 18.4 kn",
            "service_code": "GALEX"
        },
        {
            "name": "GFS GEMINI",
            "imo": "9789012",
            "call_sign": "3EWX5",
            "flag": "Panama",
            "built_year": 2017,
            "port_of_registry": "Panama City",
            "nominal_cap_teu": 3400,
            "effective_cap_teu": 2890,
            "reefer_plugs": 500,
            "gear": False,
            "bow_thruster": True,
            "grt": 35600.0,
            "nrt": 17800.0,
            "dwt": 44500.0,
            "loa": 228.0,
            "breadth": 33.5,
            "summer_draft": 11.8,
            "current_lat": 6.949,
            "current_lng": 79.843,
            "current_status": "At Anchor - Outer Roads",
            "service_code": "GALEX"
        },
        {
            "name": "X-PRESS SHANNON",
            "imo": "9798432",
            "call_sign": "9V7821",
            "flag": "Singapore",
            "built_year": 2019,
            "port_of_registry": "Singapore",
            "nominal_cap_teu": 2742,
            "effective_cap_teu": 2310,
            "reefer_plugs": 420,
            "gear": False,
            "bow_thruster": True,
            "grt": 28900.0,
            "nrt": 13900.0,
            "dwt": 37100.0,
            "loa": 208.5,
            "breadth": 32.2,
            "summer_draft": 11.2,
            "current_lat": 18.950,
            "current_lng": 72.951,
            "current_status": "Moored - Cargo Operations",
            "service_code": "IMS"
        },
        {
            "name": "AL FARAHIDI",
            "imo": "9897120",
            "call_sign": "A6A99",
            "flag": "UAE",
            "built_year": 2021,
            "port_of_registry": "Dubai",
            "nominal_cap_teu": 6500,
            "effective_cap_teu": 5600,
            "reefer_plugs": 900,
            "gear": False,
            "bow_thruster": True,
            "grt": 68500.0,
            "nrt": 35000.0,
            "dwt": 81000.0,
            "loa": 299.9,
            "breadth": 42.8,
            "summer_draft": 14.5,
            "current_lat": 25.021,
            "current_lng": 55.059,
            "current_status": "Discharging at Terminal 2",
            "service_code": "GALEX"
        },
        {
            "name": "EMIRATES OASIS",
            "imo": "9831920",
            "call_sign": "9HA51",
            "flag": "Malta",
            "built_year": 2019,
            "port_of_registry": "Valletta",
            "nominal_cap_teu": 5100,
            "effective_cap_teu": 4350,
            "reefer_plugs": 750,
            "gear": False,
            "bow_thruster": True,
            "grt": 54000.0,
            "nrt": 28000.0,
            "dwt": 65000.0,
            "loa": 280.0,
            "breadth": 39.8,
            "summer_draft": 13.5,
            "current_lat": 29.623,
            "current_lng": 32.339,
            "current_status": "Underway using Engine - 16.0 kn",
            "service_code": "AES"
        }
    ]

    for v in vessels_data:
        db.add(Vessel(**v))
    db.commit()

    # 3. Voyage Schedules
    schedules_data = [
        # JSA Schedules
        {
            "vessel_name": "GFS RHINE",
            "voyage_no": "2611E",
            "service_code": "JSA",
            "pol": "Jebel Ali (AEJEA)",
            "pod": "Jeddah (SAJED)",
            "etd": "2026-11-15T08:00:00Z",
            "eta": "2026-11-19T14:00:00Z",
            "cutoff_date": "2026-11-14T18:00:00Z",
            "status": "On Schedule"
        },
        {
            "vessel_name": "GFS RHINE",
            "voyage_no": "2611E",
            "service_code": "JSA",
            "pol": "Jebel Ali (AEJEA)",
            "pod": "Sokhna (EGSOK)",
            "etd": "2026-11-15T08:00:00Z",
            "eta": "2026-11-23T10:00:00Z",
            "cutoff_date": "2026-11-14T18:00:00Z",
            "status": "On Schedule"
        },
        {
            "vessel_name": "GFS ROJA",
            "voyage_no": "2612E",
            "service_code": "JSA",
            "pol": "Jebel Ali (AEJEA)",
            "pod": "Port Sudan (SDPZU)",
            "etd": "2026-11-18T10:00:00Z",
            "eta": "2026-11-23T20:00:00Z",
            "cutoff_date": "2026-11-17T22:00:00Z",
            "status": "In Transit"
        },
        {
            "vessel_name": "GFS ROJA",
            "voyage_no": "2612W",
            "service_code": "JSA",
            "pol": "Jeddah (SAJED)",
            "pod": "Sokhna (EGSOK)",
            "etd": "2026-11-20T16:00:00Z",
            "eta": "2026-11-22T06:00:00Z",
            "cutoff_date": "2026-11-20T04:00:00Z",
            "status": "On Schedule"
        },
        # GALEX Schedules
        {
            "vessel_name": "X-PRESS CAPELLA",
            "voyage_no": "2615E",
            "service_code": "GALEX",
            "pol": "Jebel Ali (AEJEA)",
            "pod": "Singapore (SGSIN)",
            "etd": "2026-11-14T12:00:00Z",
            "eta": "2026-11-24T18:00:00Z",
            "cutoff_date": "2026-11-13T20:00:00Z",
            "status": "On Schedule"
        },
        {
            "vessel_name": "X-PRESS CAPELLA",
            "voyage_no": "2615E",
            "service_code": "GALEX",
            "pol": "Jebel Ali (AEJEA)",
            "pod": "Mundra (INMUN)",
            "etd": "2026-11-14T12:00:00Z",
            "eta": "2026-11-17T06:00:00Z",
            "cutoff_date": "2026-11-13T20:00:00Z",
            "status": "On Schedule"
        },
        {
            "vessel_name": "GFS GEMINI",
            "voyage_no": "2618E",
            "service_code": "GALEX",
            "pol": "Mundra (INMUN)",
            "pod": "Colombo (LKCMB)",
            "etd": "2026-11-16T15:00:00Z",
            "eta": "2026-11-19T22:00:00Z",
            "cutoff_date": "2026-11-15T23:00:00Z",
            "status": "At Berth"
        },
        {
            "vessel_name": "AL FARAHIDI",
            "voyage_no": "2620E",
            "service_code": "GALEX",
            "pol": "Jebel Ali (AEJEA)",
            "pod": "Colombo (LKCMB)",
            "etd": "2026-11-19T06:00:00Z",
            "eta": "2026-11-25T11:00:00Z",
            "cutoff_date": "2026-11-18T12:00:00Z",
            "status": "On Schedule"
        },
        {
            "vessel_name": "X-PRESS CAPELLA",
            "voyage_no": "2616W",
            "service_code": "GALEX",
            "pol": "Singapore (SGSIN)",
            "pod": "Jebel Ali (AEJEA)",
            "etd": "2026-11-26T20:00:00Z",
            "eta": "2026-12-05T08:00:00Z",
            "cutoff_date": "2026-11-26T04:00:00Z",
            "status": "On Schedule"
        },
        # AES Schedules
        {
            "vessel_name": "CALLIOPE",
            "voyage_no": "2622W",
            "service_code": "AES",
            "pol": "Jebel Ali (AEJEA)",
            "pod": "Sokhna (EGSOK)",
            "etd": "2026-11-17T09:00:00Z",
            "eta": "2026-11-25T16:00:00Z",
            "cutoff_date": "2026-11-16T18:00:00Z",
            "status": "In Transit"
        },
        {
            "vessel_name": "EMIRATES OASIS",
            "voyage_no": "2625W",
            "service_code": "AES",
            "pol": "Dammam (SADMN)",
            "pod": "Sokhna (EGSOK)",
            "etd": "2026-11-21T14:00:00Z",
            "eta": "2026-11-28T09:00:00Z",
            "cutoff_date": "2026-11-20T20:00:00Z",
            "status": "On Schedule"
        },
        # CCG Schedules
        {
            "vessel_name": "GFS RHEA",
            "voyage_no": "2628N",
            "service_code": "CCG",
            "pol": "Jebel Ali (AEJEA)",
            "pod": "Shuwaikh (KWSWK)",
            "etd": "2026-11-15T18:00:00Z",
            "eta": "2026-11-18T10:00:00Z",
            "cutoff_date": "2026-11-15T06:00:00Z",
            "status": "On Schedule"
        },
        {
            "vessel_name": "GFS RHEA",
            "voyage_no": "2628N",
            "service_code": "CCG",
            "pol": "Jebel Ali (AEJEA)",
            "pod": "Hamad Port (QAQAT)",
            "etd": "2026-11-15T18:00:00Z",
            "eta": "2026-11-17T04:00:00Z",
            "cutoff_date": "2026-11-15T06:00:00Z",
            "status": "On Schedule"
        },
        {
            "vessel_name": "GFS RHEA",
            "voyage_no": "2629S",
            "service_code": "CCG",
            "pol": "Shuwaikh (KWSWK)",
            "pod": "Jebel Ali (AEJEA)",
            "etd": "2026-11-19T14:00:00Z",
            "eta": "2026-11-22T08:00:00Z",
            "cutoff_date": "2026-11-19T02:00:00Z",
            "status": "On Schedule"
        },
        # IMS Schedules
        {
            "vessel_name": "ACACIA HAWK",
            "voyage_no": "2631E",
            "service_code": "IMS",
            "pol": "Jebel Ali (AEJEA)",
            "pod": "Mundra (INMUN)",
            "etd": "2026-11-16T04:00:00Z",
            "eta": "2026-11-19T12:00:00Z",
            "cutoff_date": "2026-11-15T14:00:00Z",
            "status": "On Schedule"
        },
        {
            "vessel_name": "X-PRESS SHANNON",
            "voyage_no": "2634E",
            "service_code": "IMS",
            "pol": "Jebel Ali (AEJEA)",
            "pod": "Nhava Sheva (INNSA)",
            "etd": "2026-11-17T11:00:00Z",
            "eta": "2026-11-20T21:00:00Z",
            "cutoff_date": "2026-11-16T22:00:00Z",
            "status": "At Berth"
        },
        # UAE-COASTAL Schedules
        {
            "vessel_name": "DP WORLD MARJAN",
            "voyage_no": "2640C",
            "service_code": "UAE-COASTAL",
            "pol": "Jebel Ali (AEJEA)",
            "pod": "Fujairah (AEFJR)",
            "etd": "2026-11-14T06:00:00Z",
            "eta": "2026-11-15T10:00:00Z",
            "cutoff_date": "2026-11-13T20:00:00Z",
            "status": "In Transit"
        },
        {
            "vessel_name": "JEVAN STAR",
            "voyage_no": "2642C",
            "service_code": "UAE-COASTAL",
            "pol": "Jebel Ali (AEJEA)",
            "pod": "Sharjah (AESHJ)",
            "etd": "2026-11-15T10:00:00Z",
            "eta": "2026-11-15T18:00:00Z",
            "cutoff_date": "2026-11-15T04:00:00Z",
            "status": "On Schedule"
        }
    ]

    for sch in schedules_data:
        db.add(VoyageSchedule(**sch))
    db.commit()

    # 4. Regional Agents
    agents_data = [
        {
            "country": "UAE",
            "city": "Dubai",
            "office_name": "Global Feeder & DP World Shipping Hub HQ",
            "address": "Level 14, Tower 3, JAFZA One, Jebel Ali Free Zone, Dubai, UAE",
            "phone": "+971 4 210 51 05",
            "email": "commercial.uae@globalfeeders.com",
            "lat": 24.996,
            "lng": 55.086
        },
        {
            "country": "UAE",
            "city": "Abu Dhabi",
            "office_name": "Abu Dhabi Regional Operations Office",
            "address": "Al Khatem Tower, ADGM Square, Al Maryah Island, Abu Dhabi, UAE",
            "phone": "+971 2 443 89 20",
            "email": "operations.auh@globalfeeders.com",
            "lat": 24.498,
            "lng": 54.389
        },
        {
            "country": "Saudi Arabia",
            "city": "Jeddah",
            "office_name": "Red Sea Regional Maritime Agency",
            "address": "Floor 9, Al Andalus Maritime Tower, King Abdulaziz Road, Jeddah, KSA",
            "phone": "+966 12 654 33 11",
            "email": "agency.jeddah@globalfeeders.com",
            "lat": 21.543,
            "lng": 39.172
        },
        {
            "country": "Saudi Arabia",
            "city": "Dammam",
            "office_name": "Eastern Province Shipping Agency",
            "address": "Port Gate 1 Complex, King Abdulaziz Port, Dammam, KSA",
            "phone": "+966 13 835 12 00",
            "email": "agency.dammam@globalfeeders.com",
            "lat": 26.434,
            "lng": 50.103
        },
        {
            "country": "India",
            "city": "Mumbai",
            "office_name": "India Country Management & Liner Agency",
            "address": "Express Towers, 18th Floor, Nariman Point, Mumbai 400021, India",
            "phone": "+91 22 6633 4400",
            "email": "commercial.in@globalfeeders.com",
            "lat": 18.928,
            "lng": 72.822
        },
        {
            "country": "India",
            "city": "Mundra",
            "office_name": "Gujarat Port Operations Office",
            "address": "Port User Building, 2nd Floor, Adani Port SEZ, Mundra, Kutch, Gujarat 370421",
            "phone": "+91 2838 255 100",
            "email": "mundra.ops@globalfeeders.com",
            "lat": 22.842,
            "lng": 69.712
        },
        {
            "country": "Singapore",
            "city": "Singapore",
            "office_name": "Southeast Asia Regional HQ & Transshipment Desk",
            "address": "12 Marina Boulevard, #28-02, Marina Bay Financial Centre Tower 3, Singapore 018982",
            "phone": "+65 6832 9900",
            "email": "sea.hub@globalfeeders.com",
            "lat": 1.279,
            "lng": 103.854
        },
        {
            "country": "Egypt",
            "city": "Cairo",
            "office_name": "Egypt & North Africa Directorate",
            "address": "Plot 42, North 90th Street, 5th Settlement, New Cairo, Egypt",
            "phone": "+20 2 2813 6500",
            "email": "cairo.desk@globalfeeders.com",
            "lat": 30.029,
            "lng": 31.470
        },
        {
            "country": "Egypt",
            "city": "Ain Sokhna",
            "office_name": "Sokhna Port Liner & Feeder Office",
            "address": "Port Management Building, Zone 1, DP World Sokhna, Suez, Egypt",
            "phone": "+20 62 371 0800",
            "email": "sokhna.ops@globalfeeders.com",
            "lat": 29.623,
            "lng": 32.339
        },
        {
            "country": "China",
            "city": "Shanghai",
            "office_name": "Far East Commercial Representation",
            "address": "Floor 31, Shanghai World Financial Center, 100 Century Ave, Pudong, Shanghai, China",
            "phone": "+86 21 6877 8820",
            "email": "fareast.sales@globalfeeders.com",
            "lat": 31.236,
            "lng": 121.503
        },
        {
            "country": "China",
            "city": "Shenzhen",
            "office_name": "South China Feeder Operations Office",
            "address": "Shekou Port Service Center, Nanshan District, Shenzhen, Guangdong, China",
            "phone": "+86 755 2688 1200",
            "email": "shenzhen.desk@globalfeeders.com",
            "lat": 22.483,
            "lng": 113.916
        }
    ]

    for ag in agents_data:
        db.add(RegionalAgent(**ag))
    db.commit()
    print("Database seeding completed successfully.")
