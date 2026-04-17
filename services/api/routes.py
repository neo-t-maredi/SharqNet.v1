from fastapi import APIRouter
from app.db.db import fetch_cluster_snapshot

router = APIRouter()

@router.get("/cluster/latest")
async def get_cluster_latest():
    snapshot = await fetch_cluster_snapshot()
    return {
        "status": "ok",
        "data": snapshot,
    }
