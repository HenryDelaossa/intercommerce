import { useState } from 'react';
import clsx from 'clsx';

interface ProductGalleryProps {
  images: string[];
  title: string;
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const [activeImage, setActiveImage] = useState(images[0]);

  return (
    <div className="flex flex-col gap-3">
      <div className="aspect-square w-full overflow-hidden rounded-lg border border-black/10 bg-white">
        <img src={activeImage} alt={title} className="h-full w-full object-contain" />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((image) => (
            <button
              key={image}
              type="button"
              onClick={() => setActiveImage(image)}
              className={clsx(
                'h-16 w-16 shrink-0 overflow-hidden rounded-md border bg-white',
                activeImage === image ? 'border-brand-primary' : 'border-black/10',
              )}
            >
              <img src={image} alt="" className="h-full w-full object-contain" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
