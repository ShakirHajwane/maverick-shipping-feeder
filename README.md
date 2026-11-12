# Global Feeders & DP World Shipping Alliance Demo

> **Production-Grade Maritime Feeder & Container Shipping Web Application** inspired by [Global Feeders](https://globalfeeders.com), [X-Press Feeders](https://x-pressfeeders.com/vessels), and [DP World](https://dpworld.com).

Connecting primary deep-sea container terminals across the Arabian Gulf, Red Sea, Indian Subcontinent, and Southeast Asia with high-frequency feeder reliability, real-time AIS vessel telemetry, point-to-point voyage scheduling, and an interactive Leaflet trade route navigator.

---

## 🌟 Architecture Overview

This monorepo is engineered with modern full-stack performance and 100% free hosting in mind:

- **Backend (`backend/`)**:
  - **Python 3.11+**, **FastAPI**, **SQLAlchemy**, and **Pydantic v2**.
  - Built-in SQLite (`maritime_demo.db`) auto-seeded on first launch with authentic Middle East, Red Sea, and Asian feeder shipping data.
  - Automatic `DATABASE_URL` detection supporting Neon/Supabase PostgreSQL for zero-code database switching.
  - CORS-enabled REST endpoints for stats, services, schedules, fleet registers, and regional offices.
- **Frontend (`frontend/`)**:
  - **Angular 18+** with Standalone Components, **Angular Signals** for reactive state management, and Reactive Forms.
  - **Tailwind CSS** with a custom Maritime Corporate Palette:
    - *Deep Navy* (`#0A192F`), *Ocean Teal* (`#00B4D8`), *Industrial Amber* (`#F59E0B`), and *Crisp White* (`#F8FAFC`).
  - **Leaflet.js** using CartoDB Voyager tiles (`https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png`) requiring **zero API keys**.
  - **RTL / Arabic Mode Toggle**: Switch between English and Arabic layouts with one click.
- **Deployment & Hosting**:
  - `backend/render.yaml` + `backend/Procfile` for **Render Free Tier**.
  - `frontend/vercel.json` for **Vercel Free Tier**.

---

## 🚀 5-Minute Free Hosting Deployment Guide

### 1. Deploy the Backend on Render (100% Free)
1. Fork or push this repository to GitHub.
2. Sign in to [Render.com](https://render.com).
3. Click **New +** > **Blueprint**.
4. Select your GitHub repository. Render will automatically detect `backend/render.yaml` with the following configuration:
   - **Environment**: Python
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Plan**: Free Tier
5. Click **Apply**. Within ~2 minutes, your FastAPI backend will be live at:
   `https://<your-render-app-name>.onrender.com`
   *(Test `https://<your-render-app-name>.onrender.com/api/stats` to verify)*

### 2. Deploy the Frontend on Vercel (100% Free)
1. Sign in to [Vercel.com](https://vercel.com).
2. Click **Add New...** > **Project** and import your GitHub repository.
3. Configure the project:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Angular
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist/frontend/browser`
4. Set the environment variable:
   - `NG_APP_API_URL` or edit `frontend/src/environments/environment.prod.ts` with your live Render backend URL:
     ```typescript
     export const environment = {
       production: true,
       apiUrl: 'https://<your-render-app-name>.onrender.com/api'
     };
     ```
5. Click **Deploy**. Vercel will build and host your Angular application globally on their edge network with automatic SSL.

---

## 💻 Local Development Setup

### Prerequisites
- Python 3.11+
- Node.js 18+ (Node 20 / 22 LTS recommended)
- npm 9+

### 1. Start the FastAPI Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
- API Root: `http://localhost:8000`
- Swagger Documentation: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### 2. Start the Angular Frontend
```bash
cd frontend
npm install
npm run start
```
- Open `http://localhost:4200` in your web browser.

---

## 🚢 Core Features & Components

### 1. 3-Tab Hero Action Engine
- **Find a Service**: Inspect feeder corridors (`JSA`, `GALEX`, `AES`, `CCG`, `IMS`, `UAE-COASTAL`) with transit times, frequency, and port sequence timelines. One-click route rendering onto the map.
- **Find Schedule**: Point-to-point voyage locator (`POL` -> `POD`) displaying vessel names, voyage numbers, ETD, ETA, transit times, cut-off dates, and live status badges.
- **Vessel Tracking**: Live search by vessel name, IMO, or voyage number with instant telemetry metrics and automatic map centering.

### 2. Interactive Leaflet Geonavigator
- Free CartoDB Voyager tiles with zero API keys required.
- High-visibility glowing polyline trade corridors.
- Custom SVG port markers and live vessel icons with heading and status telemetry.
- Seamless camera flight to selected ports or vessels (`flyTo`).

### 3. Comprehensive 16-Point Vessel Specification Modal
Each vessel card displays the 6 core metrics (`Flag`, `Nominal Cap`, `GRT`, `NRT`, `DWT`, `LOA`). Clicking **"More Info"** reveals the complete 16-point technical specification:
1. Vessel Name
2. IMO Number
3. Call Sign
4. Flag State
5. Built Year
6. Port of Registry
7. Nominal Capacity (TEU)
8. Effective Capacity (14t Homogenous TEU)
9. Reefer Plugs
10. Cargo Gear / Cranes (Geared vs. Gearless)
11. Bow Thruster (Fitted vs. Not Fitted)
12. Gross Tonnage (GRT)
13. Net Tonnage (NRT)
14. Deadweight (DWT)
15. Length Overall (LOA) & Breadth (Beam)
16. Summer Draft
*Plus assigned feeder service, AIS transponder status, and "Track This Vessel on Map" action.*

### 4. Regional Agents & Offices
- Country-filtered directories across UAE, Saudi Arabia, India, Singapore, Egypt, and China.
- Direct `tel:`, `mailto:`, and interactive **"Locate on Map"** capabilities.

### 5. Sustainability & Decarbonization
- Cold-ironing shore power readiness at Jebel Ali.
- B24 biofuel blend and bio-methanol fleet readiness.
- AI voyage and weather trim routing metrics.

---

## 📁 Repository Structure

```
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── config.py         # Settings & dynamic DATABASE_URL support
│   │   ├── database.py       # SQLAlchemy engine & session dependency
│   │   ├── models.py         # Vessel, FeederService, VoyageSchedule, RegionalAgent
│   │   ├── schemas.py        # Pydantic v2 validation models
│   │   ├── seed.py           # Auto-seed database logic
│   │   └── main.py           # FastAPI routes & CORS middleware
│   ├── Procfile              # Render web worker process
│   ├── render.yaml           # Render Infrastructure-as-Code blueprint
│   ├── requirements.txt      # Python dependencies
│   └── .gitignore
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   ├── header/          # Navigation, emergency line & RTL switcher
│   │   │   │   ├── hero-search/     # 3-tab search engine
│   │   │   │   ├── stats-strip/     # Animated KPI counter metrics
│   │   │   │   ├── map/             # Leaflet.js interactive map
│   │   │   │   ├── services-list/   # Feeder route cards & rotation details
│   │   │   │   ├── fleet/           # Filterable vessel grid
│   │   │   │   ├── vessel-modal/    # 16-point technical spec modal
│   │   │   │   ├── sustainability/  # Green feeder highlights
│   │   │   │   ├── agents/          # Regional office directory
│   │   │   │   ├── booking-modal/   # Slot booking / quote inquiry modal
│   │   │   │   └── footer/          # Corporate links & compliance certifications
│   │   │   ├── models/              # TypeScript maritime interfaces
│   │   │   └── services/            # MaritimeService with Angular Signals
│   │   ├── environments/            # Local & production API URLs
│   │   └── styles.css               # Tailwind CSS & Leaflet custom styling
│   ├── vercel.json                  # Vercel SPA routing configuration
│   └── angular.json
└── README.md
```

---

## ⚖️ License
MIT License. Inspired by industry leaders Global Feeders, X-Press Feeders, and DP World. Built for operational demonstration and enterprise evaluations.
