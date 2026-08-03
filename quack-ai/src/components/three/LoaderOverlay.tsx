import { useEffect, useState } from "react";
import { getLoadSnapshot, subscribeLoad, type LoadSnapshot } from "./loadStore";

/**
 * Drives the static `#boot-splash` progress bar (first paint). Dismissal is
 * owned by `loadStore` (ready / force) so React remounts cannot re-trap the UI.
 */
export default function LoaderOverlay() {
  const [snap, setSnap] = useState<LoadSnapshot>(getLoadSnapshot);

  useEffect(() => subscribeLoad(setSnap), []);

  useEffect(() => {
    const bar = document.querySelector<HTMLElement>("[data-boot-bar]");
    const pctEl = document.querySelector<HTMLElement>("[data-boot-pct]");
    const pct = Math.min(100, Math.round(snap.progress || 8));

    if (bar) bar.style.width = `${Math.max(8, pct)}%`;
    if (pctEl) pctEl.textContent = pct.toString().padStart(3, "0");
  }, [snap]);

  // Static splash owns the chrome; React only mirrors progress into it.
  return null;
}
