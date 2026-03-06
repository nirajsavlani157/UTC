import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { utc } from '@/api/utcClient';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Minus, Plus, ShoppingBag, Heart, Share2, ChevronRight, Truck, Shield, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const staticProduct = {
  id: 1,
  name: 'Round Food Container With LID 16 Oz 500Ml',
  price: 250,
  capacity: '500ml',
  category: 'food-containers',
  description: 'Premium quality food container perfect for storing and transporting food. Made from food-grade materials, microwave safe, and leak-proof. Ideal for restaurants, cafés, cloud kitchens, and home use.',
  image: 'https://www.disposoul.com/cdn/shop/files/02_16-oz-4.jpg?v=1734081230&width=800'
};

export default function ProductDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      if (!productId) return staticProduct;
      const products = await utc.entities.Product.filter({ id: productId });
      return products[0] || staticProduct;
    },
  });

  const displayProduct = product || staticProduct;

  const images = [
    displayProduct.image || 'https://www.disposoul.com/cdn/shop/files/02_16-oz-4.jpg?v=1734081230&width=800',
    'https://www.disposoul.com/cdn/shop/files/03_8-oz-tall-single-stack.jpg?v=1731492208&width=800',
    'https://www.disposoul.com/cdn/shop/files/04_10oz-stack.jpg?v=1731492677&width=800',
  ];

  return (
    <div className="min-h-screen bg-neutral-950 pt-20">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
        <nav className="flex items-center gap-2 text-sm text-neutral-500">
          <Link to={createPageUrl('Home')} className="hover:text-amber-400">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to={createPageUrl('Shop')} className="hover:text-amber-400">Shop</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-amber-400 truncate">{displayProduct.name}</span>
        </nav>
      </div>

      {/* Product Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Images */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="aspect-square bg-neutral-900 overflow-hidden">
              <motion.img
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={images[selectedImage]}
                alt={displayProduct.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex gap-3">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 bg-neutral-900 overflow-hidden transition-all ${
                    selectedImage === index ? 'ring-2 ring-amber-500' : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <Badge variant="secondary" className="mb-3 rounded-none bg-neutral-800 text-amber-400 border-neutral-700">
                {displayProduct.category?.replace(/-/g, ' ').toUpperCase()}
              </Badge>
              <h1 className="text-2xl md:text-3xl font-light tracking-tight text-white mb-4">
                {displayProduct.name}
              </h1>
              <p className="text-2xl font-medium text-amber-400">
                From ₹{displayProduct.price?.toFixed(2)}
              </p>
            </div>

            <p className="text-neutral-300 leading-relaxed">
              {displayProduct.description || 'Premium quality food packaging solution. Made from food-grade materials, microwave safe, and leak-proof. Ideal for restaurants, cafés, cloud kitchens, and home use.'}
            </p>

            {/* Capacity */}
            {displayProduct.capacity && (
              <div>
                <p className="text-sm font-medium text-white mb-3">Capacity: {displayProduct.capacity}</p>
              </div>
            )}

            {/* Quantity */}
            <div>
              <p className="text-sm font-medium text-white mb-3">Quantity</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-neutral-700">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-neutral-800 transition-colors text-white"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-16 text-center font-medium text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-neutral-800 transition-colors text-white"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button 
                onClick={() => {
                  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
                  const existingItem = cart.find(item => item.id === displayProduct.id);
                  
                  if (existingItem) {
                    existingItem.quantity += quantity;
                  } else {
                    cart.push({
                      id: displayProduct.id,
                      name: displayProduct.name,
                      price: displayProduct.price,
                      image: displayProduct.image,
                      capacity: displayProduct.capacity,
                      quantity: quantity
                    });
                  }
                  
                  localStorage.setItem('cart', JSON.stringify(cart));
                  alert('Added to cart!');
                }}
                className="flex-1 bg-amber-500 hover:bg-amber-400 text-black rounded-none h-14 text-sm tracking-wide font-medium shadow-lg shadow-amber-500/50"
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
              <Button variant="outline" className="rounded-none h-14 px-4 border-neutral-700 text-white hover:bg-neutral-800">
                <Heart className="w-5 h-5" />
              </Button>
              <Button variant="outline" className="rounded-none h-14 px-4 border-neutral-700 text-white hover:bg-neutral-800">
                <Share2 className="w-5 h-5" />
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-neutral-800">
              <div className="text-center">
                <Truck className="w-6 h-6 mx-auto mb-2 text-amber-400" />
                <p className="text-xs text-neutral-400">Free Shipping</p>
              </div>
              <div className="text-center">
                <Shield className="w-6 h-6 mx-auto mb-2 text-amber-400" />
                <p className="text-xs text-neutral-400">Quality Assured</p>
              </div>
              <div className="text-center">
                <RotateCcw className="w-6 h-6 mx-auto mb-2 text-amber-400" />
                <p className="text-xs text-neutral-400">Easy Returns</p>
              </div>
            </div>

            {/* Accordion */}
            <Accordion type="single" collapsible className="pt-4">
              <AccordionItem value="description" className="border-neutral-800">
                <AccordionTrigger className="text-sm font-medium text-white">Product Details</AccordionTrigger>
                <AccordionContent className="text-neutral-300 text-sm">
                  <ul className="list-disc pl-4 space-y-2">
                    <li>Made from premium food-grade materials</li>
                    <li>Microwave and freezer safe</li>
                    <li>Leak-proof and airtight seal</li>
                    <li>Reusable and dishwasher safe</li>
                    <li>BPA free and eco-friendly</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="shipping" className="border-neutral-800">
                <AccordionTrigger className="text-sm font-medium text-white">Shipping Information</AccordionTrigger>
                <AccordionContent className="text-neutral-300 text-sm">
                  Free shipping on orders above ₹999. Standard delivery within 5-7 business days. Express shipping available at checkout.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="returns" className="border-neutral-800">
                <AccordionTrigger className="text-sm font-medium text-white">Returns & Refunds</AccordionTrigger>
                <AccordionContent className="text-neutral-300 text-sm">
                  We accept returns within 7 days of delivery for unused products in original packaging. Contact our support team for assistance.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </motion.div>
        </div>
      </div>
    </div>
  );
}