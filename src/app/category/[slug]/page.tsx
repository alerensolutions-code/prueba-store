import Navbar from '@/components/Navbar';
import ProductGrid from '@/components/ProductGrid';
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export const revalidate = 3600;

async function getCategoryBySlug(slug: string) {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, slug')
    .eq('slug', slug)
    .single();
  
  if (error || !data) return null;
  return data;
}

async function getProductsByCategory(categoryId: string | null, page = 1, limit = 20) {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from('products')
    .select(`
      id,
      name,
      price,
      product_images (
        url
      )
    `);

  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }

  const { data, error } = await query
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) return [];
  
  return data.map((p: any) => ({
    ...p,
    imageUrl: p.product_images?.[0]?.url || ''
  }));
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  let category = null;
  let products = [];

  if (slug === 'all') {
    category = { id: null, name: 'All Products', slug: 'all' };
    products = await getProductsByCategory(null);
  } else {
    category = await getCategoryBySlug(slug);
    if (!category) {
      notFound();
    }
    products = await getProductsByCategory(category.id);
  }

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      <div className="pt-32 pb-12 bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tighter uppercase">{category.name}</h1>
          <p className="text-gray-500 mt-2">Browsing all items in {category.name}</p>
        </div>
      </div>

      <section className="max-width-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {products.length > 0 ? (
          <ProductGrid initialProducts={products} categoryId={category.id} />
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500">No products found in this category.</p>
          </div>
        )}
      </section>
    </main>
  );
}
