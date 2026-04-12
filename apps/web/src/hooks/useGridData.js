import { useState, useEffect } from 'react'

const WS_URL = 'ws://127.0.0.1:8000/ws/live'

export function useGridData() {
  const [nodes, setNodes] = useState([])
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const ws = new WebSocket(WS_URL)

    ws.onopen = () => setConnected(true)

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      setNodes(data)
    }

    ws.onclose = () => setConnected(false)
    ws.onerror = () => setConnected(false)

    return () => ws.close()
  }, [])

  const summary = {
    totalDemand: nodes.reduce((sum, n) => sum + (n.kw_demand || 0), 0).toFixed(1),
    totalSolar: nodes.reduce((sum, n) => sum + (n.solar_kw || 0), 0).toFixed(1),
    avgBattery: nodes.length
      ? (nodes.reduce((sum, n) => sum + (n.battery_soc_pct || 0), 0) / nodes.length).toFixed(1)
      : 0,
    nodeCount: nodes.length
  }

  return { nodes, summary, connected }
}
