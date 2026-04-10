import asyncio
import json
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.db.db import fetch_cluster_snapshot

router = APIRouter()

@router.websocket("/live")
async def websocket_live(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            snapshot = await fetch_cluster_snapshot()
            for node in snapshot:
                if "time" in node:
                    node["time"] = str(node["time"])
            await websocket.send_text(json.dumps(snapshot))
            await asyncio.sleep(2)
    except WebSocketDisconnect:
        print("Client disconnected")