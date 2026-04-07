import { useEffect, useRef } from 'react'

/**
 * Animated speaking orb with reactive spikes.
 * When `active` is true, renders an organic pulsing circle with spikes that
 * move like an audio visualizer. When idle, shows a calm breathing glow.
 */
export default function SpeakingOrb({ active = false, size = 72 }) {
  const canvasRef = useRef(null)
  const animRef = useRef(null)
  const phasesRef = useRef(
    Array.from({ length: 48 }, () => Math.random() * Math.PI * 2)
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    const w = size * dpr
    canvas.width = w
    canvas.height = w
    canvas.style.width = `${size}px`
    canvas.style.height = `${size}px`
    ctx.scale(dpr, dpr)

    const cx = size / 2
    const cy = size / 2
    const baseR = size * 0.28
    const phases = phasesRef.current
    const spikeCount = phases.length

    let t = 0
    const draw = () => {
      t += active ? 0.06 : 0.015
      ctx.clearRect(0, 0, size, size)

      // Outer glow
      const glowR = baseR + (active ? 10 : 4)
      const glow = ctx.createRadialGradient(cx, cy, baseR * 0.5, cx, cy, glowR + 8)
      glow.addColorStop(0, active ? 'rgba(59,130,246,0.18)' : 'rgba(59,130,246,0.08)')
      glow.addColorStop(1, 'rgba(59,130,246,0)')
      ctx.beginPath()
      ctx.arc(cx, cy, glowR + 8, 0, Math.PI * 2)
      ctx.fillStyle = glow
      ctx.fill()

      // Build spike path
      ctx.beginPath()
      for (let i = 0; i <= spikeCount; i++) {
        const idx = i % spikeCount
        const angle = (idx / spikeCount) * Math.PI * 2

        // Each spike has its own phase for organic movement
        const noise = active
          ? Math.sin(t * 2.5 + phases[idx] * 3) * 0.45 +
            Math.sin(t * 4.1 + phases[idx] * 7) * 0.25 +
            Math.sin(t * 1.3 + phases[idx]) * 0.3
          : Math.sin(t * 1.2 + phases[idx] * 2) * 0.12

        const spikeHeight = active ? baseR * 0.38 : baseR * 0.06
        const r = baseR + noise * spikeHeight

        const x = cx + Math.cos(angle) * r
        const y = cy + Math.sin(angle) * r

        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.closePath()

      // Gradient fill
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, baseR + 12)
      if (active) {
        grad.addColorStop(0, '#3b82f6')
        grad.addColorStop(0.6, '#2563eb')
        grad.addColorStop(1, '#1d4ed8')
      } else {
        grad.addColorStop(0, '#60a5fa')
        grad.addColorStop(0.6, '#3b82f6')
        grad.addColorStop(1, '#2563eb')
      }
      ctx.fillStyle = grad
      ctx.fill()

      // Inner highlight
      const inner = ctx.createRadialGradient(cx - 4, cy - 4, 0, cx, cy, baseR * 0.7)
      inner.addColorStop(0, 'rgba(255,255,255,0.25)')
      inner.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.beginPath()
      ctx.arc(cx, cy, baseR * 0.7, 0, Math.PI * 2)
      ctx.fillStyle = inner
      ctx.fill()

      // Center label
      ctx.fillStyle = 'rgba(255,255,255,0.95)'
      ctx.font = `bold ${size * 0.17}px system-ui, -apple-system, sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('CO', cx, cy)

      animRef.current = requestAnimationFrame(draw)
    }

    animRef.current = requestAnimationFrame(draw)
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [active, size])

  return (
    <canvas
      ref={canvasRef}
      className="block"
      style={{ width: size, height: size }}
    />
  )
}
