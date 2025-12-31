"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export function BackgroundAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    let animationFrameId: number;

    const particles: Particle[] = [];
    const particleCount = Math.min(Math.floor((w * h) / 15000), 100); 
    const connectionDistance = 150;
    const mouseDistance = 150;

    const mouse = { x: -1000, y: -1000 };

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;

      constructor() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 1;
        // Light Theme: Emerald
        this.color = `rgba(16, 185, 129, ${Math.random() * 0.5 + 0.1})`; 
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > w) this.vx *= -1;
        if (this.y < 0 || this.y > h) this.vy *= -1;

        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouseDistance) {
            const forceDirectionX = dx / dist;
            const forceDirectionY = dy / dist;
            const force = (mouseDistance - dist) / mouseDistance;
            const repulsionStrength = 0.6; 
            this.vx -= forceDirectionX * force * repulsionStrength;
            this.vy -= forceDirectionY * force * repulsionStrength;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    const animate = () => {
        if (!ctx) return;
        ctx.clearRect(0, 0, w, h);

        particles.forEach((p, index) => {
            p.update();
            p.draw();

            for (let j = index + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < connectionDistance) {
                    ctx.beginPath();
                    // Light Theme Lines
                    ctx.strokeStyle = `rgba(16, 185, 129, ${0.15 * (1 - dist / connectionDistance)})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        });

        animationFrameId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    animate();

    return () => {
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("mousemove", handleMouseMove);
        cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 top-0 left-0 -z-50 overflow-hidden bg-white pointer-events-none">
      {/* 1. Subtle Light Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.4]"
        style={{
            backgroundImage: 'radial-gradient(rgb(16 185 129 / 0.3) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
        }}
      />

      {/* 2. Light Theme Orbs */}
      <motion.div
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute -top-[10%] -left-[10%] w-[60vw] h-[60vw] bg-emerald-500/10 rounded-full blur-[100px] mix-blend-multiply"
      />
      <motion.div
        animate={{
          x: [0, -30, 0],
          y: [0, -50, 0],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
          delay: 5,
        }}
        className="absolute top-[20%] -right-[10%] w-[50vw] h-[50vw] bg-teal-500/10 rounded-full blur-[120px] mix-blend-multiply"
      />
      
      {/* 3. Canvas Layer */}
      <canvas ref={canvasRef} className="absolute inset-0" />
      
      {/* 4. Light Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(255,255,255,0.8)_100%)] opacity-50" />
    </div>
  );
}
