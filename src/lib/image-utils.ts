import imageCompression from 'browser-image-compression';

export async function optimizeImage(file: File): Promise<File> {
  const options = {
    maxSizeMB: 0.8, // Max size 800KB
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: 'image/webp',
    initialQuality: 0.8,
  };

  try {
    const compressedFile = await imageCompression(file, options);
    
    // Rename to .webp if it's not already
    const fileName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
    return new File([compressedFile], fileName, { type: 'image/webp' });
  } catch (error) {
    console.error('Image optimization failed:', error);
    return file; // Fallback to original
  }
}
