import { useRef, type RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import { lerpKeys } from "./scrollProgress";
import type { DuckPose } from "./Duck";

type Props = {
  /** Mutable ref written by the sticky-hero ScrollTrigger. */
  progress: RefObject<number>;
  /** Mutable ref receiving the current duckY / scale for the Duck. */
  duckPose: RefObject<DuckPose>;
};

/**
 * Scrubs the camera along CAMERA_KEYS every frame, using the cinematic
 * scroll progress. Look-at is applied via a scratch Vector3 to avoid GC.
 */
export function CameraRig({ progress, duckPose }: Props) {
  const { camera } = useThree();
  const look = useRef(new Vector3());
  const pos = useRef(new Vector3());

  useFrame((_, delta) => {
    const key = lerpKeys(progress.current ?? 0);
    pos.current.set(...key.pos);
    // Soft follow so scrubbing feels cinematic rather than locked-to-scroll.
    camera.position.lerp(pos.current, Math.min(1, delta * 3.5));
    look.current.set(...key.look);
    camera.lookAt(look.current);
    if (duckPose.current) {
      duckPose.current.y = key.duckY;
      duckPose.current.scale = key.scale;
    }
  });

  return null;
}
