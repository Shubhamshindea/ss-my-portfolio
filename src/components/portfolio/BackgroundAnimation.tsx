import { useId } from "react";

const ORBS = [
  { top: "15%", left: "10%", size: 280, delay: "0s", duration: "18s" },
  { top: "60%", left: "85%", size: 360, delay: "4s", duration: "22s" },
  { top: "80%", left: "25%", size: 200, delay: "8s", duration: "20s" },
  { top: "30%", left: "70%", size: 160, delay: "2s", duration: "16s" },
];

const PARTICLES = [
  { top: "20%", left: "20%", size: 3, delay: "0s", duration: "14s" },
  { top: "35%", left: "75%", size: 2, delay: "2s", duration: "18s" },
  { top: "55%", left: "40%", size: 4, delay: "4s", duration: "16s" },
  { top: "70%", left: "60%", size: 2, delay: "1s", duration: "20s" },
  { top: "15%", left: "55%", size: 3, delay: "6s", duration: "15s" },
  { top: "85%", left: "15%", size: 2, delay: "3s", duration: "19s" },
  { top: "45%", left: "90%", size: 3, delay: "5s", duration: "17s" },
  { top: "10%", left: "85%", size: 2, delay: "7s", duration: "21s" },
  { top: "90%", left: "80%", size: 4, delay: "9s", duration: "13s" },
  { top: "25%", left: "5%", size: 2, delay: "1.5s", duration: "16s" },
  { top: "65%", left: "30%", size: 3, delay: "3.5s", duration: "19s" },
  { top: "50%", left: "50%", size: 2, delay: "5.5s", duration: "14s" },
];

/**
 * Pure CSS/SVG animated background layer.
 * Safe for SSR: all positions are deterministic constants.
 */
export function BackgroundAnimation() {
  const id = useId();
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Soft glowing orbs */}
      {ORBS.map((orb, i) => (
        <div
          key={`orb-${id}-${i}`}
          className="absolute rounded-full animate-float-slow opacity-40 dark:opacity-30"
          style={{
            top: orb.top,
            left: orb.left,
            width: orb.size,
            height: orb.size,
            background: `radial-gradient(circle, var(--gold) 0%, transparent 70%)`,
            filter: "blur(80px)",
            animationDelay: orb.delay,
            animationDuration: orb.duration,
          }}
        />
      ))}

      {/* Moving mesh gradient */}
      <div
        className="absolute inset-0 opacity-20 animate-gradient-mesh"
        style={{
          background:
            "radial-gradient(at 0% 0%, var(--gold) 0%, transparent 50%), " +
            "radial-gradient(at 100% 100%, var(--accent) 0%, transparent 50%), " +
            "radial-gradient(at 50% 50%, var(--gold-soft) 0%, transparent 60%)",
          backgroundSize: "200% 200%",
        }}
      />

      {/* Floating particles */}
      {PARTICLES.map((p, i) => (
        <div
          key={`particle-${id}-${i}`}
          className="absolute rounded-full bg-gold/60 animate-particle-float"
          style={{
            top: p.top,
            left: p.left,
            width: p.size,
            height: p.size,
            animationDelay: p.delay,
            animationDuration: p.duration,
            boxShadow: "0 0 10px var(--gold-soft)",
          }}
        />
      ))}

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(var(--gold) 1px, transparent 1px), linear-gradient(90deg, var(--gold) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />
    </div>
  );
}
