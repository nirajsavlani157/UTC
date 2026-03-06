import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { utc } from '@/api/utcClient';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowRight, MousePointer2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

import HeroSlider from '@/components/HeroSlider';
import CollectionCard from '@/components/CollectionCard';
import ProductCard from '@/components/ProductCard';
import Product3DCard from '@/components/Product3DCard';
import ParallaxSection from '@/components/ParallaxSection';

const staticCollections = [
  { id: 1, name: 'Meal Trays', slug: 'meal-trays', image: 'https://www.disposoul.com/cdn/shop/collections/IMG_20240529_174328.jpg?v=1737970587&width=1500' },
  { id: 2, name: 'Food Containers', slug: 'food-containers', image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/utc-prod/public/695f409ea784b9d3881e695f/9df8a3ef4_Gemini_Generated_Image_y0ibbwy0ibbwy0ib.png' },
  { id: 3, name: 'Bagasse Products', slug: 'bagasse-products', image: 'https://www.disposoul.com/cdn/shop/collections/WhatsApp_Image_2024-05-27_at_11.14.48.jpg?v=1737971197&width=1500' },
  { id: 4, name: 'Aluminium Containers', slug: 'aluminium-containers', image: 'https://www.disposoul.com/cdn/shop/collections/WhatsApp_Image_2024-05-27_at_11.14.34_2.jpg?v=1738070448&width=1500' },
  { id: 5, name: 'Paper Products', slug: 'paper-products', image: 'https://www.disposoul.com/cdn/shop/collections/Paper_Products1.png?v=1738215936&width=1500' },
  { id: 6, name: 'Eco Friendly Products', slug: 'eco-friendly', image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/utc-prod/public/695f409ea784b9d3881e695f/f0f0c3463_Gemini_Generated_Image_9enx5x9enx5x9enx.png' },
  { id: 7, name: 'Shakes & Mocktail', slug: 'shakes-mocktail', image: 'https://www.disposoul.com/cdn/shop/collections/plastic-shake-glass.jpg?v=1738216085&width=1500' },
  { id: 8, name: 'Print & Customization', slug: 'print-customization', image: 'https://www.disposoul.com/cdn/shop/collections/ceef68083b330c5e779fe4a8d0f8fa10.png?v=1738216391&width=1500' },
];

const staticBestsellers = [
  { id: 1, name: 'Round Food Container With LID 8 Oz Tall 250Ml', price: 175, capacity: '250ml', image: 'https://www.disposoul.com/cdn/shop/files/03_8-oz-tall-single-stack.jpg?v=1731492208&width=533' },
  { id: 2, name: 'Round Food Container With LID 16 Oz 500Ml', price: 250, capacity: '500ml', image: 'https://www.disposoul.com/cdn/shop/files/02_16-oz-4.jpg?v=1734081230&width=533' },
  { id: 3, name: 'Round Food Container With LID 2 Oz 50Ml', price: 170, capacity: '50ml', image: 'https://www.disposoul.com/cdn/shop/files/01_02oz.jpg?v=1731491556&width=533' },
  { id: 4, name: '3 Compartment Meal Box Tray With Lid Mini', price: 212.50, capacity: 'Mini', image: 'https://www.disposoul.com/cdn/shop/files/73.jpg?v=1738214639&width=533' },
  { id: 5, name: 'Round Food Container With LID 10 Oz 300Ml', price: 225, capacity: '300ml', image: 'https://www.disposoul.com/cdn/shop/files/04_10oz-stack.jpg?v=1731492677&width=533' },
  { id: 6, name: 'Sauce & Dip Transparent Hinge Lid Container 35Ml', price: 120, capacity: '35ml', image: 'https://www.disposoul.com/cdn/shop/files/35_ml_transparent.jpg?v=1751969860&width=533' },
  { id: 7, name: 'Round Food Container With LID 4 Oz 100Ml', price: 250, capacity: '100ml', image: 'https://www.disposoul.com/cdn/shop/files/01_4oz-2.jpg?v=1731492043&width=533' },
  { id: 8, name: 'Round Food Container Premium Series RO 16 480ML', price: 350, capacity: '480ml', image: 'https://www.disposoul.com/cdn/shop/files/04_RO-16.jpg?v=1737358860&width=533' },
  { id: 9, name: 'Round Food Container Premium Series RO 24 720ML', price: 450, capacity: '720ml', image: 'https://www.disposoul.com/cdn/shop/files/01_RO-24-2.jpg?v=1732707304&width=533' },
  { id: 10, name: '2 Compartment Meal Box Tray With Lid', price: 212.50, capacity: 'Standard', image: 'https://www.disposoul.com/cdn/shop/files/70.jpg?v=1738214549&width=533' },
  { id: 11, name: 'Rectangular Food Container With LID 500 ml', price: 325, capacity: '500ml', image: 'https://www.disposoul.com/cdn/shop/files/01_650-1_1000-X-1000-px-1.jpg?v=1731584138&width=533' },
  { id: 12, name: 'Rectangular Container Premium Series RE 12 360ML', price: 280, capacity: '360ml', image: 'https://www.disposoul.com/cdn/shop/files/01_RE-12-1.jpg?v=1732708153&width=533' },
];

export default function Home() {
  const { data: products = [] } = useQuery({
    queryKey: ['products', 'bestsellers'],
    queryFn: () => utc.entities.Product.filter({ is_bestseller: true }, '-created_date', 12),
  });

  const displayProducts = products.length > 0 ? products : staticBestsellers;

  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Hero Slider */}
      <HeroSlider />

      {/* Collections Section */}
      <section className="py-16 md:py-24 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-light tracking-tight text-white mb-4">
              Collections
            </h2>
            <p className="text-neutral-400 max-w-xl mx-auto">
              Explore our wide range of premium disposable food packaging solutions
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {staticCollections.map((collection, index) => (
              <CollectionCard 
                key={collection.id} 
                collection={collection} 
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Premium Banner */}
      <section className="relative py-24 md:py-32">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ 
            backgroundImage: 'url(https://www.disposoul.com/cdn/shop/files/2_af9b5823-72e9-4057-b5c9-f3da82269d42.jpg?v=1759736239&width=3840)'
          }}
        >
          <div className="absolute inset-0 bg-black/60" />
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 md:px-6 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-light mb-6 leading-tight">
              Premium Disposable Food Packaging Materials for Restaurants, Cafés & Cloud Kitchens
            </h2>
            <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Quality packaging solutions designed for the modern food industry
            </p>
            <Link to={createPageUrl('Shop')}>
              <Button className="bg-amber-500 text-black hover:bg-amber-400 px-10 py-6 text-sm tracking-widest uppercase font-medium rounded-none shadow-lg shadow-amber-500/50">
                Shop All Products
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Best Sellers - 3D Interactive */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-neutral-900 relative overflow-hidden">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <ParallaxSection speed={0.3}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
                Best Sellers
              </h2>
              <p className="text-neutral-400 text-lg">
                Experience our most popular products in stunning 3D
              </p>
            </motion.div>
          </ParallaxSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {displayProducts.slice(0, 6).map((product, index) => (
              <Product3DCard 
                key={product.id} 
                product={product} 
                index={index}
              />
            ))}
          </div>

          <ParallaxSection speed={0.5}>
            <div className="mt-16 text-center">
              <Link to={createPageUrl('Shop')}>
                <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-12 py-7 text-lg font-bold shadow-2xl shadow-cyan-500/50 transform hover:scale-105 transition-all rounded-full flex items-center gap-3">
                  Explore All Products
                  <MousePointer2 className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </ParallaxSection>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-neutral-950">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              {
                title: 'Premium Quality',
                description: 'Food-grade materials that meet the highest safety standards'
              },
              {
                title: 'Eco-Friendly Options',
                description: 'Sustainable packaging solutions for environmentally conscious businesses'
              },
              {
                title: 'Bulk Discounts',
                description: 'Special pricing for restaurants, cafés, and cloud kitchens'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <h3 className="text-xl font-medium text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-neutral-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}