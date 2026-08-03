/**
 * Tiny pub/sub bridging drei's `useProgress` (inside the Canvas) to the DOM
 * loader overlay (outside the Canvas).
 *
 * Boot completes when either:
 *   - the loading manager reports 100% idle, or
 *   - the Suspense scene mounts (`markSceneReady`), or
 *   - a hard safety timeout / WebGL failure forces completion
 * …and the minimum splash duration has elapsed (keeps the cinematic boot beat).
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

const bootStartedAt =
  typeof performance !== "undefined" ? performance.now() : Date.now();

/** Append ?boot to the URL to hold the splash longer (demo / QA). */
export const MIN_BOOT_MS =
  typeof window !== "undefined" &&
  new URLSearchParams(window.location.search).has("boot")
    ? 2400
    : 1100;

let snapshot: LoadSnapshot = { progress: 0, active: true, ready: false };
const listeners = new Set<Listener>();

let progressComplete = false;
let sceneMounted = false;
let readyOnce = false;
let readyTimer: ReturnType<typeof setTimeout> | null = null;

function emit(): void {
  for (const l of listeners) l(snapshot);
}

/** Fade out + remove the static first-paint splash node. */
export function dismissBootSplash(): void {
  if (typeof document === "undefined") return;
  const splash = document.getElementById("boot-splash");
  if (!splash || splash.classList.contains("is-done")) return;
  splash.classList.add("is-done");
  splash.setAttribute("aria-busy", "false");
  window.setTimeout(() => splash.remove(), 700);
}

function applyReadyDom(): void {
  if (typeof document === "undefined") return;
  document.documentElement.classList.remove("is-booting");
  document.documentElement.classList.add("is-ready");
  document.documentElement.style.setProperty("--boot-ready", "1");
  dismissBootSplash();
}

function scheduleReady(): void {
  if (readyOnce) return;
  if (!(progressComplete || sceneMounted)) return;

  if (readyTimer !== null) return;
  const elapsed =
    (typeof performance !== "undefined" ? performance.now() : Date.now()) -
    bootStartedAt;
  const wait = Math.max(0, MIN_BOOT_MS - elapsed);
  readyTimer = setTimeout(() => {
    readyTimer = null;
    if (readyOnce) return;
    readyOnce = true;
    snapshot = { ...snapshot, progress: 100, active: false, ready: true };
    emit();
    applyReadyDom();
  }, wait);
}

export function getLoadSnapshot(): LoadSnapshot {
  return snapshot;
}

export function setLoadProgress(progress: number, active: boolean): void {
  snapshot = { ...snapshot, progress, active };
  emit();
  if (!active && progress >= 100) {
    progressComplete = true;
    scheduleReady();
  }
}

/** Suspense resolved — assets are in the graph even if useProgress never hit 100. */
export function markSceneReady(): void {
  sceneMounted = true;
  snapshot = {
    ...snapshot,
    progress: Math.max(snapshot.progress, 100),
    active: false,
  };
  emit();
  scheduleReady();
}

/**
 * Hard complete: safety timeout, WebGL loss, or unrecoverable error.
 * Always dismisses the splash so the cinematic page is never trapped.
 */
export function forceBootComplete(): void {
  if (readyOnce) {
    dismissBootSplash();
    return;
  }
  readyOnce = true;
  if (readyTimer !== null) {
    clearTimeout(readyTimer);
    readyTimer = null;
  }
  snapshot = { progress: 100, active: false, ready: true };
  emit();
  applyReadyDom();
}

/** @deprecated prefer markSceneReady / forceBootComplete — kept for call sites */
export function setLoadReady(ready: boolean): void {
  if (ready) forceBootComplete();
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

// Inline Base.astro timeout can call this without importing the module graph.
if (typeof window !== "undefined") {
  (window as Window & { __quackForceBoot?: () => void }).__quackForceBoot =
    forceBootComplete;
}
