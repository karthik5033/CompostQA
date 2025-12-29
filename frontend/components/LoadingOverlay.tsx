import React from "react";
import { motion } from "framer-motion";
import { Leaf, Sprout, Wind, Loader2 } from "lucide-react";

export function LoadingOverlay() {
  return (
    <div className="absolute inset-0 z-50 glass flex flex-col items-center justify-center backdrop-blur-md bg-background/50">
       <div className="relative">
          <motion.div
             animate={{ rotate: 360 }}
             transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
             className="absolute inset-0 rounded-full border-4 border-dashed border-primary/20 w-32 h-32"
          />
          <motion.div
             animate={{ rotate: -360 }}
             transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
             className="absolute inset-2 rounded-full border-4 border-dashed border-emerald-500/20 w-28 h-28"
          />
          <div className="w-32 h-32 flex items-center justify-center relative">
             <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
             >
                <Leaf className="h-12 w-12 text-primary" />
             </motion.div>
          </div>
       </div>
       <motion.h3 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-black mt-8 bg-clip-text text-transparent bg-gradient-to-r from-primary to-emerald-800"
       >
          ANALYZING SOIL MATRIX
       </motion.h3>
       <div className="flex gap-2 mt-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">
          <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ delay: 0, duration: 1.5, repeat: Infinity }}>Measuring</motion.span>
          <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ delay: 0.5, duration: 1.5, repeat: Infinity }}>Processing</motion.span>
          <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ delay: 1, duration: 1.5, repeat: Infinity }}>Optimizing</motion.span>
       </div>
    </div>
  );
}
