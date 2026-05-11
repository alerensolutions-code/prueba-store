export default function imageLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  // If the image is already a full URL (CDN or Supabase)
  if (src.startsWith('http')) {
    // We use wsrv.nl to resize and optimize to WebP for FREE
    // This bypasses Vercel optimization and uses wsrv.nl's global cache
    return `https://wsrv.nl/?url=${encodeURIComponent(src)}&w=${width}&q=${quality || 75}&output=webp`;
  }
  
  // For local images
  return src;
}
