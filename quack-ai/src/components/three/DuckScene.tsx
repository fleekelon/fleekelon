import {
  Component,
  Suspense,
  useEffect,
  useRef,
  type ErrorInfo,
  type ReactNode,
  type RefObject,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Sparkles, useGLTF } from "@react-three/drei";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { PointLight } from "three";
import { Duck } from "./Duck";
import { CameraRig } from "./CameraRig";
import { ProgressBridge, SceneReady } from "./ProgressBridge";
import LoaderOverlay from "./LoaderOverlay";
import CinematicFallback from "./CinematicFallback";
import { DUCK_MODEL_URL, forceBootComplete } from "./loadStore";

gsap.registerPlugin(ScrollTrigger);

// Kick the GLB fetch as early as this module evaluates (before Canvas mount).
useGLTF.preload(DUCK_MODEL_URL);

/** Key light that drifts with the pointer so SSS catchlights read clearly. */
function FollowLight({
  pointer,
}: {
  pointer: RefObject<{ x: number; y: number }>;
}) {
  const light = useRef<PointLight>(null);
  useFrame((_, delta) => {
    if (!light.current) return;
    const tx = (pointer.current?.x ?? 0) * 3.2;
    const ty = 1.2 - (pointer.current?.y ?? 0) * 1.6;
    light.current.position.x +=
      (tx - light.current.position.x) * Math.min(1, delta * 4);
    light.current.position.y +=
      (ty - light.current.position.y) * Math.min(1, delta * 4);
  });
  return (
    <pointLight
      ref={light}
      position={[2, 1.5, 3.5]}
      intensity={2.8}
      color="#ffe0a0"
      distance={12}
      decay={2}
    />
  );
}

type BoundaryState = { failed: boolean };

/** Catch React / R3F render failures without ditching the launch aesthetic. */
class HeroBoundary extends Component<
  { children: ReactNode; onFail: () => void },
  BoundaryState
> {
  state: BoundaryState = { failed: false };

  static getDerivedStateFromError(): BoundaryState {
    return { failed: true };
  }

  componentDidCatch(_error: Error, _info: ErrorInfo): void {
    this.props.onFail();
  }

  render() {
    if (this.state.failed) return <CinematicFallback />;
    return this.props.children;
  }
}

/**
 * Sticky-hero WebGL scene + branded boot loader.
 *
 * A ScrollTrigger scrubbing `#cine` writes `progress` (0..1); CameraRig + Duck
 * consume it for the cinematic orbit. `--cine-p` is published for CSS fades.
 */
export default function DuckScene() {
  const pointer = useRef({ x: 0, y: 0 });
  const progress = useRef(0);
  const duckPose = useRef({ y: 0.15, scale: 1 });

  useEffect(() => {
    const cine = document.querySelector<HTMLElement>("#cine");
    if (!cine) return;

    const st = ScrollTrigger.create({
      trigger: cine,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.65,
      onUpdate: (self) => {
        progress.current = self.progress;
        cine.style.setProperty("--cine-p", String(self.progress));
      },
    });

    cine.style.setProperty("--cine-p", "0");
    return () => st.kill();
  }, []);

  return (
    <div className="relative h-full w-full">
      <LoaderOverlay />
      <HeroBoundary onFail={forceBootComplete}>
        <div
          className="h-full w-full"
          aria-hidden="true"
          onPointerMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            pointer.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            pointer.current.y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
          }}
        >
          <Canvas
            camera={{ position: [0, 0.55, 5.0], fov: 36 }}
            dpr={[1, 1.75]}
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: "high-performance",
            }}
            onCreated={({ gl }) => {
              const el = gl.domElement;
              const onLost = (ev: Event) => {
                ev.preventDefault();
                forceBootComplete();
              };
              el.addEventListener("webglcontextlost", onLost, false);
            }}
          >
            <fog attach="fog" args={["#0d0c09", 6.5, 13]} />
            <ambientLight intensity={0.4} />
            <directionalLight
              position={[4, 6, 3]}
              intensity={2.5}
              color="#fff4dc"
            />
            <directionalLight
              position={[-5, 2, -4]}
              intensity={1.15}
              color="#ffc400"
            />
            <pointLight position={[0, 3, -5]} intensity={2.4} color="#ff9d33" />
            <pointLight
              position={[0, -2, 4]}
              intensity={0.55}
              color="#ff8a00"
            />
            <FollowLight pointer={pointer} />

            <CameraRig progress={progress} duckPose={duckPose} />
            <ProgressBridge />

            <Suspense fallback={null}>
              <SceneReady />
              <Duck pointer={pointer} pose={duckPose} />
              <Sparkles
                count={110}
                scale={[9, 5, 6]}
                size={2.4}
                speed={0.28}
                opacity={0.55}
                color="#ffdd66"
              />
              <ContactShadows
                position={[0, -1.35, 0]}
                opacity={0.62}
                scale={10}
                blur={2.8}
                far={3.2}
                color="#000000"
              />
            </Suspense>
          </Canvas>
        </div>
      </HeroBoundary>
    </div>
  );
}
