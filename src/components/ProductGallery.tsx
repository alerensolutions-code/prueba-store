'use client';

import { useState } from 'react';
import Image from 'next/image';
import { getCDNUrl } from '@/lib/cdn';

interface ProductGalleryProps {
  images: { url: string; order: number }[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const sortedImages = [...images].sort((a, b) => a.order - b.order);
  const [mainImage, setMainImage] = useState(sortedImages[0]);

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
        <Image
          src={getCDNUrl(mainImage.url)}
          alt={productName}
          fill
          className="object-cover object-center transition-opacity duration-300"
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-3 gap-4">
        {sortedImages.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setMainImage(img)}
            className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
              mainImage.url === img.url ? 'border-black' : 'border-transparent hover:border-gray-300'
            }`}
          >
            <Image
              src={getCDNUrl(img.url)}
              alt={`${productName} thumbnail ${idx + 1}`}
              fill
              className="object-cover object-center"
              sizes="15vw"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
