import { useEffect, useRef } from 'react'

type ParticleWaveProps = {
  className?: string
}

type Particle = {
  x: number
  y: number
  z: number
  ox: number
  oy: number
}

export function ParticleWave({ className = '' }: ParticleWaveProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let t = 0
    let particles: Particle[] = []
    let width = 0
    let height = 0
    let dpr = Math.min(window.devicePixelRatio || 1, 2)

    const cols = 72
    const rows = 36

    const resize = () => {
      const parent = canvas.parentElement
      width = parent?.clientWidth || window.innerWidth
      height = parent?.clientHeight || window.innerHeight
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      particles = []
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = (i / (cols - 1) - 0.5) * width * 1.15
          const y = (j / (rows - 1) - 0.5) * height * 0.72
          particles.push({ x, y, z: 0, ox: x, oy: y })
        }
      }
    }

    const draw = () => {
      t += 0.008
      ctx.clearRect(0, 0, width, height)

      const cx = width * 0.42
      const cy = height * 0.52

      for (const p of particles) {
        const nx = p.ox / width
        const ny = p.oy / height
        const wave =
          Math.sin(nx * 7.5 + t * 1.4) * 28 +
          Math.cos(ny * 9.2 - t * 1.1) * 22 +
          Math.sin((nx + ny) * 6 + t * 0.8) * 16

        const depth = 1 + Math.sin(nx * 4 + t) * 0.08
        const x = cx + p.ox * depth
        const y = cy + p.oy * 0.85 + wave

        const alpha = 0.18 + ((wave + 40) / 90) * 0.55
        const size = 1.1 + ((wave + 40) / 90) * 1.6

        ctx.beginPath()
        ctx.fillStyle = `rgba(245,245,245,${Math.max(0.08, Math.min(0.85, alpha))})`
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fill()
      }

      raf = requestAnimationFrame(draw)
    }

    resize()
    draw()
    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 ${className}`}
      aria-hidden
    />
  )
}
