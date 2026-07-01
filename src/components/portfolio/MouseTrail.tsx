import { useEffect, useRef } from "react";

/**
 * GSAP TweenMax-powered gold cursor trail.
 * Uses the CSS var --gold so it automatically retints when the theme changes.
 */
export function MouseTrail() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Skip on touch / reduced-motion
    if (window.matchMedia("(hover: none)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const container = containerRef.current;
    if (!container) return;

    const DOT_COUNT = 18;
    const dots: HTMLDivElement[] = [];
    for (let i = 0; i < DOT_COUNT; i++) {
      const d = document.createElement("div");
      const size = Math.max(4, 16 - i * 0.6);
      d.style.cssText = `
        position: fixed; top: 0; left: 0;
        width: ${size}px; height: ${size}px;
        border-radius: 999px;
        background: var(--gold);
        opacity: ${1 - i / DOT_COUNT};
        pointer-events: none;
        transform: translate(-50%, -50%);
        mix-blend-mode: screen;
        box-shadow: 0 0 12px var(--gold-soft);
        z-index: 9999;
        will-change: transform;
      `;
      container.appendChild(d);
      dots.push(d);
    }

    const positions = Array.from({ length: DOT_COUNT }, () => ({ x: -100, y: -100 }));
    let mouseX = -100;
    let mouseY = -100;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    let rafId = 0;
    const ensureLoaded = () =>
      new Promise<any>((resolve) => {
        const w = window as any;
        if (w.TweenMax) return resolve(w.TweenMax);
        const check = () => {
          if ((window as any).TweenMax) resolve((window as any).TweenMax);
          else setTimeout(check, 100);
        };
        check();
      });

    let cancelled = false;
    ensureLoaded().then((TweenMax) => {
      if (cancelled) return;
      const tick = () => {
        let px = mouseX;
        let py = mouseY;
        positions.forEach((pos, i) => {
          const next = positions[i + 1] ?? { x: px, y: py };
          pos.x += (px - pos.x) * 0.35;
          pos.y += (py - pos.y) * 0.35;
          TweenMax.set(dots[i], { x: pos.x, y: pos.y });
          px = pos.x;
          py = pos.y;
          void next;
        });
        rafId = requestAnimationFrame(tick);
      };
      tick();
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove);
      dots.forEach((d) => d.remove());
    };
  }, []);

  return <div ref={containerRef} aria-hidden className="pointer-events-none" />;
}
