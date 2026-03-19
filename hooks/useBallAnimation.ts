import { useRef, useCallback } from "react";

export function useBallAnimation() {
  const ballRef = useRef<HTMLDivElement>(null);

  const updateBall = useCallback(
    (progress: number, startAt = 0.0, duration = 1, maxScale = 180) => {
      if (!ballRef.current) return;
      const ballProgress = Math.max(0, (progress - startAt) / duration);

      // Fase 1: naik dari bawah ke tengah (0 - 0.3)
      const moveProgress = Math.min(ballProgress / 0.3, 1);
      const currentY = 100 - moveProgress * 50; // 100vh → 50vh

      // Fase 2: jeda di tengah (0.3 - 0.5) → tidak ada yang berubah

      // Fase 3: membesar setelah jeda (0.5 - 1)
      const scaleProgress = Math.max(0, (ballProgress - 0.5) / 0.5);
      const scale = 1 + scaleProgress * maxScale;

      ballRef.current.style.top = `${currentY}vh`;
      ballRef.current.style.transform = `translate(-50%, -50%) scale(${scale})`;
      ballRef.current.style.opacity = "1";
    },
    [],
  );

  return { ballRef, updateBall };
}
