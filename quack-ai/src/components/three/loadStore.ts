/**
 * Tiny pub/sub bridging drei's `useProgress` (inside the Canvas) to the DOM
 * loader overlay (outside the Canvas).
 */

export type LoadSnapshot = {
  /** 0..100 */
  progress: number;
  /** True while the DefaultLoadingManager still has pending items. */
  active: boolean;
  /** Soft-rubber scene + assets have resolved and the min display time elapsed. */
  ready: boolean;
};

type Listener = (snap: LoadSnapshot) => void;

let snapshot: LoadSnapshot = { progress: 0, active: true, ready: false };
const listeners = new Set<Listener>();

export function getLoadSnapshot(): LoadSnapshot {
  return snapshot;
}

export function setLoadProgress(progress: number, active: boolean): void {
  snapshot = { ...snapshot, progress, active };
  for (const l of listeners) l(snapshot);
}

export function setLoadReady(ready: boolean): void {
  snapshot = { ...snapshot, ready };
  for (const l of listeners) l(snapshot);
  if (ready && typeof document !== "undefined") {
    document.documentElement.classList.remove("is-booting");
    document.documentElement.classList.add("is-ready");
    document.documentElement.style.setProperty("--boot-ready", "1");
  }
}

export function subscribeLoad(listener: Listener): () => void {
  listeners.add(listener);
  listener(snapshot);
  return () => {
    listeners.delete(listener);
  };
}

/** Eager preload of the hero glTF (also called from Duck via useGLTF.preload). */
export const DUCK_MODEL_URL = `${import.meta.env.BASE_URL}models/duck.glb`;
