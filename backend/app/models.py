from sqlalchemy import Column, Integer, String, Float, Boolean, Text
from app.database import Base

class Vessel(Base):
    __tablename__ = "vessels"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), index=True, nullable=False)
    imo = Column(String(20), unique=True, index=True, nullable=False)
    call_sign = Column(String(20), nullable=False)
    flag = Column(String(50), nullable=False, index=True)
    built_year = Column(Integer, nullable=False)
    port_of_registry = Column(String(100), nullable=False)
    nominal_cap_teu = Column(Integer, nullable=False, index=True)
    effective_cap_teu = Column(Integer, nullable=False)
    reefer_plugs = Column(Integer, default=0)
    gear = Column(Boolean, default=False)
    bow_thruster = Column(Boolean, default=True)
    grt = Column(Float, nullable=False)
    nrt = Column(Float, nullable=False)
    dwt = Column(Float, nullable=False)
    loa = Column(Float, nullable=False)  # Length Overall in meters
    breadth = Column(Float, nullable=False)  # Beam in meters
    summer_draft = Column(Float, nullable=False)  # Draft in meters
    current_lat = Column(Float, nullable=False)
    current_lng = Column(Float, nullable=False)
    current_status = Column(String(100), nullable=False)
    service_code = Column(String(50), index=True, nullable=True)

class FeederService(Base):
    __tablename__ = "feeder_services"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(30), unique=True, index=True, nullable=False)
    name = Column(String(150), nullable=False)
    description = Column(Text, nullable=True)
    transit_days = Column(Integer, nullable=False)
    frequency = Column(String(50), default="Weekly")
    port_rotation_json = Column(Text, nullable=False)  # JSON-encoded array of port objects

class VoyageSchedule(Base):
    __tablename__ = "voyage_schedules"

    id = Column(Integer, primary_key=True, index=True)
    vessel_name = Column(String(100), index=True, nullable=False)
    voyage_no = Column(String(50), index=True, nullable=False)
    service_code = Column(String(50), index=True, nullable=False)
    pol = Column(String(100), index=True, nullable=False)  # Port of Loading
    pod = Column(String(100), index=True, nullable=False)  # Port of Discharge
    etd = Column(String(50), nullable=False)  # Estimated Time of Departure
    eta = Column(String(50), nullable=False)  # Estimated Time of Arrival
    cutoff_date = Column(String(50), nullable=False)  # Cargo Cutoff Date
    status = Column(String(50), default="On Schedule")  # "On Schedule", "At Berth", "In Transit"

class RegionalAgent(Base):
    __tablename__ = "regional_agents"

    id = Column(Integer, primary_key=True, index=True)
    country = Column(String(60), index=True, nullable=False)
    city = Column(String(60), nullable=False)
    office_name = Column(String(120), nullable=False)
    address = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=False)
    email = Column(String(100), nullable=False)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
