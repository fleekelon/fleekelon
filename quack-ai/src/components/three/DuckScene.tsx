import { Suspense, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Sparkles } from "@react-three/drei";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Duck } from "./Duck";
import { CameraRig } from "./CameraRig";

gsap.registerPlugin(ScrollTrigger);

/**
 * Sticky-hero WebGL scene.
 *
 * Mounted inside a `position: sticky` viewport. A ScrollTrigger scrubbing the
 * parent `#cine` section writes `progress` (0..1); CameraRig + Duck consume it
 * for the cinematic orbit. A CSS var `--cine-p` is also published so the hero
 * copy can fade/slide in pure CSS.
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
        gl={{ antialias: true, alpha: true }}
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
        <pointLight position={[0, -2, 4]} intensity={0.55} color="#ff8a00" />

        <CameraRig progress={progress} duckPose={duckPose} />

        <Suspense fallback={null}>
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
  );
}
