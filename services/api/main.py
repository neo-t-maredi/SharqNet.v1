from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.cluster import router as cluster_router
from app.routers.ws import router as ws_router

app = FastAPI(
    title="SharqNet API",
    version="0.1.0",
    description="Real-time microgrid telemetry API for SharqNet",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(cluster_router, prefix="/api")
app.include_router(ws_router, prefix="/ws")

@app.get("/")
def root():
    return {
        "message": "SharqNet API is running",
        "docs": "/docs",
    }