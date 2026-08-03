import { useEffect, useRef } from "react";
import { useProgress } from "@react-three/drei";
import { setLoadProgress, setLoadReady } from "./loadStore";

const MIN_DISPLAY_MS = 900;

/**
 * Lives inside the R3F Canvas. Mirrors drei's DefaultLoadingManager progress
 * into the DOM-side load store. `ready` is flipped only after:
 *   1. progress has reached 100 (normally via `<SceneReady />` inside Suspense)
 *   2. the manager is idle
 *   3. a minimum splash duration has elapsed (avoids a one-frame flash)
 */
export function ProgressBridge() {
  const { progress, active } = useProgress();
  const startedAt = useRef(performance.now());
  const readyOnce = useRef(false);

  useEffect(() => {
    setLoadProgress(progress, active);

    if (readyOnce.current) return;
    if (active || progress < 100) return;

    const elapsed = performance.now() - startedAt.current;
    const wait = Math.max(0, MIN_DISPLAY_MS - elapsed);
    const id = window.setTimeout(() => {
      readyOnce.current = true;
      setLoadReady(true);
    }, wait);
    return () => window.clearTimeout(id);
  }, [progress, active]);

  return null;
}

/**
 * Mount inside `<Suspense>` next to the duck. Its presence means the async
 * boundary has resolved — force the load store to 100% even when the GLB was
 * served from cache and drei never reported a download.
 */
export function SceneReady() {
  useEffect(() => {
    setLoadProgress(100, false);
  }, []);
  return null;
}
