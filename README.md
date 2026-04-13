# SharqNet ⚡

> Real-time microgrid telemetry and monitoring platform for distributed energy clusters in the Eastern Province, Saudi Arabia.

SharqNet streams live telemetry from simulated SME energy nodes through a full-stack data pipeline — from edge Rust agents through MQTT, into TimescaleDB, and out to a React frontend via FastAPI WebSocket.

---

## Architecture

---

## Features

- Real-time telemetry from 10 simulated SME energy nodes
- Live WebSocket streaming to React frontend
- REST API with Swagger UI
- Operator dashboard — live node cards, cluster demand, battery SOC
- Investor view — high-level cluster summary
- Time-series persistence via TimescaleDB
- Modular monorepo structure

---

## Simulated Nodes

| Node | Type |
|------|------|
| Bakery 01 | High heat demand |
| Butchery 01 | Refrigeration load |
| Cafe 01 | Variable load |
| Cold Storage 01 | Continuous load |
| Laundry 01 | Thermal + motor |
| Office 01 | Standard commercial |
| Office 02 | Standard commercial |
| Pharmacy 01 | Critical load |
| Retail 01 | Steady commercial |
| Workshop 01 | Industrial demand |

Each node publishes: `kw_demand`, `solar_kw`, `battery_soc_pct`, `kwh_import`, `kwh_export`, `timestamp`

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Simulation | Rust (meter agents) |
| Messaging | MQTT via Mosquitto |
| Ingestion | Python + asyncpg + aiomqtt |
| Storage | TimescaleDB (PostgreSQL) |
| API | FastAPI + WebSocket |
| Dashboard | Dash + Plotly |
| Frontend | React + Vite |
| Infrastructure | Docker Compose |

---

## Project Structure

---

## Getting Started

### 1. Start infrastructure
```bash
docker compose up -d
```

### 2. Run meter agents
```bash
cd services/meter-agent
cargo run
```

### 3. Start ingestor
```bash
cd services/api
source venv/bin/activate
python3 app/ingestor.py
```

### 4. Start FastAPI
```bash
uvicorn main:app --reload --port 8000
```

### 5. Start React frontend
```bash
cd apps/web
npm run dev
```

### 6. Optional — Dash dashboard
```bash
cd services/api
python3 dashboard.py
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| GET | `/api/cluster/latest` | Latest reading per node |
| WS | `/ws/live` | Live telemetry stream |
| GET | `/docs` | Swagger UI |

---

## Author

**Neo Maredi**
Industrial Automation · Distributed Energy Systems · Edge Computing
[github.com/neo-t-maredi/SharqNet.v1](https://github.com/neo-t-maredi/SharqNet.v1)
