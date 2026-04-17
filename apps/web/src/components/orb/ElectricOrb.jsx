import { useEffect, useRef } from 'react'

// ── Lightning class lives outside the component ──────────────
class Lightning {
  constructor(x, y, tx, ty) {
    this.segments = this.createSegments(x, y, tx, ty, 5)
    this.life = 1.0
    this.decay = 0.025 + Math.random() * 0.02
    this.width = 1.5 + Math.random() * 2
  }
  createSegments(x1, y1, x2, y2, iter) {
    let segs = [{ x: x1, y: y1 }, { x: x2, y: y2 }]
    for (let i = 0; i < iter; i++) {
      let next = []
      for (let j = 0; j < segs.length - 1; j++) {
        const a = segs[j], b = segs[j + 1]
        const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2
        const dx = b.x - a.x, dy = b.y - a.y
        const dist = Math.sqrt(dx * dx + dy * dy) || 1
        const off = (Math.random() - 0.5) * dist * 0.3
        next.push(a, { x: mx + (-dy / dist) * off, y: my + (dx / dist) * off })
      }
      next.push(segs[segs.length - 1])
      segs = next
    }
    return segs
  }
  update() { this.life -= this.decay; return this.life > 0 }
  draw(ctx) {
    ctx.save()
    ctx.globalAlpha = this.life
    ctx.shadowBlur = 15
    ctx.shadowColor = 'rgba(56,189,248,0.9)'
    ctx.strokeStyle = '#7dd3fc'
    ctx.lineWidth = this.width
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(this.segments[0].x, this.segments[0].y)
    this.segments.forEach(s => ctx.lineTo(s.x, s.y))
    ctx.stroke()
    ctx.strokeStyle = '#fff'
    ctx.lineWidth = this.width * 0.4
    ctx.stroke()
    ctx.restore()
  }
}

// ── Component ─────────────────────────────────────────────────
export default function ElectricOrb() {
  const containerRef = useRef(null)
  const electricRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container || typeof window.THREE === 'undefined') return

    const THREE = window.THREE
    const width = container.clientWidth
    const height = container.clientHeight

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x020617)

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.set(0, 0, 8)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    container.appendChild(renderer.domElement)

    scene.add(new THREE.AmbientLight(0x475569, 0.4))
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2)
    keyLight.position.set(5, 5, 10)
    scene.add(keyLight)
    const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.6)
    fillLight.position.set(-5, 0, 5)
    scene.add(fillLight)
    const rimLight = new THREE.DirectionalLight(0x7dd3fc, 0.8)
    rimLight.position.set(0, 5, -5)
    scene.add(rimLight)

    const geometry = new THREE.SphereGeometry(1.8, 64, 64)
    const material = new THREE.MeshPhysicalMaterial({
      color: 0x64748b,
      metalness: 1.0,
      roughness: 0.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      reflectivity: 1.0,
    })
    const orb = new THREE.Mesh(geometry, material)
    scene.add(orb)

    let time = 0
    let animId
    function animate() {
      animId = requestAnimationFrame(animate)
      time += 0.01
      orb.rotation.y += 0.005
      orb.rotation.x = Math.sin(time * 0.5) * 0.1
      orb.position.y = Math.sin(time) * 0.1
      renderer.render(scene, camera)
    }
    animate()

    // Electric
    const canvas = electricRef.current
    const ctx = canvas.getContext('2d')
    canvas.width = width
    canvas.height = height

    let lightnings = []
    let lastStrike = 0
    let strikeInterval = 800
    let elecId

    function electricLoop() {
      elecId = requestAnimationFrame(electricLoop)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const now = Date.now()
      if (now - lastStrike > strikeInterval) {
        const sx = Math.random() * width
        const sy = Math.random() * height * 0.3
        const tx = width * 0.3 + Math.random() * width * 0.4
        const ty = height * 0.4 + Math.random() * height * 0.4
        lightnings.push(new Lightning(sx, sy, tx, ty))
        lastStrike = now
        strikeInterval = 400 + Math.random() * 1500
      }
      lightnings = lightnings.filter(l => l.update())
      lightnings.forEach(l => l.draw(ctx))
    }
    electricLoop()

    const handleResize = () => {
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
      canvas.width = w
      canvas.height = h
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animId)
      cancelAnimationFrame(elecId)
      window.removeEventListener('resize', handleResize)
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div ref={containerRef} style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
      <canvas ref={electricRef} style={{
        position: 'absolute', inset: 0,
        zIndex: 5, pointerEvents: 'none',
        mixBlendMode: 'screen'
      }} />
    </div>
  )
}