'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-black text-white">
      {/* Background Pattern/Animation */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-800 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-block px-3 py-1 mb-6 text-xs font-semibold tracking-widest uppercase border border-white/20 rounded-full"
        >
          New Collection 2026
        </motion.span>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-5xl md:text-8xl font-bold tracking-tighter mb-8 leading-tight"
        >
          ESSENTIAL <br /> <span className="text-gray-500">MINIMALISM.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="max-w-xl mx-auto text-lg text-gray-400 mb-12"
        >
          Experience the intersection of luxury and simplicity. Our latest collection is designed for those who value performance and aesthetics.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Link
            href="/category/all"
            className="inline-block bg-white text-black px-10 py-4 font-semibold hover:bg-gray-200 transition-colors rounded-none"
          >
            Shop Collection
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
