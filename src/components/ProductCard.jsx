import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import toast from 'react-hot-toast';

export default function ProductCard({ product, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link 
        to={createPageUrl(`ProductDetail?id=${product.id}`)}
        className="group block"
      >
        <div className="relative overflow-hidden bg-neutral-800 aspect-square mb-4">
          <img 
            src={product.image || 'https://www.disposoul.com/cdn/shop/files/03_8-oz-tall-single-stack.jpg?v=1731492208&width=533'} 
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
        </div>
        
        <div className="space-y-1.5">
          <h3 className="text-sm md:text-base text-neutral-200 font-medium leading-snug line-clamp-2 group-hover:text-amber-400 transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-neutral-400">
            {product.capacity}
          </p>
          <p className="text-base font-medium text-amber-400">
            From ₹{product.price?.toFixed(2)}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}