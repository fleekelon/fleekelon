import { useEffect, useMemo, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { Center, useGLTF } from "@react-three/drei";
import type { Group, Mesh, Object3D, Texture } from "three";
import { createSoftRubberMaterial } from "./SoftRubberMaterial";
import { DUCK_MODEL_URL } from "./loadStore";

export type DuckPose = { y: number; scale: number };

type DuckProps = {
  pointer: RefObject<{ x: number; y: number }>;
  /** Scroll-driven yaw / scale, written by CameraRig each frame. */
  pose: RefObject<DuckPose>;
};

/**
 * Khronos sample Duck glTF, re-skinned with the soft-rubber SSS material.
 * Pointer tilt + scroll-driven yaw/scale live on the outer group.
 */
export function Duck({ pointer, pose }: DuckProps) {
  const group = useRef<Group>(null);
  const { scene } = useGLTF(DUCK_MODEL_URL);

  const prepared = useMemo(() => {
    const root = scene.clone(true);
    root.traverse((obj: Object3D) => {
      const mesh = obj as Mesh;
      if (!mesh.isMesh) return;
      const prev = mesh.material;
      let map: Texture | null = null;
      if (prev && !Array.isArray(prev) && "map" in prev) {
        const candidate = prev.map;
        if (
          candidate &&
          typeof candidate === "object" &&
          "isTexture" in candidate
        ) {
          map = candidate as Texture;
        }
      }
      mesh.material = createSoftRubberMaterial({
        color: "#ffc400",
        map,
        subsurfaceColor: "#ff6a00",
        wrap: 0.42,
        strength: 0.68,
        power: 3.0,
        distortion: 0.2,
      });
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    });
    return root;
  }, [scene]);

  useEffect(() => {
    return () => {
      prepared.traverse((obj: Object3D) => {
        const mesh = obj as Mesh;
        if (mesh.isMesh && mesh.material) {
          const mats = Array.isArray(mesh.material)
            ? mesh.material
            : [mesh.material];
          for (const m of mats) m.dispose();
        }
      });
    };
  }, [prepared]);

  useFrame((state, delta) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    const scrollY = pose.current?.y ?? 0;
    const scrollScale = pose.current?.scale ?? 1;
    const px = pointer.current?.x ?? 0;
    const py = pointer.current?.y ?? 0;
    const targetY = scrollY + px * 0.35 + Math.sin(t * 0.4) * 0.12;
    const targetX = -py * 0.22;
    group.current.rotation.y +=
      (targetY - group.current.rotation.y) * Math.min(1, delta * 3.2);
    group.current.rotation.x +=
      (targetX - group.current.rotation.x) * Math.min(1, delta * 3.2);
    group.current.position.y = Math.sin(t * 1.1) * 0.05;
    const s = scrollScale;
    group.current.scale.setScalar(
      group.current.scale.x +
        (s - group.current.scale.x) * Math.min(1, delta * 4),
    );
  });

  return (
    <group ref={group} position={[0, -0.35, 0]}>
      <Center>
        <primitive object={prepared} scale={2.35} />
      </Center>
    </group>
  );
}

useGLTF.preload(DUCK_MODEL_URL);
