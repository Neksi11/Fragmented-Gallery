
"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ImageFragment {
  id: string;
  src: string;
  alt: string;
  initialX: number; // percentage
  initialY: number; // percentage
  size: number; // px
  depth: number; // for parallax effect strength
  dataAiHint: string;
  initialRotation: number;
}

// Extended internal state to include current positions for animation
interface AnimatedImageFragment extends ImageFragment {
  currentX: number;
  currentY: number;
  currentRotation: number;
}

const initialFragments: ImageFragment[] = [
  { id: 'frag1', src: 'https://placehold.co/100x150.png?text=%20', alt: 'Abstract Fragment 1', initialX: 20, initialY: 30, size: 100, depth: 0.04, dataAiHint: 'abstract texture', initialRotation: -10 },
  { id: 'frag2', src: 'https://placehold.co/120x100.png?text=%20', alt: 'Geometric Fragment 2', initialX: 75, initialY: 55, size: 120, depth: 0.06, dataAiHint: 'geometric pattern', initialRotation: 5 },
  { id: 'frag3', src: 'https://placehold.co/80x120.png?text=%20', alt: 'Nature Fragment 3', initialX: 45, initialY: 70, size: 80, depth: 0.03, dataAiHint: 'nature detail', initialRotation: 15 },
  { id: 'frag4', src: 'https://placehold.co/150x100.png?text=%20', alt: 'Pattern Fragment 4', initialX: 10, initialY: 60, size: 90, depth: 0.05, dataAiHint: 'colorful pattern', initialRotation: -5 },
  { id: 'frag5', src: 'https://placehold.co/100x100.png?text=%20', alt: 'Artistic Fragment 5', initialX: 60, initialY: 20, size: 110, depth: 0.035, dataAiHint: 'artistic blur', initialRotation: 10 },
];

interface DitherBackgroundProps {
  newFragmentDetails?: { src: string; alt: string; dataAiHint: string; timestamp: number } | null;
}

const DitherBackground: React.FC<DitherBackgroundProps> = ({ newFragmentDetails }) => {
  const [fragments, setFragments] = useState<AnimatedImageFragment[]>(
    initialFragments.map(f => ({ 
      ...f, 
      currentX: f.initialX, 
      currentY: f.initialY, 
      currentRotation: f.initialRotation 
    }))
  );
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (newFragmentDetails) {
      const newFragment: AnimatedImageFragment = {
        id: `user-frag-${newFragmentDetails.timestamp}-${Math.random().toString(36).substring(2, 9)}`,
        src: newFragmentDetails.src,
        alt: newFragmentDetails.alt,
        dataAiHint: newFragmentDetails.dataAiHint,
        initialX: Math.random() * 80 + 10, // Random X: 10% to 90%
        initialY: Math.random() * 80 + 10, // Random Y: 10% to 90%
        size: Math.floor(Math.random() * 70) + 80, // Random size: 80px to 150px
        depth: parseFloat(((Math.random() * 0.04) + 0.02).toFixed(3)), // Random depth: 0.02 to 0.06
        initialRotation: Math.floor((Math.random() - 0.5) * 40), // Random rotation: -20deg to 20deg
        currentX: 0, // Will be set momentarily
        currentY: 0, // Will be set momentarily
        currentRotation: 0, // Will be set momentarily
      };
      // Set current positions to initial for the new fragment
      newFragment.currentX = newFragment.initialX;
      newFragment.currentY = newFragment.initialY;
      newFragment.currentRotation = newFragment.initialRotation;

      setFragments(prevFragments => [...prevFragments, newFragment]);
    }
  }, [newFragmentDetails]);


  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!containerRef.current) return;

      const { clientX, clientY } = event;
      const { innerWidth, innerHeight } = window;

      setFragments(prevFragments =>
        prevFragments.map(fragment => {
          const mouseXRelativeToCenter = clientX - innerWidth / 2;
          const mouseYRelativeToCenter = clientY - innerHeight / 2;

          const offsetX = mouseXRelativeToCenter * fragment.depth;
          const offsetY = mouseYRelativeToCenter * fragment.depth;
          
          const rotationEffect = mouseXRelativeToCenter * 0.01 * (fragment.depth * 20);

          return {
            ...fragment,
            currentX: fragment.initialX + (offsetX / innerWidth) * 100,
            currentY: fragment.initialY + (offsetY / innerHeight) * 100,
            currentRotation: fragment.initialRotation + rotationEffect,
          };
        })
      );
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []); // Empty dependency array for mouse move, it uses fragments from its closure

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-screen h-screen overflow-hidden animated-gradient-bg z-[-1]"
      aria-hidden="true" // Decorative background
    >
      {fragments.map(fragment => (
        <div
          key={fragment.id}
          className="absolute transition-transform duration-300 ease-out hover:scale-110"
          style={{
            width: `${fragment.size}px`,
            height: 'auto',
            left: `${fragment.currentX}%`,
            top: `${fragment.currentY}%`,
            transform: `translate(-50%, -50%) rotate(${fragment.currentRotation}deg) scale(0.9)`,
            opacity: 0.6, 
          }}
        >
          <Image
            src={fragment.src}
            alt={fragment.alt}
            width={fragment.size}
            height={fragment.size * 1.5} // Assuming a general portrait-like aspect for placeholder
            className="object-cover rounded-lg shadow-xl"
            data-ai-hint={fragment.dataAiHint}
            priority={fragments.indexOf(fragment) < 2}
          />
        </div>
      ))}
    </div>
  );
};

export default DitherBackground;
