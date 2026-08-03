import { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows, Float } from '@react-three/drei';
import { Duck } from './Duck';

/**
 * Hero WebGL scene. Rendered as a client-only Astro island.
 * Lighting is fully local (no HDR/network fetch) so the scaffold works offline.
 */
export default function DuckScene() {
  const pointer = useRef({ x: 0, y: 0 });

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
      <Canvas camera={{ position: [0, 0.6, 5.2], fov: 38 }} dpr={[1, 2]}>
        <ambientLight intensity={0.55} />
        <directionalLight position={[4, 6, 3]} intensity={2.2} color="#fff4dc" />
        <directionalLight position={[-5, 2, -4]} intensity={0.8} color="#ffc400" />
        <pointLight position={[0, -2, 4]} intensity={0.5} color="#ff8a00" />
        <Suspense fallback={null}>
          <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.4}>
            <Duck pointer={pointer.current} />
          </Float>
          <ContactShadows position={[0, -1.45, 0]} opacity={0.55} scale={8} blur={2.6} far={3} />
        </Suspense>
      </Canvas>
    </div>
  );
}
