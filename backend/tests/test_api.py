import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert "/api/stats" in data["endpoints"]

def test_get_stats():
    response = client.get("/api/stats")
    assert response.status_code == 200
    data = response.json()
    assert data["vessels_count"] == 1
    assert data["feeder_services"] == 1
    assert data["ports_served"] == 4

def test_get_vessels():
    response = client.get("/api/vessels")
    assert response.status_code == 200
    vessels = response.json()
    assert len(vessels) == 1
    vessel = vessels[0]
    assert vessel["name"] == "MAVERICK SOHAR"
    assert vessel["imo"] == "9418298"
    assert vessel["nominal_cap_teu"] == 1850
    assert vessel["bow_thruster"] is True

def test_get_agents():
    response = client.get("/api/agents")
    assert response.status_code == 200
    agents = response.json()
    assert len(agents) == 1
    agent = agents[0]
    assert "Maverick Shipping Hub HQ" in agent["office_name"]
    assert agent["country"] == "UAE"

def test_get_services():
    response = client.get("/api/services")
    assert response.status_code == 200
    services = response.json()
    assert len(services) == 1
    service = services[0]
    assert service["code"] == "SMNK"
    assert len(service["port_rotation"]) == 5
    port_names = [p["port_name"] for p in service["port_rotation"]]
    assert port_names[0] == "Sohar"
    assert port_names[1] == "Mundra"
    assert "Nhava Sheva" in port_names[2]
    assert port_names[3] == "Karachi"
    assert port_names[4] == "Sohar"

def test_get_schedules():
    response = client.get("/api/schedules")
    assert response.status_code == 200
    schedules = response.json()
    assert len(schedules) >= 1
    for s in schedules:
        assert s["vessel_name"] == "MAVERICK SOHAR"
        assert s["service_code"] == "SMNK"
