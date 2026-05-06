import Navbar from '@/components/Navbar';
import ProductGallery from '@/components/ProductGallery';
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';

export const revalidate = 3600;

async function getProduct(id: string) {
  const { data, error } = await supabase
    .from('products')
    .select(`
      id,
      name,
      description,
      price,
      product_images (
        url,
        order
      )
    `)
    .eq('id', id)
    .single();
  
  if (error || !data) return null;
  return data;
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);
  
  if (!product) {
    notFound();
  }

  const images = [...product.product_images].sort((a, b) => a.order - b.order);

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-12">
          {/* Image Gallery */}
          <ProductGallery images={product.product_images} productName={product.name} />

          {/* Product Info */}
          <div className="mt-10 lg:mt-0 px-4 sm:px-0">
            <h1 className="text-4xl font-bold tracking-tighter text-gray-900">{product.name}</h1>
            <div className="mt-4">
              <p className="text-3xl font-medium text-gray-900">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(product.price)}
              </p>
            </div>

            <div className="mt-8">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-widest">Description</h3>
              <div className="mt-4 prose prose-sm text-gray-500">
                <p>{product.description}</p>
              </div>
            </div>

            <div className="mt-12">
              <button className="w-full bg-black text-white py-4 font-bold hover:bg-gray-800 transition-colors uppercase tracking-widest">
                Add to Cart
              </button>
              <p className="mt-4 text-center text-xs text-gray-400">
                Free shipping on orders over $150. Returns within 30 days.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
