# import os
# import psycopg2
# import plotly.graph_objs as go

# from dash import Dash, html, dcc, Output, Input
# from dotenv import load_dotenv

# load_dotenv()


# def get_db_connection():
#     return psycopg2.connect(
#         host=os.getenv("POSTGRES_HOST", "127.0.0.1"),
#         port=int(os.getenv("POSTGRES_PORT", "5432")),
#         dbname=os.getenv("POSTGRES_DB", "voltanet"),
#         user=os.getenv("POSTGRES_USER", "voltanet_user"),
#         password=os.getenv("POSTGRES_PASSWORD", "voltanet_secret_2025"),
#     )


# def fetch_cluster_snapshot():
#     query = """
#     WITH latest_per_meter AS (
#         SELECT DISTINCT ON (meter_id)
#             meter_id,
#             time,
#             kw_demand,
#             solar_kw,
#             battery_soc_pct
#         FROM readings
#         ORDER BY meter_id, time DESC
#     )
#     SELECT
#         COUNT(*) AS active_nodes,
#         COALESCE(SUM(kw_demand), 0) AS total_kw_demand,
#         COALESCE(SUM(solar_kw), 0) AS total_solar_kw,
#         COALESCE(AVG(battery_soc_pct), 0) AS avg_battery_soc_pct,
#         MAX(time) AS latest_time
#     FROM latest_per_meter;
#     """

#     conn = get_db_connection()
#     try:
#         with conn.cursor() as cur:
#             cur.execute(query)
#             row = cur.fetchone()

#         return {
#             "active_nodes": row[0],
#             "total_kw_demand": float(row[1]),
#             "total_solar_kw": float(row[2]),
#             "avg_battery_soc_pct": float(row[3]),
#             "latest_time": str(row[4]),
#         }
#     finally:
#         conn.close()


# def fetch_demand_timeseries():
#     query = """
#     SELECT
#         time_bucket('5 seconds', time) AS bucket,
#         AVG(kw_demand) AS avg_kw
#     FROM readings
#     WHERE time > NOW() - INTERVAL '5 minutes'
#     GROUP BY bucket
#     ORDER BY bucket;
#     """

#     conn = get_db_connection()
#     try:
#         with conn.cursor() as cur:
#             cur.execute(query)
#             rows = cur.fetchall()

#         times = [r[0] for r in rows]
#         demand = [float(r[1]) for r in rows]

#         return times, demand
#     finally:
#         conn.close()


# def fetch_node_snapshot():
#     query = """
#     SELECT DISTINCT ON (meter_id)
#         meter_id,
#         kw_demand,
#         solar_kw,
#         battery_soc_pct,
#         time
#     FROM readings
#     ORDER BY meter_id, time DESC;
#     """

#     conn = get_db_connection()
#     try:
#         with conn.cursor() as cur:
#             cur.execute(query)
#             rows = cur.fetchall()

#         nodes = []
#         for r in rows:
#             nodes.append(
#                 {
#                     "meter_id": r[0],
#                     "kw_demand": float(r[1]),
#                     "solar_kw": float(r[2]),
#                     "battery_soc": float(r[3]),
#                     "time": r[4],
#                 }
#             )

#         return nodes
#     finally:
#         conn.close()


# def battery_bar(soc):
#     if soc >= 60:
#         color = "#22c55e"
#     elif soc >= 30:
#         color = "#f97316"
#     else:
#         color = "#ef4444"

#     return html.Div(
#         [
#             html.Div(
#                 style={
#                     "width": f"{max(0, min(100, soc))}%",
#                     "height": "8px",
#                     "backgroundColor": color,
#                     "borderRadius": "6px",
#                 }
#             )
#         ],
#         style={
#             "width": "100%",
#             "height": "8px",
#             "backgroundColor": "rgba(255,255,255,0.08)",
#             "borderRadius": "6px",
#             "marginTop": "6px",
#             "overflow": "hidden",
#         },
#     )


# def battery_color(soc: float) -> str:
#     if soc >= 60:
#         return "#22c55e"
#     if soc >= 30:
#         return "#f97316"
#     return "#ef4444"


# app = Dash(__name__)
# app.title = "VoltaNet Live Grid"

# app.layout = html.Div(
#     [
#         dcc.Interval(
#             id="refresh",
#             interval=2000,
#             n_intervals=0,
#         ),
#         html.Div(
#             [
#                 html.H1(
#                     "VoltaNet Live Grid",
#                     style={
#                         "marginBottom": "8px",
#                         "fontSize": "52px",
#                         "fontWeight": "700",
#                         "letterSpacing": "-1px",
#                     },
#                 ),
#                 html.P(
#                     "Real-time SME microgrid monitoring dashboard",
#                     style={
#                         "marginTop": "0",
#                         "color": "#a8a29e",
#                         "fontSize": "18px",
#                     },
#                 ),
#             ]
#         ),
#         html.Div(
#             id="cluster-metrics",
#             style={"marginTop": "28px"},
#         ),
#         html.Div(
#             [
#                 html.H3(
#                     "Cluster Demand",
#                     style={
#                         "marginTop": "42px",
#                         "marginBottom": "16px",
#                         "fontSize": "24px",
#                         "fontWeight": "600",
#                         "color": "#faf5f5",
#                     },
#                 ),
#                 dcc.Graph(id="demand-chart"),
#             ]
#         ),
#         html.Div(
#             [
#                 html.H3(
#                     "Live Grid Nodes",
#                     style={
#                         "marginTop": "42px",
#                         "marginBottom": "16px",
#                         "fontSize": "24px",
#                         "fontWeight": "600",
#                         "color": "#faf5f5",
#                     },
#                 ),
#                 html.Div(id="node-grid"),
#             ]
#         ),
#     ],
#     style={
#         "backgroundColor": "#0f0a0a",
#         "color": "#faf5f5",
#         "minHeight": "100vh",
#         "padding": "32px",
#         "fontFamily": "Arial, sans-serif",
#     },
# )


# @app.callback(
#     Output("cluster-metrics", "children"),
#     Input("refresh", "n_intervals"),
# )
# def update_cluster_metrics(_):
#     snapshot = fetch_cluster_snapshot()

#     return html.Div(
#         [
#             html.Div(
#                 [
#                     html.H2(f"{snapshot['total_kw_demand']:.1f} kW"),
#                     html.P("Total Demand"),
#                 ],
#                 className="card",
#             ),
#             html.Div(
#                 [
#                     html.H2(f"{snapshot['active_nodes']}"),
#                     html.P("Active Nodes"),
#                 ],
#                 className="card",
#             ),
#             html.Div(
#                 [
#                     html.H2(f"{snapshot['avg_battery_soc_pct']:.1f}%"),
#                     html.P("Battery SOC"),
#                 ],
#                 className="card",
#             ),
#             html.Div(
#                 [
#                     html.H2(f"{snapshot['total_solar_kw']:.1f} kW"),
#                     html.P("Solar Output"),
#                 ],
#                 className="card",
#             ),
#         ],
#         style={
#             "display": "grid",
#             "gridTemplateColumns": "repeat(4, 1fr)",
#             "gap": "20px",
#         },
#     )


# @app.callback(
#     Output("demand-chart", "figure"),
#     Input("refresh", "n_intervals"),
# )
# def update_demand_chart(_):
#     times, demand = fetch_demand_timeseries()

#     fig = go.Figure()

#     fig.add_trace(
#         go.Scatter(
#             x=times,
#             y=demand,
#             mode="lines",
#             name="Cluster Demand Glow",
#             line=dict(color="rgba(239, 68, 68, 0.25)", width=8),
#             showlegend=False,
#             hoverinfo="skip",
#         )
#     )

#     fig.add_trace(
#         go.Scatter(
#             x=times,
#             y=demand,
#             mode="lines",
#             name="Cluster Demand",
#             line=dict(color="#ef4444", width=3),
#             fill="tozeroy",
#             fillcolor="rgba(239, 68, 68, 0.10)",
#         )
#     )

#     fig.update_layout(
#         title="Average Cluster Demand (Last 5 Minutes)",
#         template=None,
#         paper_bgcolor="#0f0a0a",
#         plot_bgcolor="#1a1111",
#         margin=dict(l=40, r=40, t=50, b=40),
#         height=420,
#         font=dict(color="#faf5f5"),
#         xaxis=dict(
#             showgrid=True,
#             gridcolor="rgba(120, 113, 108, 0.10)",
#             zeroline=False,
#             tickfont=dict(color="#a8a29e"),
#         ),
#         yaxis=dict(
#             title="kW",
#             showgrid=True,
#             gridcolor="rgba(120, 113, 108, 0.10)",
#             zeroline=False,
#             tickfont=dict(color="#a8a29e"),
#             title_font=dict(color="#a8a29e"),
#         ),
#         legend=dict(
#             orientation="h",
#             yanchor="bottom",
#             y=1.02,
#             xanchor="right",
#             x=1,
#         ),
#         hovermode="x unified",
#         hoverlabel=dict(
#             bgcolor="rgba(26, 17, 17, 0.95)",
#             bordercolor="#ef4444",
#             font=dict(color="#faf5f5"),
#         ),
#     )

#     return fig


# @app.callback(
#     Output("node-grid", "children"),
#     Input("refresh", "n_intervals"),
# )
# def update_nodes(_):
#     nodes = fetch_node_snapshot()

#     cards = []
#     for node in nodes:
#         soc_color = battery_color(node["battery_soc"])

#         cards.append(
#             html.Div(
#                 [
#                     html.H3(
#                         node["meter_id"].replace("_", " ").title(),
#                         style={
#                             "marginBottom": "12px",
#                             "fontSize": "18px",
#                             "fontWeight": "600",
#                             "color": "#faf5f5",
#                         },
#                     ),
#                     html.H2(
#                         f"{node['kw_demand']:.1f} kW",
#                         style={
#                             "margin": "0 0 10px 0",
#                             "fontSize": "32px",
#                             "color": "#ef4444",
#                         },
#                     ),
#                     html.P(
#                         f"Solar {node['solar_kw']:.1f} kW",
#                         style={
#                             "margin": "4px 0",
#                             "color": "#a8a29e",
#                             "fontSize": "14px",
#                         },
#                     ),
#                     html.P(
#                         f"Battery {node['battery_soc']:.0f}%",
#                         style={
#                             "margin": "6px 0 2px 0",
#                             "color": soc_color,
#                             "fontWeight": "700",
#                             "fontSize": "15px",
#                         },
#                     ),
#                     battery_bar(node["battery_soc"]),
#                 ],
#                 className="card",
#             )
#         )

#     return html.Div(
#         cards,
#         style={
#             "display": "grid",
#             "gridTemplateColumns": "repeat(5, 1fr)",
#             "gap": "20px",
#             "marginTop": "12px",
#         },
#     )


# if __name__ == "__main__":
#     app.run(debug=True, host="127.0.0.1", port=8050)

"""
VoltaNet Live Grid - CRIMSON POWER Edition
High-voltage danger meets sophisticated dark UI
"""

import os
import psycopg2
import plotly.graph_objs as go
from dash import Dash, html, dcc, Output, Input
from dotenv import load_dotenv

load_dotenv()

# =============================================================================
# CRIMSON POWER CSS
# =============================================================================

CRIMSON_CSS = """
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
    font-family: 'Inter', sans-serif;
    background: linear-gradient(135deg, #0f0a0a 0%, #1a1111 50%, #0f0a0a 100%);
    color: #faf5f5;
    overflow-x: hidden;
    min-height: 100vh;
}

.bg-grid {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
        linear-gradient(rgba(239, 68, 68, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(239, 68, 68, 0.03) 1px, transparent 1px);
    background-size: 60px 60px;
    pointer-events: none;
    z-index: 0;
    animation: gridMove 20s linear infinite;
}

.bg-grid::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(ellipse at 50% 50%, transparent 0%, #0f0a0a 70%);
}

@keyframes gridMove {
    0% { transform: perspective(500px) rotateX(60deg) translateY(0); }
    100% { transform: perspective(500px) rotateX(60deg) translateY(60px); }
}

.particles {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
    overflow: hidden;
}

.particle {
    position: absolute;
    width: 4px;
    height: 4px;
    background: rgba(239, 68, 68, 0.5);
    border-radius: 50%;
    animation: float 15s infinite;
    box-shadow: 0 0 10px rgba(239, 68, 68, 0.6);
}

@keyframes float {
    0%, 100% {
        transform: translateY(100vh) rotate(0deg);
        opacity: 0;
    }
    10% {
        opacity: 1;
    }
    90% {
        opacity: 1;
    }
    100% {
        transform: translateY(-100vh) rotate(720deg);
        opacity: 0;
    }
}

.dashboard-header {
    position: relative;
    z-index: 10;
    padding: 2rem;
    background: linear-gradient(180deg, rgba(26, 17, 17, 0.9) 0%, transparent 100%);
    border-bottom: 1px solid rgba(239, 68, 68, 0.1);
}

.header-content {
    max-width: 1400px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.brand {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.logo-container {
    position: relative;
    width: 60px;
    height: 60px;
}

.logo-icon {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #ef4444 0%, #b91c1c 100%);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    position: relative;
    z-index: 2;
    box-shadow: 
        0 0 30px rgba(239, 68, 68, 0.5),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
    animation: logoPulse 3s ease-in-out infinite;
}

.logo-glow {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80px;
    height: 80px;
    background: radial-gradient(circle, rgba(239, 68, 68, 0.4) 0%, transparent 70%);
    animation: glowPulse 3s ease-in-out infinite;
    z-index: 1;
}

@keyframes logoPulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
}

@keyframes glowPulse {
    0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
    50% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
}

.brand-text h1 {
    font-size: 2.5rem;
    font-weight: 800;
    background: linear-gradient(135deg, #ffffff 0%, #ef4444 50%, #b91c1c 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: -0.02em;
    text-shadow: 0 0 30px rgba(239, 68, 68, 0.3);
}

.brand-text p {
    color: #a8a29e;
    font-size: 1rem;
    margin-top: 0.25rem;
    font-family: 'JetBrains Mono', monospace;
}

.live-indicator {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1.5rem;
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.3);
    border-radius: 50px;
    backdrop-filter: blur(10px);
}

.pulse-ring {
    position: relative;
    width: 12px;
    height: 12px;
}

.pulse-ring::before,
.pulse-ring::after {
    content: '';
    position: absolute;
    border-radius: 50%;
    background: #fbbf24;
}

.pulse-ring::before {
    width: 100%;
    height: 100%;
    animation: pulseRing 2s ease-out infinite;
}

.pulse-ring::after {
    width: 100%;
    height: 100%;
    animation: pulseDot 2s ease-out infinite;
}

@keyframes pulseRing {
    0% { transform: scale(1); opacity: 1; }
    100% { transform: scale(3); opacity: 0; }
}

@keyframes pulseDot {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.2); }
}

.live-text {
    color: #fbbf24;
    font-weight: 600;
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-family: 'JetBrains Mono', monospace;
}

.dashboard-container {
    position: relative;
    z-index: 10;
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 2rem 2rem;
}

.metrics-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
    margin-bottom: 2rem;
}

.metric-card {
    position: relative;
    background: rgba(26, 17, 17, 0.6);
    border: 1px solid rgba(120, 113, 108, 0.1);
    border-radius: 20px;
    padding: 1.5rem;
    overflow: hidden;
    backdrop-filter: blur(20px);
    transition: all 0.3s ease;
}

.metric-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, transparent, var(--accent), transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
}

.metric-card:hover {
    transform: translateY(-5px);
    border-color: rgba(239, 68, 68, 0.3);
    box-shadow: 
        0 20px 40px rgba(0, 0, 0, 0.4),
        0 0 40px rgba(239, 68, 68, 0.1);
}

.metric-card:hover::before {
    opacity: 1;
}

.metric-card.demand { --accent: #ef4444; }
.metric-card.nodes { --accent: #f97316; }
.metric-card.battery { --accent: #22c55e; }
.metric-card.solar { --accent: #eab308; }

.metric-icon-wrapper {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    margin-bottom: 1rem;
    position: relative;
    overflow: hidden;
}

.metric-card.demand .metric-icon-wrapper {
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(239, 68, 68, 0.05));
    box-shadow: 0 0 20px rgba(239, 68, 68, 0.3);
}

.metric-card.nodes .metric-icon-wrapper {
    background: linear-gradient(135deg, rgba(249, 115, 22, 0.2), rgba(249, 115, 22, 0.05));
    box-shadow: 0 0 20px rgba(249, 115, 22, 0.3);
}

.metric-card.battery .metric-icon-wrapper {
    background: linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(34, 197, 94, 0.05));
    box-shadow: 0 0 20px rgba(34, 197, 94, 0.3);
}

.metric-card.solar .metric-icon-wrapper {
    background: linear-gradient(135deg, rgba(234, 179, 8, 0.2), rgba(234, 179, 8, 0.05));
    box-shadow: 0 0 20px rgba(234, 179, 8, 0.3);
}

.metric-value {
    font-size: 2.5rem;
    font-weight: 800;
    color: #ffffff;
    line-height: 1;
    margin-bottom: 0.5rem;
    font-family: 'JetBrains Mono', monospace;
    text-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
}

.metric-label {
    font-size: 0.875rem;
    color: #a8a29e;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: 500;
}

.chart-container {
    background: rgba(26, 17, 17, 0.6);
    border: 1px solid rgba(120, 113, 108, 0.1);
    border-radius: 20px;
    padding: 1.5rem;
    margin-bottom: 2rem;
    backdrop-filter: blur(20px);
    position: relative;
    overflow: hidden;
}

.chart-container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(239, 68, 68, 0.5), transparent);
}

.chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.chart-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: #faf5f5;
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.chart-title::before {
    content: '';
    width: 4px;
    height: 24px;
    background: linear-gradient(180deg, #ef4444, #b91c1c);
    border-radius: 2px;
    box-shadow: 0 0 10px rgba(239, 68, 68, 0.5);
}

.nodes-section {
    margin-top: 2rem;
}

.section-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
}

.section-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #faf5f5;
}

.section-title::before {
    content: '';
    width: 4px;
    height: 28px;
    background: linear-gradient(180deg, #22c55e, #16a34a);
    border-radius: 2px;
    box-shadow: 0 0 10px rgba(34, 197, 94, 0.5);
}

.nodes-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
}

.node-card {
    background: rgba(26, 17, 17, 0.6);
    border: 1px solid rgba(120, 113, 108, 0.1);
    border-radius: 20px;
    padding: 1.5rem;
    position: relative;
    overflow: hidden;
    backdrop-filter: blur(20px);
    transition: all 0.3s ease;
}

.node-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.03), transparent);
    transition: left 0.6s ease;
}

.node-card:hover::before {
    left: 100%;
}

.node-card:hover {
    transform: translateY(-5px);
    border-color: rgba(239, 68, 68, 0.3);
    box-shadow: 
        0 25px 50px rgba(0, 0, 0, 0.5),
        0 0 60px rgba(239, 68, 68, 0.1);
}

.node-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.node-id {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.875rem;
    font-weight: 600;
    color: #78716c;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.node-status {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.375rem 0.75rem;
    background: rgba(34, 197, 94, 0.1);
    border: 1px solid rgba(34, 197, 94, 0.3);
    border-radius: 20px;
    font-size: 0.75rem;
    color: #22c55e;
    font-weight: 600;
    text-transform: uppercase;
}

.status-dot {
    width: 6px;
    height: 6px;
    background: #22c55e;
    border-radius: 50%;
    box-shadow: 0 0 8px #22c55e;
    animation: blink 2s ease-in-out infinite;
}

@keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
}

.node-power {
    font-size: 2.5rem;
    font-weight: 800;
    color: #ef4444;
    margin-bottom: 1rem;
    font-family: 'JetBrains Mono', monospace;
    text-shadow: 0 0 20px rgba(239, 68, 68, 0.3);
}

.node-stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1rem;
}

.stat-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.stat-label {
    font-size: 0.75rem;
    color: #57534e;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.stat-value {
    font-size: 1.125rem;
    font-weight: 600;
    color: #a8a29e;
    font-family: 'JetBrains Mono', monospace;
}

.stat-value.solar {
    color: #eab308;
    text-shadow: 0 0 10px rgba(234, 179, 8, 0.3);
}

.battery-wrapper {
    margin-top: 0.5rem;
}

.battery-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
}

.battery-label {
    font-size: 0.875rem;
    color: #78716c;
    font-weight: 500;
}

.battery-percentage {
    font-family: 'JetBrains Mono', monospace;
    font-size: 1rem;
    font-weight: 700;
}

.battery-track {
    width: 100%;
    height: 10px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 5px;
    overflow: hidden;
    position: relative;
}

.battery-fill {
    height: 100%;
    border-radius: 5px;
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
}

.battery-fill::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    animation: shimmer 2s infinite;
}

@keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
}

.battery-fill.high {
    background: linear-gradient(90deg, #22c55e, #16a34a);
    box-shadow: 0 0 20px rgba(34, 197, 94, 0.4);
}

.battery-fill.medium {
    background: linear-gradient(90deg, #f97316, #ea580c);
    box-shadow: 0 0 20px rgba(249, 115, 22, 0.4);
}

.battery-fill.low {
    background: linear-gradient(90deg, #ef4444, #dc2626);
    box-shadow: 0 0 20px rgba(239, 68, 68, 0.4);
}

.scanlines {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(0, 0, 0, 0.03) 2px,
        rgba(0, 0, 0, 0.03) 4px
    );
    pointer-events: none;
    z-index: 1000;
}

@media (max-width: 1200px) {
    .metrics-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 768px) {
    .metrics-grid {
        grid-template-columns: 1fr;
    }
    .header-content {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
    }
    .brand-text h1 {
        font-size: 1.75rem;
    }
    .nodes-grid {
        grid-template-columns: 1fr;
    }
}
"""

# =============================================================================
# DATABASE FUNCTIONS
# =============================================================================

def get_db_connection():
    return psycopg2.connect(
        host=os.getenv("POSTGRES_HOST", "127.0.0.1"),
        port=int(os.getenv("POSTGRES_PORT", "5432")),
        dbname=os.getenv("POSTGRES_DB", "voltanet"),
        user=os.getenv("POSTGRES_USER", "voltanet_user"),
        password=os.getenv("POSTGRES_PASSWORD", "voltanet_secret_2025"),
    )

def fetch_cluster_snapshot():
    query = """
    WITH latest_per_meter AS (
        SELECT DISTINCT ON (meter_id)
            meter_id, time, kw_demand, solar_kw, battery_soc_pct
        FROM readings ORDER BY meter_id, time DESC
    )
    SELECT
        COUNT(*) AS active_nodes,
        COALESCE(SUM(kw_demand), 0) AS total_kw_demand,
        COALESCE(SUM(solar_kw), 0) AS total_solar_kw,
        COALESCE(AVG(battery_soc_pct), 0) AS avg_battery_soc_pct,
        MAX(time) AS latest_time
    FROM latest_per_meter;
    """
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(query)
            row = cur.fetchone()
        return {
            "active_nodes": row[0],
            "total_kw_demand": float(row[1]),
            "total_solar_kw": float(row[2]),
            "avg_battery_soc_pct": float(row[3]),
            "latest_time": str(row[4]),
        }
    finally:
        conn.close()

def fetch_demand_timeseries():
    query = """
    SELECT time_bucket('5 seconds', time) AS bucket, AVG(kw_demand) AS avg_kw
    FROM readings WHERE time > NOW() - INTERVAL '5 minutes'
    GROUP BY bucket ORDER BY bucket;
    """
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(query)
            rows = cur.fetchall()
        return [r[0] for r in rows], [float(r[1]) for r in rows]
    finally:
        conn.close()

def fetch_node_snapshot():
    query = """
    SELECT DISTINCT ON (meter_id) meter_id, kw_demand, solar_kw, battery_soc_pct, time
    FROM readings ORDER BY meter_id, time DESC;
    """
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(query)
            rows = cur.fetchall()
        return [{"meter_id": r[0], "kw_demand": float(r[1]), "solar_kw": float(r[2]), 
                "battery_soc": float(r[3]), "time": r[4]} for r in rows]
    finally:
        conn.close()

# =============================================================================
# DASH APP
# =============================================================================

app = Dash(__name__)
app.title = "VoltaNet Live Grid | CRIMSON"

# Inject CSS
app.index_string = f'''
<!DOCTYPE html>
<html>
    <head>{{%metas%}}<title>{{%title%}}</title>{{%favicon%}}{{%css%}}<style>{CRIMSON_CSS}</style></head>
    <body>{{%app_entry%}}<footer>{{%config%}}{{%scripts%}}{{%renderer%}}</footer></body>
</html>
'''

# Generate floating particles
particles = html.Div([
    html.Div(className="particle", style={
        "left": f"{i*5}%", 
        "animationDelay": f"{i*0.5}s",
        "animationDuration": f"{12+i*2}s"
    }) for i in range(20)
], className="particles")

app.layout = html.Div([
    html.Div(className="bg-grid"),
    particles,
    html.Div(className="scanlines"),
    dcc.Interval(id="refresh", interval=2000, n_intervals=0),
    
    html.Header([
        html.Div([
            html.Div([
                html.Div([
                    html.Div("⚡", className="logo-icon"),
                    html.Div(className="logo-glow")
                ], className="logo-container"),
                html.Div([
                    html.H1("VoltaNet Live Grid"),
                    html.P("High-Voltage Microgrid Monitoring")
                ], className="brand-text")
            ], className="brand"),
            html.Div([
                html.Div(className="pulse-ring"),
                html.Span("Live", className="live-text")
            ], className="live-indicator")
        ], className="header-content")
    ], className="dashboard-header"),
    
    html.Main([
        html.Div(id="cluster-metrics", className="metrics-grid"),
        html.Div([
            html.Div([html.H2("Cluster Demand", className="chart-title")], className="chart-header"),
            dcc.Graph(id="demand-chart", config={"displayModeBar": False})
        ], className="chart-container"),
        html.Div([
            html.Div([html.H2("Live Grid Nodes", className="section-title")], className="section-header"),
            html.Div(id="node-grid", className="nodes-grid")
        ], className="nodes-section")
    ], className="dashboard-container")
])

# =============================================================================
# CALLBACKS
# =============================================================================

@app.callback(Output("cluster-metrics", "children"), Input("refresh", "n_intervals"))
def update_metrics(_):
    d = fetch_cluster_snapshot()
    return [
        html.Div([html.Div("⚡", className="metric-icon-wrapper"), html.Div(f"{d['total_kw_demand']:.1f} kW", className="metric-value"), html.Div("Total Demand", className="metric-label")], className="metric-card demand"),
        html.Div([html.Div("🔌", className="metric-icon-wrapper"), html.Div(f"{d['active_nodes']}", className="metric-value"), html.Div("Active Nodes", className="metric-label")], className="metric-card nodes"),
        html.Div([html.Div("🔋", className="metric-icon-wrapper"), html.Div(f"{d['avg_battery_soc_pct']:.1f}%", className="metric-value"), html.Div("Avg Battery", className="metric-label")], className="metric-card battery"),
        html.Div([html.Div("☀️", className="metric-icon-wrapper"), html.Div(f"{d['total_solar_kw']:.1f} kW", className="metric-value"), html.Div("Solar Output", className="metric-label")], className="metric-card solar")
    ]

@app.callback(Output("demand-chart", "figure"), Input("refresh", "n_intervals"))
def update_chart(_):
    times, demand = fetch_demand_timeseries()
    fig = go.Figure()
    # Crimson glow effect
    fig.add_trace(go.Scatter(x=times, y=demand, mode="lines", line=dict(color="rgba(239, 68, 68, 0.3)", width=8), showlegend=False, hoverinfo="skip"))
    # Main crimson line
    fig.add_trace(go.Scatter(x=times, y=demand, mode="lines", name="Demand", line=dict(color="#ef4444", width=3, shape="spline", smoothing=1.3), fill="tozeroy", fillcolor="rgba(239, 68, 68, 0.1)"))
    fig.update_layout(
        template="plotly_dark",
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="rgba(0,0,0,0)",
        margin=dict(l=40, r=40, t=20, b=40),
        height=350,
        font=dict(family="Inter, sans-serif", color="#faf5f5"),
        showlegend=False,
        xaxis=dict(showgrid=True, gridcolor="rgba(120, 113, 108, 0.1)", zeroline=False, tickfont=dict(size=11, color="#78716c")),
        yaxis=dict(title=dict(text="kW", font=dict(size=12, color="#78716c")), showgrid=True, gridcolor="rgba(120, 113, 108, 0.1)", zeroline=False, tickfont=dict(size=11, color="#78716c")),
        hovermode="x unified",
        hoverlabel=dict(bgcolor="rgba(26, 17, 17, 0.9)", bordercolor="#ef4444", font=dict(color="#faf5f5"))
    )
    return fig

@app.callback(Output("node-grid", "children"), Input("refresh", "n_intervals"))
def update_nodes(_):
    cards = []
    for node in fetch_node_snapshot():
        soc = node["battery_soc"]
        color = "#22c55e" if soc >= 60 else "#f97316" if soc >= 30 else "#ef4444"
        bclass = "high" if soc >= 60 else "medium" if soc >= 30 else "low"
        cards.append(html.Div([
            html.Div([html.Span(node["meter_id"].replace("_", " ").title(), className="node-id"), html.Div([html.Span(className="status-dot"), "Online"], className="node-status")], className="node-header"),
            html.Div(f"{node['kw_demand']:.1f} kW", className="node-power"),
            html.Div([html.Div([html.Span("Solar", className="stat-label"), html.Span(f"{node['solar_kw']:.1f} kW", className="stat-value solar")], className="stat-item"), html.Div([html.Span("Load", className="stat-label"), html.Span(f"{node['kw_demand']:.1f} kW", className="stat-value")], className="stat-item")], className="node-stats"),
            html.Div([html.Div([html.Span("Battery Level", className="battery-label"), html.Span(f"{soc:.0f}%", className="battery-percentage", style={"color": color})], className="battery-info"), html.Div(html.Div(className=f"battery-fill {bclass}", style={"width": f"{soc}%"}), className="battery-track")], className="battery-wrapper")
        ], className="node-card"))
    return cards

if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=8050)