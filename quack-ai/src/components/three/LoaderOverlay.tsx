import { useEffect, useState } from "react";
import { getLoadSnapshot, subscribeLoad, type LoadSnapshot } from "./loadStore";

/**
 * Drives the static `#boot-splash` (first paint) and optionally renders a
 * React fallback bar if that node was already removed. Dismisses the splash
 * when the load store reports ready.
 */
export default function LoaderOverlay() {
  const [snap, setSnap] = useState<LoadSnapshot>(getLoadSnapshot);

  useEffect(() => subscribeLoad(setSnap), []);

  useEffect(() => {
    const bar = document.querySelector<HTMLElement>("[data-boot-bar]");
    const pctEl = document.querySelector<HTMLElement>("[data-boot-pct]");
    const splash = document.getElementById("boot-splash");
    const pct = Math.min(100, Math.round(snap.progress || 8));

    if (bar) bar.style.width = `${Math.max(8, pct)}%`;
    if (pctEl) pctEl.textContent = pct.toString().padStart(3, "0");

    if (snap.ready && splash && !splash.classList.contains("is-done")) {
      splash.classList.add("is-done");
      splash.setAttribute("aria-busy", "false");
      window.setTimeout(() => splash.remove(), 700);
    }
  }, [snap]);

  // React-side fallback only if the static splash was stripped somehow.
  if (snap.ready) return null;
  if (
    typeof document !== "undefined" &&
    document.getElementById("boot-splash")
  ) {
    return null;
  }

  const pct = Math.min(100, Math.round(snap.progress));
  return (
    <div
      className="boot-loader"
      role="status"
      aria-live="polite"
      aria-busy="true"
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
