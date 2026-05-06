import Hero from '@/components/Hero';
import Navbar from '@/components/Navbar';
import ProductGrid from '@/components/ProductGrid';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export const revalidate = 3600; // Revalidate every hour (ISR)

async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, slug')
    .limit(10);
  
  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
  return data;
}

async function getProducts(page = 1, limit = 20) {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error } = await supabase
    .from('products')
    .select(`
      id,
      name,
      price,
      product_images (
        url
      )
    `)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }
  
  return data.map((p: any) => ({
    ...p,
    imageUrl: p.product_images?.[0]?.url || ''
  }));
}

export default async function Home() {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts()
  ]);

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      <Hero />

      {/* Categories Bar */}
      <div className="bg-gray-50 py-12 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-8">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="text-sm font-semibold tracking-widest uppercase text-gray-500 hover:text-black transition-colors"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold tracking-tighter">FEATURED PRODUCTS</h2>
            <p className="text-gray-500 mt-2">Selected essentials for your lifestyle.</p>
          </div>
          <Link href="/category/all" className="text-sm font-semibold underline underline-offset-4 hover:text-gray-600">
            View All
          </Link>
        </div>

        <ProductGrid initialProducts={products} />
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-20 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm tracking-widest uppercase">
            &copy; 2026 MINIMASTORE. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>
    </main>
  );
}
