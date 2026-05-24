'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className="flex flex-col gap-4" data-testid="product-gallery">
      <div className="relative aspect-[4/5] bg-black overflow-hidden">
        <Image
          src={images[selectedIndex]}
          alt={`${productName} - Hero`}
          fill
          className="object-cover"
          data-testid="hero-image"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>
      <div className="flex gap-3">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedIndex(index)}
            className={`relative w-20 h-24 bg-black overflow-hidden border-2 transition-colors ${
              index === selectedIndex ? 'border-[#e1b12c]' : 'border-transparent hover:border-[#a38c62]'
            }`}
            data-testid="thumbnail"
            aria-label={`View ${productName} image ${index + 1}`}
          >
            <Image
              src={image}
              alt={`${productName} thumbnail ${index + 1}`}
              fill
              className="object-cover"
              sizes="80px"
            />
          </button>
        ))}
      </div>
    </div>
  );
}