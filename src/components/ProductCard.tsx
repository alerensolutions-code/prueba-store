'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getCDNUrl } from '@/lib/cdn';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
}

export default function ProductCard({ id, name, price, imageUrl }: ProductCardProps) {
  const cdnUrl = getCDNUrl(imageUrl);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group"
    >
      <Link href={`/product/${id}`}>
        <div className="relative aspect-square overflow-hidden bg-gray-100 rounded-lg">
          <Image
            src={cdnUrl || '/placeholder.webp'}
            alt={name}
            fill
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
        </div>
        <div className="mt-4 flex justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-900 group-hover:underline">
              {name}
            </h3>
            <p className="mt-1 text-sm text-gray-500">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)}</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
