import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const DynamicBackground = () => {
  // Memoize random lines so they don't jump around on re-renders
  const horizontalLines = useMemo(() => Array.from({ length: 15 }).map(() => ({
    top: `${Math.random() * 100}%`,
    duration: 3 + Math.random() * 5,
    delay: Math.random() * 4,
    yOffset: Math.random() * 30 - 15,
    opacityBase: 0.3 + Math.random() * 0.7,
    thickness: Math.random() > 0.8 ? '3px' : '1px' // Some lines are thicker
  })), []);

  const verticalLines = useMemo(() => Array.from({ length: 15 }).map(() => ({
    left: `${Math.random() * 100}%`,
    duration: 3 + Math.random() * 5,
    delay: Math.random() * 4,
    xOffset: Math.random() * 30 - 15,
    opacityBase: 0.3 + Math.random() * 0.7,
    thickness: Math.random() > 0.8 ? '3px' : '1px'
  })), []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#020617]">
      {/* Deep dark tech gradient base */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#020617] via-[#09152B] to-[#020617]"></div>
      
      {/* Horizontal Lasers */}
      {horizontalLines.map((line, i) => (
        <motion.div
          key={`h-${i}`}
          className="absolute left-0 right-0 bg-blue-400"
          style={{
            top: line.top,
            height: line.thickness,
            boxShadow: '0 0 20px 2px rgba(96, 165, 250, 0.9), 0 0 40px 5px rgba(59, 130, 246, 0.4)'
          }}
          animate={{
            opacity: [0, line.opacityBase, 0],
            scaleY: [1, 1.5, 1],
            y: [0, line.yOffset, 0]
          }}
          transition={{
            duration: line.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: line.delay
          }}
        />
      ))}

      {/* Vertical Lasers */}
      {verticalLines.map((line, i) => (
        <motion.div
          key={`v-${i}`}
          className="absolute top-0 bottom-0 bg-cyan-300"
          style={{
            left: line.left,
            width: line.thickness,
            boxShadow: '0 0 20px 2px rgba(34, 211, 238, 0.9), 0 0 40px 5px rgba(6, 182, 212, 0.4)'
          }}
          animate={{
            opacity: [0, line.opacityBase, 0],
            scaleX: [1, 1.5, 1],
            x: [0, line.xOffset, 0]
          }}
          transition={{
            duration: line.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: line.delay
          }}
        />
      ))}
      
      {/* Ambient glowing flares at intersections */}
      <motion.div 
        animate={{ opacity: [0.1, 0.6, 0.1], scale: [0.8, 1.3, 0.8] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[25%] left-[35%] w-64 h-64 bg-cyan-400/20 rounded-full blur-[80px] mix-blend-screen"
      />
      <motion.div 
        animate={{ opacity: [0.1, 0.5, 0.1], scale: [0.9, 1.6, 0.9] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-[25%] right-[25%] w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] mix-blend-screen"
      />
      <motion.div 
        animate={{ opacity: [0.1, 0.7, 0.1], scale: [0.7, 1.2, 0.7] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-[60%] left-[20%] w-48 h-48 bg-indigo-500/20 rounded-full blur-[60px] mix-blend-screen"
      />
    </div>
  );
};

export default DynamicBackground;
