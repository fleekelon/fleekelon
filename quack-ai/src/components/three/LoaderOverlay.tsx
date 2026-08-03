import { useEffect, useState } from "react";
import { getLoadSnapshot, subscribeLoad, type LoadSnapshot } from "./loadStore";

/**
 * Branded boot splash. Mounted as a DOM sibling of the Canvas so it can cover
 * the whole sticky hero (and briefly the page) without fighting WebGL.
 */
export default function LoaderOverlay() {
  const [snap, setSnap] = useState<LoadSnapshot>(getLoadSnapshot);
  const [gone, setGone] = useState(false);

  useEffect(() => subscribeLoad(setSnap), []);

  useEffect(() => {
    if (!snap.ready) return;
    const id = window.setTimeout(() => setGone(true), 700);
    return () => window.clearTimeout(id);
  }, [snap.ready]);

  if (gone) return null;

  const pct = Math.min(100, Math.round(snap.progress));

  return (
    <div
      className={`boot-loader${snap.ready ? " is-done" : ""}`}
      role="status"
      aria-live="polite"
      aria-busy={!snap.ready}
    >
      <div className="boot-loader__inner">
        <p className="boot-loader__eyebrow">QUACK-1 · BOOT SEQUENCE</p>
        <p className="boot-loader__title">正在装填开放权重</p>
        <div className="boot-loader__bar" aria-hidden="true">
          <span style={{ width: `${pct}%` }} />
        </div>
        <p className="boot-loader__pct font-mono">
          {pct.toString().padStart(3, "0")}%
          <span className="text-cream-dim">
            {" "}
            · {snap.active ? "拉取模型" : "编译着色器"}
          </span>
        </p>
      </div>
    </div>
  );
}
