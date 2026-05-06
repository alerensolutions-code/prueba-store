'use client';

import { useState } from 'react';
import ProductCard from './ProductCard';

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
}

interface ProductGridProps {
  initialProducts: Product[];
  categoryId?: string | null;
}

export default function ProductGrid({ initialProducts, categoryId }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialProducts.length === 20);

  const loadMore = async () => {
    if (loading) return;
    setLoading(true);
    
    const nextPage = page + 1;
    const url = categoryId 
      ? `/api/products?page=${nextPage}&categoryId=${categoryId}` 
      : `/api/products?page=${nextPage}`;
    
    try {
      const res = await fetch(url);
      const newProducts = await res.json();
      
      if (newProducts.length < 20) {
        setHasMore(false);
      }
      
      setProducts([...products, ...newProducts.map((p: any) => ({
        ...p,
        imageUrl: p.product_images?.[0]?.url || ''
      }))]);
      setPage(nextPage);
    } catch (error) {
      console.error('Error loading more products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
        {products.map((product) => (
          <ProductCard
            key={`${product.id}-${page}`}
            id={product.id}
            name={product.name}
            price={product.price}
            imageUrl={product.imageUrl}
          />
        ))}
      </div>

      {hasMore && (
        <div className="mt-20 flex justify-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-8 py-3 border border-black font-semibold hover:bg-black hover:text-white transition-all disabled:opacity-50"
          >
            {loading ? 'LOADING...' : 'LOAD MORE'}
          </button>
        </div>
      )}
    </div>
  );
}
