"use client";

import React from "react";
import { motion } from "framer-motion";

export function BackgroundAnimation() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Primary Gradient Orb - Top Right */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-[20%] -right-[10%] w-[80vw] h-[80vw] bg-primary/5 rounded-full blur-[120px]"
      />

      {/* Secondary Gradient Orb - Bottom Left */}
      <motion.div
        animate={{
          x: [0, -50, 0],
          y: [0, 100, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        className="absolute -bottom-[20%] -left-[10%] w-[70vw] h-[70vw] bg-emerald-500/10 rounded-full blur-[100px]"
      />

      {/* Accent Orb - Center/Moving */}
      <motion.div
        animate={{
          x: [-200, 200, -200],
          y: [-100, 100, -100],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] bg-blue-500/5 rounded-full blur-[80px]"
      />
      
      {/* Floating Particles/Dust */}
      {[...Array(20)].map((_, i) => (
        <motion.div
            key={i}
            initial={{
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
                opacity: 0,
            }}
            animate={{
                y: [null, Math.random() * -100],
                opacity: [0, 0.5, 0],
            }}
            transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                ease: "linear",
                delay: Math.random() * 20,
            }}
            className="absolute w-1 h-1 bg-primary/20 rounded-full"
        />
      ))}
    </div>
  );
}
