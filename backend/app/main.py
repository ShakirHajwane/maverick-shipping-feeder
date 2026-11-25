import json
from contextlib import asynccontextmanager
from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException, Query, APIRouter, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import or_, text

from app.config import settings
from app.database import Base, engine, get_db
from app.models import Vessel, FeederService, VoyageSchedule, RegionalAgent
from app.schemas import (
    VesselResponse,
    PortRotationItem,
    FeederServiceResponse,
    VoyageScheduleResponse,
    RegionalAgentResponse,
    StatsResponse,
    HealthResponse,
)
from app.seed import seed_database


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables and seed SMNK data automatically
    Base.metadata.create_all(bind=engine)
    db = next(get_db())
    try:
        seed_database(db, force=True)
    finally:
        db.close()
    yield


app = FastAPI(
    title=settings.APP_NAME,
    description="Production API for Maverick Shipping LLC SMNK regional container feeder operations.",
    version="1.1.0",
    lifespan=lifespan,
)


@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers.setdefault("X-Content-Type-Options", "nosniff")
    response.headers.setdefault("X-Frame-Options", "DENY")
    response.headers.setdefault("Referrer-Policy", "strict-origin-when-cross-origin")
    response.headers.setdefault("Permissions-Policy", "camera=(), geolocation=(), microphone=()")
    if not request.url.path.startswith(("/docs", "/redoc", "/openapi.json")):
        response.headers.setdefault(
            "Content-Security-Policy",
            "default-src 'none'; frame-ancestors 'none'; base-uri 'none'",
        )
    return response


# Restrict CORS explicitly without combining wildcard origin and credentials
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=False,
    allow_methods=["GET", "HEAD", "OPTIONS"],
    allow_headers=["Content-Type", "Accept"],
)

api_router = APIRouter()


@api_router.get("/health", response_model=HealthResponse, tags=["Health"])
def health_check(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
    except Exception as exc:
        raise HTTPException(status_code=503, detail="Database health check failed") from exc
    return HealthResponse(
        status="healthy",
        service="maritime-feeder-api",
        database="connected",
        corridor="SMNK",
    )


@api_router.get("/stats", response_model=StatsResponse)
def get_stats(db: Session = Depends(get_db)):
    services = db.query(FeederService).all()
    vessels_count = db.query(Vessel).count()
    distinct_ports: set[str] = set()
    distinct_countries: set[str] = set()
    for s in services:
        try:
            for item in json.loads(s.port_rotation_json):
                code = str(item.get("unlocode", "")).strip()
                if code:
                    distinct_ports.add(code)
                    distinct_countries.add(code[:2])
        except Exception:
            pass

    return StatsResponse(
        port_calls="1.2K",
        teus_per_year="96K",
        vessels_count=vessels_count or 1,
        ports_served=len(distinct_ports) or 4,
        countries=len(distinct_countries) or 3,
        feeder_services=len(services) or 1,
    )


@api_router.get("/services", response_model=List[FeederServiceResponse])
def get_services(code: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(FeederService)
    if code:
        query = query.filter(FeederService.code.ilike(f"%{code.strip()}%"))
    services = query.all()
    results = []
    for s in services:
        res = FeederServiceResponse.model_validate(s)
        try:
            raw_rotation = json.loads(s.port_rotation_json)
            res.port_rotation = [PortRotationItem.model_validate(item) for item in raw_rotation]
        except Exception:
            res.port_rotation = []
        results.append(res)
    return results

@api_router.get("/schedules", response_model=List[VoyageScheduleResponse])
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

@api_router.get("/vessels", response_model=List[VesselResponse])
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

@api_router.get("/vessels/{id}", response_model=VesselResponse)
def get_vessel_by_id(id: int, db: Session = Depends(get_db)):
    vessel = db.query(Vessel).filter(Vessel.id == id).first()
    if not vessel:
        raise HTTPException(status_code=404, detail="Vessel not found")
    return vessel

@api_router.get("/agents", response_model=List[RegionalAgentResponse])
def get_agents(country: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(RegionalAgent)
    if country and country.lower() != "all":
        query = query.filter(RegionalAgent.country.ilike(f"%{country.strip()}%"))
    return query.order_by(RegionalAgent.country.asc(), RegionalAgent.city.asc()).all()

# Mount router under both /api and root / for seamless routing compatibility across all hosting providers
app.include_router(api_router, prefix="/api")
app.include_router(api_router, prefix="")

@app.get("/")
def root():
    return {
        "status": "online",
        "service": "Maritime Feeder API",
        "docs": "/docs",
        "endpoints": [
            "/api/health",
            "/api/stats",
            "/api/services",
            "/api/schedules",
            "/api/vessels",
            "/api/vessels/{id}",
            "/api/agents"
        ]
    }
