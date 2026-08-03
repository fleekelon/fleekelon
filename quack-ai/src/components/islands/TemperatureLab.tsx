import { useState } from "react";

const PRESETS = [
  { label: "确定性", t: "0.1", output: "呱" },
  { label: "均衡", t: "1", output: "呱。" },
  { label: "创意", t: "10", output: "呱?!" },
] as const;

/**
 * Sampling-temperature demo. Whatever you set, the distribution
 * collapses onto the same token. That is called alignment.
 */
export default function TemperatureLab() {
  const [index, setIndex] = useState(1);
  const preset = PRESETS[index] ?? PRESETS[1];
  const fill = `${(index / (PRESETS.length - 1)) * 100}%`;

  return (
    <div className="card p-6">
      <p className="eyebrow mb-6">采样实验台 · 温度控制</p>
      <input
        type="range"
        min={0}
        max={PRESETS.length - 1}
        step={1}
        value={index}
        onChange={(e) => setIndex(Number(e.target.value))}
        className="slider"
        style={{ "--slider-fill": fill } as React.CSSProperties}
        aria-label="温度"
      />
      <div className="mt-4 flex justify-between font-mono text-xs text-cream-dim">
        {PRESETS.map((p, i) => (
          <button
            key={p.label}
            type="button"
            onClick={() => setIndex(i)}
            className={i === index ? "text-accent" : ""}
          >
            {p.label} T={p.t}
          </button>
        ))}
      </div>
      <div className="mt-8 rounded-xl border border-cream/10 bg-ink p-5 font-mono text-sm">
        <p className="text-cream-dim">sample(prompt, temperature={preset.t})</p>
        <p className="mt-2 text-2xl text-accent">"{preset.output}"</p>
        <p className="mt-3 text-xs text-cream-dim">
          输出方差:0.00 · 置信度:100% · 幻觉率:不适用(它是一只鸭子)
        </p>
      </div>
    </div>
  );
}
