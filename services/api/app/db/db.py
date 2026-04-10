import asyncpg
import os
from dotenv import load_dotenv

load_dotenv()

POSTGRES_USER = os.getenv("POSTGRES_USER", "sharqnet_user")
POSTGRES_PASS = os.getenv("POSTGRES_PASSWORD", "sharqnet_secret_2025")
POSTGRES_DB   = os.getenv("POSTGRES_DB", "sharqnet")
POSTGRES_HOST = os.getenv("POSTGRES_HOST", "localhost")

async def get_connection():
    return await asyncpg.connect(
        user=POSTGRES_USER,
        password=POSTGRES_PASS,
        database=POSTGRES_DB,
        host=POSTGRES_HOST
    )

async def fetch_cluster_snapshot():
    conn = await get_connection()
    try:
        rows = await conn.fetch("""
            SELECT DISTINCT ON (meter_id)
                meter_id, kw_demand, solar_kw, battery_soc_pct, time
            FROM readings
            ORDER BY meter_id, time DESC
        """)
        return [dict(r) for r in rows]
    finally:
        await conn.close()