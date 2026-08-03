import { useState } from 'react';

const PRESETS = [
  { label: 'Deterministic', t: '0.1', output: 'Quack' },
  { label: 'Balanced', t: '1', output: 'Quack.' },
  { label: 'Creative', t: '10', output: 'Quack?!' },
] as const;

/**
 * Sampling-temperature demo. Whatever you set, the distribution
 * collapses onto the same token. That is called alignment.
 */
export default function TemperatureLab() {
  const [index, setIndex] = useState(1);
  const preset = PRESETS[index]!;

  return (
    <div className="card p-6">
      <p className="eyebrow mb-6">sampling lab · temperature control</p>
      <input
        type="range"
        min={0}
        max={PRESETS.length - 1}
        step={1}
        value={index}
        onChange={(e) => setIndex(Number(e.target.value))}
        className="w-full accent-[#ffc400]"
        aria-label="Temperature"
      />
      <div className="mt-3 flex justify-between font-mono text-xs text-cream-dim">
        {PRESETS.map((p, i) => (
          <button
            key={p.label}
            type="button"
            onClick={() => setIndex(i)}
            className={i === index ? 'text-accent' : ''}
          >
            {p.label} T={p.t}
          </button>
        ))}
      </div>
      <div className="mt-8 rounded-xl border border-cream/10 bg-ink p-5 font-mono text-sm">
        <p className="text-cream-dim">sample(prompt, temperature={preset.t})</p>
        <p className="mt-2 text-2xl text-accent">“{preset.output}”</p>
        <p className="mt-3 text-xs text-cream-dim">
          Output variance: 0.00 · Confidence: 100% · Hallucination rate: n/a (it is a duck)
        </p>
      </div>
    </div>
  );
}
