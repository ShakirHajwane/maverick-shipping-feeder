import json
from contextlib import asynccontextmanager
from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.database import Base, engine, get_db
from app.models import Vessel, FeederService, VoyageSchedule, RegionalAgent
from app.schemas import (
    VesselResponse,
    FeederServiceResponse,
    VoyageScheduleResponse,
    RegionalAgentResponse,
    StatsResponse
)
from app.seed import seed_database

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables
    Base.metadata.create_all(bind=engine)
    db = next(get_db())
    try:
        seed_database(db)
    finally:
        db.close()
    yield

app = FastAPI(
    title="Maritime Feeder & Container Shipping API",
    description="Production-grade API for Global Feeders, X-Press Feeders, and DP World maritime operations demo.",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for demo flexibility
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "status": "online",
        "service": "Maritime Feeder API",
        "docs": "/docs",
        "endpoints": [
            "/api/stats",
            "/api/services",
            "/api/schedules",
            "/api/vessels",
            "/api/vessels/{id}",
            "/api/agents"
        ]
    }

@app.get("/api/stats", response_model=StatsResponse)
def get_stats():
    return StatsResponse(
        port_calls="15.5K",
        teus_per_year="2.5M",
        vessels_count=66,
        ports_served=88,
        countries=54,
        feeder_services=32
    )

@app.get("/api/services", response_model=List[FeederServiceResponse])
def get_services(code: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(FeederService)
    if code:
        query = query.filter(FeederService.code.ilike(f"%{code.strip()}%"))
    services = query.all()
    results = []
    for s in services:
        res = FeederServiceResponse.model_validate(s)
        try:
            res.port_rotation = json.loads(s.port_rotation_json)
        except Exception:
            res.port_rotation = []
        results.append(res)
    return results

@app.get("/api/schedules", response_model=List[VoyageScheduleResponse])
def get_schedules(
    pol: Optional[str] = None,
    pod: Optional[str] = None,
    service_code: Optional[str] = None,
    vessel_name: Optional[str] = None,
    voyage_no: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(VoyageSchedule)
    if pol:
        query = query.filter(VoyageSchedule.pol.ilike(f"%{pol.strip()}%"))
    if pod:
        query = query.filter(VoyageSchedule.pod.ilike(f"%{pod.strip()}%"))
    if service_code:
        query = query.filter(VoyageSchedule.service_code.ilike(f"%{service_code.strip()}%"))
    if vessel_name:
        query = query.filter(VoyageSchedule.vessel_name.ilike(f"%{vessel_name.strip()}%"))
    if voyage_no:
        query = query.filter(VoyageSchedule.voyage_no.ilike(f"%{voyage_no.strip()}%"))
    return query.order_by(VoyageSchedule.etd.asc()).all()

@app.get("/api/vessels", response_model=List[VesselResponse])
def get_vessels(
    search: Optional[str] = None,
    flag: Optional[str] = None,
    capacity_tier: Optional[str] = Query("all", pattern="^(all|under_1500|1500_to_8000)$"),
    db: Session = Depends(get_db)
):
    query = db.query(Vessel)
    if search:
        s = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Vessel.name.ilike(s),
                Vessel.imo.ilike(s),
                Vessel.call_sign.ilike(s),
                Vessel.port_of_registry.ilike(s),
                Vessel.service_code.ilike(s)
            )
        )
    if flag and flag.lower() != "all":
        query = query.filter(Vessel.flag.ilike(f"%{flag.strip()}%"))

    if capacity_tier == "under_1500":
        query = query.filter(Vessel.nominal_cap_teu < 1500)
    elif capacity_tier == "1500_to_8000":
        query = query.filter(Vessel.nominal_cap_teu >= 1500, Vessel.nominal_cap_teu <= 8000)

    return query.order_by(Vessel.nominal_cap_teu.desc()).all()

@app.get("/api/vessels/{id}", response_model=VesselResponse)
def get_vessel_by_id(id: int, db: Session = Depends(get_db)):
    vessel = db.query(Vessel).filter(Vessel.id == id).first()
    if not vessel:
        raise HTTPException(status_code=404, detail="Vessel not found")
    return vessel

@app.get("/api/agents", response_model=List[RegionalAgentResponse])
def get_agents(country: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(RegionalAgent)
    if country and country.lower() != "all":
        query = query.filter(RegionalAgent.country.ilike(f"%{country.strip()}%"))
    return query.order_by(RegionalAgent.country.asc(), RegionalAgent.city.asc()).all()
