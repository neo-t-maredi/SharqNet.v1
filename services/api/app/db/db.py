import asyncpg
import os
from dotenv import load_dotenv

load_dotenv()

POSTGRES_USER = os.getenv("POSTGRES_USER", "sharqnet_user")
POSTGRES_PASS = os.getenv("POSTGRES_PASSWORD", "sharqnet_secret_2025")
POSTGRES_DB   = os.getenv("POSTGRES_DB", "sharqnet")
POSTGRES_HOST = os.getenv("POSTGRES_HOST", "localhost")

# Global connection pool — initialised once on startup
_pool = None

async def get_pool():
    global _pool
    if _pool is None:
        _pool = await asyncpg.create_pool(
            user=POSTGRES_USER,
            password=POSTGRES_PASS,
            database=POSTGRES_DB,
            host=POSTGRES_HOST,
            min_size=2,
            max_size=10,
        )
    return _pool

async def fetch_cluster_snapshot():
    pool = await get_pool()
    async with pool.acquire() as conn:
        rows = await conn.fetch("""
            SELECT DISTINCT ON (meter_id)
                meter_id, kw_demand, solar_kw, battery_soc_pct, time
            FROM readings
            ORDER BY meter_id, time DESC
        """)
        return [dict(r) for r in rows]