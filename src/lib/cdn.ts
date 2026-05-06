/**
 * Utility to convert Supabase Storage URLs to Cloudflare CDN URLs.
 * 
 * Example:
 * Input: https://lnrgqxxdlfgrsmtojurd.supabase.co/storage/v1/object/public/products/item1.webp
 * Output: https://cdn.example.com/products/item1.webp
 */
export function getCDNUrl(supabaseUrl: string | null | undefined): string {
  if (!supabaseUrl) return '';
  
  const CDN_DOMAIN = process.env.NEXT_PUBLIC_CDN_URL || 'https://cdn.example.com';
  
  // If it's already a CDN URL or not a supabase storage URL, return as is
  if (!supabaseUrl.includes('supabase.co/storage/v1/object/public/')) {
    return supabaseUrl;
  }

  // Extract the path after /public/
  const parts = supabaseUrl.split('/public/');
  if (parts.length < 2) return supabaseUrl;

  const path = parts[1];
  return `${CDN_DOMAIN}/${path}`;
}
