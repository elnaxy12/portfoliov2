import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

export function useLenis(onScroll?: (scrollY: number) => void) {
  const lenisRef = useRef<Lenis | null>(null);
  const onScrollRef = useRef(onScroll);

  useEffect(() => {
    onScrollRef.current = onScroll;
  }, [onScroll]);

  useEffect(() => {
    // Inisialisasi Lenis (Sekarang aktif di semua device)
    const lenis = new Lenis({
      duration: 1.2,           // Durasi scroll (semakin besar semakin lambat/berat)
      lerp: 0.05,              // Efek licin (0.1 tipis, 0.01 sangat berat)
      wheelMultiplier: 0.6,    // Kecepatan scroll mouse
      
      // --- PENGATURAN MOBILE ---
      touchMultiplier: 1.5,    // Atur berat scroll di HP (default: 2). 
                               // Kecilkan angka ini (misal 1.0 atau 0.8) jika ingin scroll terasa lebih berat.
      
      smoothWheel: true,
      syncTouch: true,         // Menyelaraskan scroll sentuh dengan animasi Lenis
      orientation: "vertical",
      gestureOrientation: "vertical",
      prevent: (node) => node.closest("[data-lenis-prevent]") !== null,
    });

    lenisRef.current = lenis;

    lenis.on("scroll", (e: any) => {
      ScrollTrigger.update();
      onScrollRef.current?.(e.scroll);
    });

    function updateLenis(time: number) {
      lenis.raf(time * 1000);
    }

    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return lenisRef;
}