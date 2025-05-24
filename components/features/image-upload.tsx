
"use client";

import { useState, useRef, type ChangeEvent, type FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { GalleryImage } from '@/types/image';
import { UploadCloud, XCircle, FileImage } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUploaded }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File Too Large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File Type",
          description: "Please select an image file (e.g., JPG, PNG, GIF).",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedFile) {
      toast({
        title: "No File Selected",
        description: "Please select an image to upload.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate upload

    onImageUploaded({
      src: previewUrl!, 
      alt: selectedFile.name || 'Uploaded image',
      dataAiHint: 'user uploaded'
    });

    toast({
      title: "Image Uploaded!",
      description: `${selectedFile.name} has been added to the gallery.`,
      variant: "default",
    });

    clearSelection();
    setIsUploading(false);
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Card className="shadow-xl rounded-xl border-border">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-2xl font-semibold">
          <FileImage className="h-7 w-7 text-primary" />
          Upload Your Image
        </CardTitle>
        <CardDescription className="text-base">Select an image file from your device (max 5MB).</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div
            className="mt-2 flex justify-center px-6 py-10 border-2 border-border border-dashed rounded-lg hover:border-primary/60 transition-colors cursor-pointer bg-secondary/30 hover:bg-secondary/50"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()} 
            onDrop={(e) => { 
              e.preventDefault();
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleFileChange({ target: { files: e.dataTransfer.files } } as ChangeEvent<HTMLInputElement>);
              }
            }}
          >
            <div className="space-y-2 text-center">
              <UploadCloud className="mx-auto h-16 w-16 text-muted-foreground/70" strokeWidth={1.2} />
              <div className="flex text-base text-muted-foreground">
                <label
                  htmlFor="image-upload-input-styled"
                  className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-ring"
                >
                  <span>Click to upload</span>
                  <Input
                    id="image-upload-input-styled"
                    name="image-upload-input-styled"
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    disabled={isUploading}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-muted-foreground/90">PNG, JPG, GIF up to 5MB</p>
            </div>
          </div>

          {previewUrl && selectedFile && (
            <div className="mt-4 p-4 border border-border rounded-lg relative bg-muted/30 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-foreground">Preview:</p>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={clearSelection}
                  aria-label="Clear selection"
                  disabled={isUploading}
                >
                  <XCircle className="h-5 w-5 text-muted-foreground hover:text-destructive" />
                </Button>
              </div>
              <Image
                src={previewUrl}
                alt={selectedFile.name}
                width={0}
                height={0}
                sizes="100vw"
                className="rounded-md object-contain max-h-72 w-full h-auto"
              />
            </div>
          )}

          <Button type="submit" className="w-full shadow-md hover:shadow-lg transition-shadow" disabled={!selectedFile || isUploading} size="lg">
            <UploadCloud className="mr-2 h-5 w-5" />
            {isUploading ? 'Uploading...' : 'Confirm and Upload Image'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

interface ImageUploadProps {
  onImageUploaded: (newImage: Omit<GalleryImage, 'id'>) => void;
}

export default ImageUpload;
