import { useRef, useCallback } from "react";

export function useBallAnimation() {
  const ballRef = useRef<HTMLDivElement>(null);

  const updateBall = useCallback(
    (progress: number, startAt = 0.0, duration = 1, maxScale = 180) => {
      if (!ballRef.current) return;
      const ballProgress = Math.max(0, (progress - startAt) / duration);
      const scale = ballProgress * maxScale;
      ballRef.current.style.transform = `translate(-50%, -50%) scale(${scale})`;
      ballRef.current.style.opacity = ballProgress > 0 ? "1" : "0";
    },
    [],
  );

  return { ballRef, updateBall };
}
