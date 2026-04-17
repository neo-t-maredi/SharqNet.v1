import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View, ScrollView, SafeAreaView } from 'react-native'
import { useEffect, useState } from 'react'

const WS_URL = 'ws://10.115.249.165:8000/ws/live'

const COLORS = {
  bg: '#020617',
  surface: '#0f172a',
  surface2: '#1e293b',
  border: 'rgba(148,163,184,0.1)',
  electric: '#38bdf8',
  text: '#e2e8f0',
  muted: '#64748b',
  secondary: '#94a3b8',
  green: '#4caf50',
  amber: '#f59e0b',
  red: '#e63946',
}

function MetricCard({ label, value, unit, accent }) {
  return (
    <View style={styles.metricCard}>
      <Text style={styles.metricLabel}>{label}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4 }}>
        <Text style={[styles.metricValue, accent && { color: COLORS.electric }]}>
          {value}
        </Text>
        {unit && <Text style={styles.metricUnit}>{unit}</Text>}
      </View>
    </View>
  )
}

function NodeCard({ node }) {
  const soc = node.battery_soc_pct || 0
  const barColor = soc > 50 ? COLORS.green : soc > 20 ? COLORS.amber : COLORS.red

  return (
    <View style={styles.nodeCard}>
      <View style={styles.nodeHeader}>
        <Text style={styles.nodeId}>{node.meter_id.replace('_', ' ').toUpperCase()}</Text>
        <View style={styles.onlineBadge}>
          <Text style={styles.onlineText}>ONLINE</Text>
        </View>
      </View>
      <Text style={styles.nodeDemand}>
        {node.kw_demand?.toFixed(1)}<Text style={styles.nodeUnit}> kW</Text>
      </Text>
      <View style={styles.nodeRow}>
        <Text style={styles.nodeStat}>☀️ {node.solar_kw?.toFixed(1)} kW</Text>
        <Text style={[styles.nodeStat, { color: barColor }]}>🔋 {soc.toFixed(0)}%</Text>
      </View>
      <View style={styles.batteryTrack}>
        <View style={[styles.batteryFill, { width: `${soc}%`, backgroundColor: barColor }]} />
      </View>
    </View>
  )
}

export default function App() {
  const [nodes, setNodes] = useState([])
  const [connected, setConnected] = useState(false)

  const summary = {
    totalDemand: nodes.reduce((s, n) => s + (n.kw_demand || 0), 0).toFixed(1),
    totalSolar: nodes.reduce((s, n) => s + (n.solar_kw || 0), 0).toFixed(1),
    avgBattery: nodes.length
      ? (nodes.reduce((s, n) => s + (n.battery_soc_pct || 0), 0) / nodes.length).toFixed(1)
      : '0.0',
    nodeCount: nodes.length,
  }

  useEffect(() => {
    const ws = new WebSocket(WS_URL)
    ws.onopen = () => setConnected(true)
    ws.onmessage = (e) => setNodes(JSON.parse(e.data))
    ws.onclose = () => setConnected(false)
    ws.onerror = () => setConnected(false)
    return () => ws.close()
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scroll}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>⚡ SharqNet</Text>
            <Text style={styles.subtitle}>Eastern Province Microgrid</Text>
          </View>
          <View style={[styles.liveBadge, { borderColor: connected ? COLORS.green : COLORS.red }]}>
            <View style={[styles.liveDot, { backgroundColor: connected ? COLORS.green : COLORS.red }]} />
            <Text style={[styles.liveText, { color: connected ? COLORS.green : COLORS.red }]}>
              {connected ? 'LIVE' : 'OFF'}
            </Text>
          </View>
        </View>

        {/* Summary metrics */}
        <View style={styles.metricsGrid}>
          <MetricCard label="Total Demand" value={summary.totalDemand} unit="kW" />
          <MetricCard label="Active Nodes" value={`${summary.nodeCount}/10`} />
          <MetricCard label="Solar Output" value={summary.totalSolar} unit="kW" accent />
          <MetricCard label="Avg Battery" value={`${summary.avgBattery}%`} />
        </View>

        {/* Node list */}
        <Text style={styles.sectionTitle}>LIVE GRID NODES</Text>
        {nodes.map(node => <NodeCard key={node.meter_id} node={node} />)}

      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { padding: 16, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, marginTop: 8 },
  title: { fontSize: 24, fontWeight: '800', color: COLORS.text },
  subtitle: { fontSize: 12, color: COLORS.muted, marginTop: 2 },
  liveBadge: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4, gap: 6 },
  liveDot: { width: 6, height: 6, borderRadius: 3 },
  liveText: { fontSize: 11, fontWeight: '600' },
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  metricCard: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, borderRadius: 16, padding: 16, width: '47%' },
  metricLabel: { fontSize: 10, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 },
  metricValue: { fontSize: 24, fontWeight: '700', color: COLORS.text },
  metricUnit: { fontSize: 13, color: COLORS.secondary, fontWeight: '400' },
  sectionTitle: { fontSize: 10, color: COLORS.muted, letterSpacing: 1.5, marginBottom: 12 },
  nodeCard: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, borderRadius: 16, padding: 16, marginBottom: 10 },
  nodeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  nodeId: { fontSize: 10, color: COLORS.muted, letterSpacing: 1 },
  onlineBadge: { backgroundColor: 'rgba(26,58,26,0.6)', borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2 },
  onlineText: { fontSize: 9, color: COLORS.green, fontWeight: '600' },
  nodeDemand: { fontSize: 28, fontWeight: '700', color: COLORS.text, marginBottom: 8 },
  nodeUnit: { fontSize: 14, color: COLORS.secondary, fontWeight: '400' },
  nodeRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  nodeStat: { fontSize: 12, color: COLORS.secondary },
  batteryTrack: { height: 3, backgroundColor: COLORS.surface2, borderRadius: 999, overflow: 'hidden' },
  batteryFill: { height: '100%', borderRadius: 999 },
})