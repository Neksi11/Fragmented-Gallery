
"use client";

import { useState } from 'react';
import Image from 'next/image';
import type { GalleryImage } from '@/types/image';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion } from 'framer-motion';
import { ImageOff } from 'lucide-react';

interface ImageGalleryProps {
  images: GalleryImage[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (image: GalleryImage) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  if (images.length === 0) {
    return (
      <div className="text-center py-16">
        <Card className="max-w-md mx-auto p-8 sm:p-10 shadow-xl rounded-xl bg-card/50 backdrop-blur-lg border border-border">
          <CardContent className="flex flex-col items-center gap-5">
            <ImageOff className="w-24 h-24 text-muted-foreground/70" strokeWidth={1} />
            <h3 className="text-2xl font-semibold text-foreground mt-2">Gallery is Empty</h3>
            <p className="text-muted-foreground text-base">
              It looks like there are no images here yet.
            </p>
            <p className="text-lg text-foreground underline mt-3 font-medium">
              insert the images here
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Upload some photos to start your collection!
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
        {images.map((image, index) => (
          <motion.div
            key={image.id}
            initial={{ opacity: 0, scale: 0.9, y: 25 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.45, delay: index * 0.08, ease: "easeOut" }}
            className="h-full cursor-pointer group"
            onClick={() => openModal(image)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') openModal(image); }}
            aria-label={`View image ${image.alt}`}
          >
            <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col rounded-xl border-border hover:border-primary/50">
              <CardContent className="p-0 flex-grow">
                <div className="aspect-square relative w-full overflow-hidden">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out"
                    data-ai-hint={image.dataAiHint}
                    priority={index < 4}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Dialog open={isModalOpen} onOpenChange={(open) => {
        setIsModalOpen(open);
        if (!open) {
          setSelectedImage(null);
        }
      }}>
        {selectedImage && (
          <DialogContent 
            className="max-w-5xl w-[95vw] sm:w-[90vw] md:w-[85vw] lg:w-auto p-4 bg-card/80 backdrop-blur-xl border-border shadow-2xl rounded-xl"
          >
            <DialogHeader className="mb-3 pr-8">
              <DialogTitle className="text-lg sm:text-xl text-foreground truncate max-w-full">
                {selectedImage.alt}
              </DialogTitle>
            </DialogHeader>
            <div className="relative aspect-video max-h-[85vh] w-full mx-auto flex justify-center items-center">
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt}
                fill
                sizes="(max-width: 768px) 90vw, (max-width: 1280px) 80vw, 1200px"
                className="object-contain rounded-lg"
                data-ai-hint={selectedImage.dataAiHint}
                priority
              />
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
};

export default ImageGallery;
