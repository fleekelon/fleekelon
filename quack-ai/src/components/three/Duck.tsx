import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshPhysicalMaterial, type Group } from "three";

const BODY_YELLOW = "#ffc400";
const BEAK_ORANGE = "#ff8a00";

/**
 * Procedural rubber duck assembled from primitives.
 * Placeholder for a sculpted / scanned model later — the scene graph and
 * material setup stay the same when the geometry is swapped.
 */
export function Duck(props: { pointer: { x: number; y: number } }) {
  const group = useRef<Group>(null);

  // Clearcoated "soft rubber" look shared by all yellow parts.
  const bodyMaterial = useMemo(
    () =>
      new MeshPhysicalMaterial({
        color: BODY_YELLOW,
        roughness: 0.38,
        clearcoat: 0.85,
        clearcoatRoughness: 0.35,
        sheen: 0.4,
        sheenColor: "#fff2c0",
      }),
    [],
  );

  const beakMaterial = useMemo(
    () =>
      new MeshPhysicalMaterial({
        color: BEAK_ORANGE,
        roughness: 0.3,
        clearcoat: 1,
        clearcoatRoughness: 0.2,
      }),
    [],
  );

  useFrame((state, delta) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    // Idle bobbing + gentle pointer-follow tilt.
    const targetY = props.pointer.x * 0.55 + Math.sin(t * 0.4) * 0.25;
    const targetX = -props.pointer.y * 0.3;
    group.current.rotation.y +=
      (targetY - group.current.rotation.y) * Math.min(1, delta * 3);
    group.current.rotation.x +=
      (targetX - group.current.rotation.x) * Math.min(1, delta * 3);
    group.current.position.y = Math.sin(t * 1.1) * 0.06;
  });

  return (
    <group ref={group} {...{ position: [0, -0.2, 0] }}>
      {/* Body */}
      <mesh
        position={[0, 0, 0]}
        scale={[1.15, 0.85, 1.35]}
        material={bodyMaterial}
      >
        <sphereGeometry args={[1, 64, 64]} />
      </mesh>
      {/* Tail bump */}
      <mesh
        position={[0, 0.35, -1.15]}
        rotation={[0.9, 0, 0]}
        scale={[0.45, 0.5, 0.45]}
        material={bodyMaterial}
      >
        <sphereGeometry args={[1, 32, 32]} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 1.05, 0.55]} material={bodyMaterial}>
        <sphereGeometry args={[0.62, 64, 64]} />
      </mesh>
      {/* Beak */}
      <mesh
        position={[0, 0.95, 1.15]}
        rotation={[Math.PI / 2.15, 0, 0]}
        scale={[1, 0.55, 1]}
        material={beakMaterial}
      >
        <coneGeometry args={[0.28, 0.5, 32]} />
      </mesh>
      {/* Eyes */}
      <mesh position={[-0.26, 1.28, 0.98]}>
        <sphereGeometry args={[0.07, 24, 24]} />
        <meshPhysicalMaterial color="#151310" roughness={0.05} clearcoat={1} />
      </mesh>
      <mesh position={[0.26, 1.28, 0.98]}>
        <sphereGeometry args={[0.07, 24, 24]} />
        <meshPhysicalMaterial color="#151310" roughness={0.05} clearcoat={1} />
      </mesh>
    </group>
  );
}
