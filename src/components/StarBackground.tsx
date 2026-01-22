"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

type Star = {
  x: number;
  y: number;
  size: number;
  brightness: number;
  fancy: boolean;
};

type ShootingStar = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
};

export default function StarBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // ⛔ Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || resolvedTheme !== "dark") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let lastTime = 0;

    const stars: Star[] = [];
    const shootingStars: ShootingStar[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    // 🌌 Create background stars
    stars.length = 0;
    for (let i = 0; i < 140; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.4 + 0.6,
        brightness: Math.random() * 0.6 + 0.3,
        fancy: Math.random() < 0.15, // ⭐ only 15% are cross-stars
      });
    }

    const spawnShootingStar = () => {
      shootingStars.push({
        x: Math.random() * canvas.width * 0.8,
        y: Math.random() * canvas.height * 0.3,
        vx: Math.random() * 8 + 10,
        vy: Math.random() * 4 + 6,
        life: 0,
      });
    };

    const draw = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;

      // Throttle to ~60 FPS
      if (delta < 16) {
        animationId = requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // ✨ Draw stars
      for (const s of stars) {
        s.brightness += (Math.random() - 0.5) * 0.02;
        s.brightness = Math.max(0.2, Math.min(1, s.brightness));

        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.shadowColor = "rgba(255,255,255,0.8)";
        ctx.shadowBlur = s.fancy ? 14 : 8;

        if (s.fancy) {
          ctx.strokeStyle = `rgba(255,255,255,${s.brightness})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(-s.size * 2, 0);
          ctx.lineTo(s.size * 2, 0);
          ctx.moveTo(0, -s.size * 2);
          ctx.lineTo(0, s.size * 2);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, s.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${s.brightness})`;
          ctx.fill();
        }

        ctx.restore();
      }

      // 🌠 Shooting stars (rare)
      if (Math.random() < 0.004 && shootingStars.length < 2) {
        spawnShootingStar();
      }

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const sh = shootingStars[i];

        ctx.save();
        ctx.strokeStyle = "rgba(255,255,255,0.8)";
        ctx.lineWidth = 2;
        ctx.shadowColor = "rgba(255,255,255,0.9)";
        ctx.shadowBlur = 20;

        ctx.beginPath();
        ctx.moveTo(sh.x, sh.y);
        ctx.lineTo(sh.x - sh.vx * 3, sh.y - sh.vy * 3);
        ctx.stroke();
        ctx.restore();

        sh.x += sh.vx;
        sh.y += sh.vy;
        sh.life++;

        if (sh.life > 30) shootingStars.splice(i, 1);
      }

      animationId = requestAnimationFrame(draw);
    };

    animationId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, [mounted, resolvedTheme]);

  if (!mounted || resolvedTheme !== "dark") return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="fixed inset-0 -z-10 pointer-events-none"
    />
  );
}