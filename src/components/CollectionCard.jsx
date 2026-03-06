import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function CollectionCard({ collection, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link 
        to={createPageUrl(`Shop?category=${collection.slug}`)}
        className="group block relative overflow-hidden bg-neutral-800 aspect-square"
      >
        <img 
          src={collection.image} 
          alt={collection.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
        
        <div className="absolute inset-0 flex items-end p-6">
          <div>
            <h3 className="text-white text-xl md:text-2xl font-medium tracking-tight">
              {collection.name}
            </h3>
            <div className="mt-2 overflow-hidden h-0 group-hover:h-6 transition-all duration-300">
              <span className="text-white/90 text-sm tracking-wide">
                Shop Collection →
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}