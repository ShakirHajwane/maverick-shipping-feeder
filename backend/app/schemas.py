from typing import List, Optional, Any
from pydantic import BaseModel, Field

class VesselBase(BaseModel):
    name: str
    imo: str
    call_sign: str
    flag: str
    built_year: int
    port_of_registry: str
    nominal_cap_teu: int
    effective_cap_teu: int
    reefer_plugs: int
    gear: bool
    bow_thruster: bool
    grt: float
    nrt: float
    dwt: float
    loa: float
    breadth: float
    summer_draft: float
    current_lat: float
    current_lng: float
    current_status: str
    service_code: Optional[str] = None

class VesselResponse(VesselBase):
    id: int

    class Config:
        from_attributes = True

class PortRotationItem(BaseModel):
    port_name: str
    unlocode: str
    lat: float
    lng: float
    day_of_week: Optional[str] = None
    terminal: Optional[str] = None

class FeederServiceBase(BaseModel):
    code: str
    name: str
    description: Optional[str] = None
    transit_days: int
    frequency: str
    port_rotation_json: str

class FeederServiceResponse(FeederServiceBase):
    id: int
    port_rotation: Optional[List[PortRotationItem]] = None

    class Config:
        from_attributes = True

class VoyageScheduleBase(BaseModel):
    vessel_name: str
    voyage_no: str
    service_code: str
    pol: str
    pod: str
    etd: str
    eta: str
    cutoff_date: str
    status: str

class VoyageScheduleResponse(VoyageScheduleBase):
    id: int

    class Config:
        from_attributes = True

class RegionalAgentBase(BaseModel):
    country: str
    city: str
    office_name: str
    address: str
    phone: str
    email: str
    lat: float
    lng: float

class RegionalAgentResponse(RegionalAgentBase):
    id: int

    class Config:
        from_attributes = True

class StatsResponse(BaseModel):
    port_calls: str = "15.5K"
    teus_per_year: str = "2.5M"
    vessels_count: int = 66
    ports_served: int = 88
    countries: int = 54
    feeder_services: int = 32
