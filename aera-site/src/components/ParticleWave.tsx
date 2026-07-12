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
          Math.sin(nx * 8.2 + t * 1.55) * 42 +
          Math.cos(ny * 10.4 - t * 1.2) * 30 +
          Math.sin((nx + ny) * 5.5 + t * 0.9) * 20

        const depth = 1 + Math.sin(nx * 4 + t) * 0.1
        const x = cx + p.ox * depth
        const y = cy + p.oy * 0.82 + wave

        const alpha = 0.22 + ((wave + 55) / 110) * 0.65
        const size = 1.25 + ((wave + 55) / 110) * 2.1

        ctx.beginPath()
        ctx.fillStyle = `rgba(245,245,245,${Math.max(0.12, Math.min(0.95, alpha))})`
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
