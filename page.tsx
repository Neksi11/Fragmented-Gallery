
"use client";

import { useState, useEffect, useRef, type ChangeEvent } from 'react';
import Header from '@/components/layout/header';
import ImageGallery from '@/components/features/image-gallery';
import ImageUpload from '@/components/features/image-upload';
import DitherBackground from '@/components/dither-effect/dither-background';
import CursorFollowEffect from '@/components/effects/CursorFollowEffect';
import type { GalleryImage } from '@/types/image';
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, UploadCloud } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast'; // Import useToast

// This type should ideally be shared or DitherBackground should export its internal type
// For now, mirroring the expected structure for new fragment data.
interface BackgroundFragmentDetails {
  src: string;
  alt: string;
  dataAiHint: string;
  timestamp: number; // To ensure effect hook re-triggers
}

export default function HomePage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isGalleryLoading, setIsGalleryLoading] = useState(true);
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  const [isCursorEffectActive, setIsCursorEffectActive] = useState(false);
  const [newBackgroundFragment, setNewBackgroundFragment] = useState<BackgroundFragmentDetails | null>(null);
  
  const backgroundFragmentInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();


  useEffect(() => {
    setCurrentYear(new Date().getFullYear());

    const timer = setTimeout(() => {
      setImages([
        { id: 'gallery-placeholder-1', src: 'https://placehold.co/600x400.png?text=%20', alt: 'Scenic Landscape', dataAiHint: 'landscape mountain' },
        { id: 'gallery-placeholder-2', src: 'https://placehold.co/400x600.png?text=%20', alt: 'City Architecture', dataAiHint: 'city architecture' },
        { id: 'gallery-placeholder-3', src: 'https://placehold.co/500x500.png?text=%20', alt: 'Abstract Colors', dataAiHint: 'abstract art' },
        { id: 'gallery-placeholder-4', src: 'https://placehold.co/600x450.png?text=%20', alt: 'Nature Closeup', dataAiHint: 'nature flower' },
      ]);
      setIsGalleryLoading(false);
    }, 2500); 
    return () => clearTimeout(timer);
  }, []);

  const handleImageUploaded = (newImage: Omit<GalleryImage, 'id'>) => {
    setImages((prevImages) => [
      { ...newImage, id: `user-${new Date().toISOString()}-${Math.random().toString(36).substr(2, 9)}` },
      ...prevImages,
    ]);
  };

  const toggleCursorEffect = () => {
    setIsCursorEffectActive(prev => !prev);
  };

  const handleBackgroundFragmentUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit for background fragments
        toast({
          title: "File Too Large",
          description: "Please select an image smaller than 2MB for background fragments.",
          variant: "destructive",
        });
        if (backgroundFragmentInputRef.current) backgroundFragmentInputRef.current.value = "";
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File Type",
          description: "Please select an image file (e.g., JPG, PNG, GIF).",
          variant: "destructive",
        });
        if (backgroundFragmentInputRef.current) backgroundFragmentInputRef.current.value = "";
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setNewBackgroundFragment({
          src: reader.result as string,
          alt: file.name,
          dataAiHint: 'user background',
          timestamp: Date.now(),
        });
        toast({
          title: "Fragment Added!",
          description: `${file.name} is now floating in the background.`,
          variant: "default",
        });
      };
      reader.readAsDataURL(file);
      if (backgroundFragmentInputRef.current) backgroundFragmentInputRef.current.value = ""; // Reset file input
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.75, delay: 0.2, ease: "easeOut" }}
    >
      <DitherBackground newFragmentDetails={newBackgroundFragment} />
      <CursorFollowEffect isActive={isCursorEffectActive} />
      <div className="relative flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-10 sm:px-6 lg:px-8 space-y-12 md:space-y-20">
          
          <div className="my-8 flex justify-center">
            <Button onClick={toggleCursorEffect} variant="outline" size="lg" className="shadow-md hover:shadow-lg transition-shadow bg-card/70 backdrop-blur-sm">
              <Sparkles className={`mr-2 h-5 w-5 ${isCursorEffectActive ? 'text-primary animate-pulse' : 'text-muted-foreground'}`} />
              Cursor Sparkle: {isCursorEffectActive ? 'ON' : 'OFF'}
            </Button>
          </div>

          <section id="upload-section" aria-labelledby="upload-heading" className="scroll-mt-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="text-center mb-10">
                <h1 id="upload-heading" className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-4">
                  Share Your Moments
                </h1>
                <p className="max-w-lg mx-auto text-lg text-muted-foreground">
                  Upload your favorite photos. Let them join the ever-evolving canvas of our gallery.
                </p>
              </div>
              <div className="max-w-2xl mx-auto">
                <ImageUpload onImageUploaded={handleImageUploaded} />
              </div>
            </motion.div>
          </section>

          <hr className="border-border my-12 md:my-20" />

          <section id="gallery-section" aria-labelledby="gallery-heading" className="scroll-mt-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
                <div className="text-center sm:text-left">
                  <h2 id="gallery-heading" className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-2 sm:mb-4">
                    Image Gallery
                  </h2>
                  <p className="max-w-lg mx-auto sm:mx-0 text-lg text-muted-foreground">
                    Discover a collection of shared memories and inspiring visuals.
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => backgroundFragmentInputRef.current?.click()}
                  className="whitespace-nowrap shadow-md hover:shadow-lg transition-shadow bg-card/70 backdrop-blur-sm self-center sm:self-start"
                  aria-label="Add image to background fragments"
                >
                  <UploadCloud className="mr-2 h-5 w-5 text-primary" />
                  Add to Background
                </Button>
              </div>
              <input 
                type="file" 
                ref={backgroundFragmentInputRef} 
                onChange={handleBackgroundFragmentUpload} 
                style={{ display: 'none' }} 
                accept="image/*" 
              />
              
              {isGalleryLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                  {[...Array(4)].map((_, i) => (
                    <Card key={i} className="overflow-hidden rounded-xl bg-card/30 backdrop-blur-md border border-card-foreground/10 shadow-lg">
                      <Skeleton className="h-52 w-full aspect-square rounded-t-lg bg-muted/50" />
                      <CardContent className="p-4">
                        <Skeleton className="h-4 w-3/4 rounded-md mb-2 bg-muted/50" />
                        <Skeleton className="h-3 w-1/2 rounded-md bg-muted/50" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <ImageGallery images={images} />
              )}
            </motion.div>
          </section>
        </main>
        <footer className="bg-background/80 backdrop-blur-sm text-center p-8 text-base text-muted-foreground border-t border-border mt-auto">
          Fragment Gallery &copy; {currentYear !== null ? currentYear : <Skeleton className="inline-block h-5 w-12 bg-muted/50" />}
        </footer>
      </div>
    </motion.div>
  );
}
