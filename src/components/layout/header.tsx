
import Link from 'next/link';
import { GalleryThumbnails } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-card/80 backdrop-blur-lg border-b border-border shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="flex items-center gap-3 text-xl sm:text-2xl font-semibold text-primary hover:text-primary/80 transition-opacity">
            <GalleryThumbnails className="h-7 w-7 sm:h-8 sm:w-8" />
            <span>Fragment Gallery</span>
          </Link>
          {/* Future navigation links can go here */}
          {/* Example: <nav className="hidden md:flex gap-4"> <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-primary">About</Link> </nav> */}
        </div>
      </div>
    </header>
  );
}
