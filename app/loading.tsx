
"use client";

import { motion } from 'framer-motion';
import { GalleryThumbnails } from 'lucide-react';

export default function Loading() {
  // This component is automatically displayed by Next.js during navigation
  // or initial load of a route segment.
  // It will use the InteractiveParticleBackground from RootLayout.

  const dotAnimation = {
    opacity: [0.4, 1, 0.4],
    scale: [0.9, 1.1, 0.9],
  };

  const dotTransition = (delay: number) => ({
    repeat: Infinity,
    duration: 1.3,
    delay: delay,
    ease: "easeInOut" as const, // Ensure TypeScript understands this is a valid ease type
  });

  const dotClassName = "h-3.5 w-3.5 sm:h-4 sm:w-4 bg-primary rounded-full";

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background/90 backdrop-blur-sm z-50">
      <motion.div
        initial={{ opacity: 0, y: -25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeInOut' }}
        className="flex flex-col items-center p-8 rounded-lg"
      >
        <GalleryThumbnails className="h-20 w-20 sm:h-24 sm:w-24 text-primary mb-6" />
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-10 tracking-tight text-center">
          Fragment Gallery
        </h1>
        
        {/* New three-dot triangular animation */}
        <div className="flex flex-col items-center space-y-1">
          {/* Top dot */}
          <motion.div
            key="loader-dot-top"
            animate={dotAnimation}
            transition={dotTransition(0)}
            className={dotClassName}
          />
          {/* Bottom row of two dots */}
          <div className="flex space-x-1.5">
            <motion.div
              key="loader-dot-bottom-left"
              animate={dotAnimation}
              transition={dotTransition(0.3)}
              className={dotClassName}
            />
            <motion.div
              key="loader-dot-bottom-right"
              animate={dotAnimation}
              transition={dotTransition(0.6)}
              className={dotClassName}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
