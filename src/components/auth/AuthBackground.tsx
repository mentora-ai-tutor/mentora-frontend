"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speed: number;
  delay: number;
  color: string;
}

export default function AuthBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const particles: Array<{
      x: number; y: number; vy: number; vx: number;
      size: number; opacity: number; color: string;
    }> = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Spawn particles
    const colors = ["#0D9488", "#14b8a6", "#B45309", "#f59e0b", "#2dd4bf"];
    for (let i = 0; i < 35; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight + window.innerHeight,
        vy: -(0.3 + Math.random() * 0.7),
        vx: (Math.random() - 0.5) * 0.4,
        size: 1.5 + Math.random() * 3,
        opacity: 0,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.y += p.vy;
        p.x += p.vx;
        p.opacity = Math.min(p.opacity + 0.005, 0.7);
        if (p.y < -20) {
          p.y = canvas.height + 20;
          p.x = Math.random() * canvas.width;
          p.opacity = 0;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle =
          p.color + Math.round(p.opacity * 255).toString(16).padStart(2, "0");
        ctx.fill();
      });

      animationId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Deep gradient base */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A] via-[#0f2320] to-[#1a0c05]" />

      {/* Mesh overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(13,148,136,0.8) 1px, transparent 1px),
            linear-gradient(90deg, rgba(13,148,136,0.8) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Large ambient orbs */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-teal-600/20 blur-[120px] animate-glow-pulse" />
      <div className="absolute -bottom-60 -right-40 w-[700px] h-[700px] rounded-full bg-amber-700/15 blur-[140px] animate-glow-pulse delay-700" />
      <div className="absolute top-1/2 -translate-y-1/2 left-1/3 w-[400px] h-[400px] rounded-full bg-teal-500/10 blur-[100px] animate-glow-pulse delay-500" />

      {/* Floating geometric shapes */}
      <div className="absolute top-[15%] left-[8%] w-20 h-20 border border-teal-500/30 rounded-2xl rotate-12 animate-float backdrop-blur-sm" />
      <div className="absolute top-[35%] right-[6%] w-14 h-14 border border-amber-500/30 rounded-full animate-float-delayed" />
      <div className="absolute bottom-[20%] left-[12%] w-10 h-10 border border-teal-400/20 rounded-lg rotate-45 animate-float delay-300" />
      <div className="absolute top-[60%] right-[18%] w-8 h-8 border border-amber-400/25 rounded-sm rotate-12 animate-float-delayed delay-200" />
      <div className="absolute top-[8%] right-[25%] w-6 h-6 bg-teal-500/20 rounded-full animate-bounce-subtle" />
      <div className="absolute bottom-[35%] right-[10%] w-4 h-4 bg-amber-500/20 rounded-full animate-bounce-subtle delay-400" />

      {/* Particle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 opacity-80" />

      {/* Subtle vignette */}
      <div className="absolute inset-0 bg-radial-[ellipse_at_center] from-transparent to-[#0F172A]/60" />
    </div>
  );
}
