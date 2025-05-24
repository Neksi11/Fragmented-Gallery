
"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface CursorFollowEffectProps {
  isActive: boolean;
}

const CursorFollowEffect: React.FC<CursorFollowEffectProps> = ({ isActive }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('mousemove', updateMousePosition);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('mousemove', updateMousePosition);
      }
    };
  }, []);

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          style={{
            position: 'fixed',
            pointerEvents: 'none',
            zIndex: 10000, // Ensure it's above most other content
            left: 0, // Necessary for x/y transform positioning
            top: 0,  // Necessary for x/y transform positioning
          }}
          x={mousePosition.x - 25} // Offset to center the 50px image
          y={mousePosition.y - 25} // Offset to center the 50px image
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 0.7, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 30,
            mass: 0.5,
            opacity: { duration: 0.2 },
            scale: { duration: 0.2 },
          }}
        >
          <Image
            src="https://placehold.co/50x50.png?text=%20"
            alt="Cursor sparkle effect"
            width={50}
            height={50}
            className="rounded-full"
            data-ai-hint="sparkle magic"
            priority // Small image, load quickly
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CursorFollowEffect;
