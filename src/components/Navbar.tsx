'use client';

import Link from 'next/link';
import { ShoppingBag, Search, Menu, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold tracking-tighter text-black hover:text-gray-700 transition-colors">
              MINIMA<span className="text-gray-400">STORE</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/category/electronics" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
              Electronics
            </Link>
            <Link href="/category/apparel" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
              Apparel
            </Link>
            <Link href="/category/home" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
              Home
            </Link>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            <Link href="/admin" title="Admin Dashboard" className="p-2 text-gray-400 hover:text-black transition-colors">
              <Settings className="w-5 h-5" />
            </Link>
            <button className="p-2 text-gray-600 hover:text-black transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-black transition-colors relative">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute top-1 right-1 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                0
              </span>
            </button>
            <button className="md:hidden p-2 text-gray-600 hover:text-black transition-colors">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
