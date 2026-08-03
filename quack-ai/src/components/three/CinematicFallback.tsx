/**
 * Still-cinematic hero when WebGL is unavailable.
 * No plastic "error box" — keep the launch-film atmosphere.
 */
export default function CinematicFallback() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      <div
        className="glow top-1/3 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/3"
        aria-hidden="true"
      />
      <div
        className="ghost-title absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        aria-hidden="true"
      >
        QUACK-1
      </div>
      <div className="relative z-10 text-center">
        <p className="eyebrow mb-4">WEBGL · OFFLINE MODE</p>
        <p className="font-mono text-sm tracking-[0.2em] text-accent">
          模型在浴缸里。视觉管线稍后归队。
        </p>
      </div>
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse at 50% 60%, rgb(255 196 0 / 0.18), transparent 55%)",
        }}
        aria-hidden="true"
      />
    </div>
  );
}
