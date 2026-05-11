'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import AddProductModal from '@/components/AddProductModal';
import { supabase } from '@/lib/supabase';
import { Trash2, Plus, RefreshCw, ExternalLink, Package } from 'lucide-react';
import { clearAllProducts } from './actions';
import { motion, AnimatePresence } from 'framer-motion';

interface Product {
  id: string;
  name: string;
  price: number;
  product_images: { url: string }[];
}

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('id, name, price, product_images(url)')
      .order('created_at', { ascending: false });
    
    if (!error && data) setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleClearAll = async () => {
    if (!confirm('Are you sure you want to delete ALL products? This cannot be undone.')) return;
    
    setIsClearing(true);
    const result = await clearAllProducts();
    if (result.success) {
      setProducts([]);
      alert('All products cleared!');
    } else {
      alert('Error: ' + result.error);
    }
    setIsClearing(false);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-16">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500 mt-2">Manage your inventory and store products.</p>
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={handleClearAll}
              disabled={isClearing}
              className="flex items-center gap-2 px-6 py-3 bg-white border border-red-200 text-red-600 rounded-2xl font-bold text-sm hover:bg-red-50 transition-all shadow-sm disabled:opacity-50"
            >
              {isClearing ? <RefreshCw size={18} className="animate-spin" /> : <Trash2 size={18} />}
              Clear Store
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-2xl font-bold text-sm hover:bg-gray-800 transition-all shadow-xl shadow-black/10"
            >
              <Plus size={18} />
              Add Product
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <RefreshCw size={40} className="animate-spin text-gray-300" />
            <p className="text-gray-400 font-medium tracking-wide uppercase text-xs">Loading Inventory...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package size={32} className="text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">Your store is currently empty. Start by adding your first product.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-8 py-3 bg-black text-white rounded-full font-bold text-sm hover:bg-gray-800 transition-all"
            >
              <Plus size={18} />
              Add First Product
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {products.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow group"
                >
                  <div className="aspect-[4/5] relative bg-gray-100 overflow-hidden">
                    <img
                      src={product.product_images[0]?.url || '/placeholder.webp'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 right-4 flex gap-2">
                       <a 
                        href={`/product/${product.id}`}
                        target="_blank"
                        className="p-2 bg-white/90 backdrop-blur-md rounded-full shadow-sm hover:bg-white transition-colors"
                       >
                        <ExternalLink size={16} className="text-gray-600" />
                       </a>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{product.name}</h3>
                    <p className="text-gray-500 font-medium">
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(product.price)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchProducts}
      />
    </main>
  );
}
