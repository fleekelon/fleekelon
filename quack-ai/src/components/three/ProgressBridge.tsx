import { useEffect } from "react";
import { useProgress } from "@react-three/drei";
import { markSceneReady, setLoadProgress } from "./loadStore";

/**
 * Lives inside the R3F Canvas. Mirrors drei's DefaultLoadingManager progress
 * into the DOM-side load store. Ready is decided in `loadStore` once either
 * progress hits 100% idle or `<SceneReady />` mounts inside Suspense.
 */
export function ProgressBridge() {
  const { progress, active } = useProgress();

  useEffect(() => {
    setLoadProgress(progress, active);
  }, [progress, active]);

  return null;
}

/**
 * Mount inside `<Suspense>` next to the duck. Presence means the async
 * boundary resolved — even when the GLB was cache-served and drei never
 * reported a download, boot can finish on schedule.
 */
export function SceneReady() {
  useEffect(() => {
    markSceneReady();
  }, []);
  return null;
}
