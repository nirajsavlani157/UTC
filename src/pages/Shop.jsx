import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { utc } from '@/api/utcClient';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, ChevronDown, Grid3X3, LayoutGrid, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Checkbox } from '@/components/ui/checkbox';

import ProductCard from '@/components/ProductCard';
import Product3DCard from '@/components/Product3DCard';

const categories = [
  { value: 'all', label: 'All Products' },
  { value: 'meal-trays', label: 'Meal Trays' },
  { value: 'food-containers', label: 'Food Containers' },
  { value: 'bagasse-products', label: 'Bagasse Products' },
  { value: 'aluminium-containers', label: 'Aluminium Containers' },
  { value: 'paper-products', label: 'Paper Products' },
  { value: 'eco-friendly', label: 'Eco Friendly' },
  { value: 'shakes-mocktail', label: 'Shakes & Mocktail' },
  { value: 'print-customization', label: 'Print & Customization' },
];

const staticProducts = [
  { id: 1, name: 'Round Food Container With LID 8 Oz Tall 250Ml', price: 175, capacity: '250ml', category: 'food-containers', image: 'https://www.disposoul.com/cdn/shop/files/03_8-oz-tall-single-stack.jpg?v=1731492208&width=533' },
  { id: 2, name: 'Round Food Container With LID 16 Oz 500Ml', price: 250, capacity: '500ml', category: 'food-containers', image: 'https://www.disposoul.com/cdn/shop/files/02_16-oz-4.jpg?v=1734081230&width=533' },
  { id: 3, name: 'Round Food Container With LID 2 Oz 50Ml', price: 170, capacity: '50ml', category: 'food-containers', image: 'https://www.disposoul.com/cdn/shop/files/01_02oz.jpg?v=1731491556&width=533' },
  { id: 4, name: '3 Compartment Meal Box Tray With Lid Mini', price: 212.50, capacity: 'Mini', category: 'meal-trays', image: 'https://www.disposoul.com/cdn/shop/files/73.jpg?v=1738214639&width=533' },
  { id: 5, name: 'Round Food Container With LID 10 Oz 300Ml', price: 225, capacity: '300ml', category: 'food-containers', image: 'https://www.disposoul.com/cdn/shop/files/04_10oz-stack.jpg?v=1731492677&width=533' },
  { id: 6, name: 'Sauce & Dip Transparent Hinge Lid Container 35Ml', price: 120, capacity: '35ml', category: 'food-containers', image: 'https://www.disposoul.com/cdn/shop/files/35_ml_transparent.jpg?v=1751969860&width=533' },
  { id: 7, name: 'Round Food Container With LID 4 Oz 100Ml', price: 250, capacity: '100ml', category: 'food-containers', image: 'https://www.disposoul.com/cdn/shop/files/01_4oz-2.jpg?v=1731492043&width=533' },
  { id: 8, name: 'Round Food Container Premium Series RO 16 480ML', price: 350, capacity: '480ml', category: 'food-containers', image: 'https://www.disposoul.com/cdn/shop/files/04_RO-16.jpg?v=1737358860&width=533' },
  { id: 9, name: 'Bagasse Round Plate 6 inch', price: 180, capacity: '6 inch', category: 'bagasse-products', image: 'https://www.disposoul.com/cdn/shop/collections/WhatsApp_Image_2024-05-27_at_11.14.48.jpg?v=1737971197&width=600' },
  { id: 10, name: 'Bagasse Square Plate 8 inch', price: 220, capacity: '8 inch', category: 'bagasse-products', image: 'https://www.disposoul.com/cdn/shop/collections/WhatsApp_Image_2024-05-27_at_11.14.48.jpg?v=1737971197&width=600' },
  { id: 11, name: 'Aluminium Container 250ml', price: 150, capacity: '250ml', category: 'aluminium-containers', image: 'https://www.disposoul.com/cdn/shop/collections/WhatsApp_Image_2024-05-27_at_11.14.34_2.jpg?v=1738070448&width=600' },
  { id: 12, name: 'Paper Cup 200ml', price: 90, capacity: '200ml', category: 'paper-products', image: 'https://www.disposoul.com/cdn/shop/collections/Paper_Products1.png?v=1738215936&width=600' },
  { id: 13, name: 'Eco Wooden Cutlery Set', price: 85, capacity: 'Set of 3', category: 'eco-friendly', image: 'https://www.disposoul.com/cdn/shop/collections/ECO_FRIENDLY_PRODUCTS.png?v=1738215979&width=600' },
  { id: 14, name: 'Shake Glass 350ml', price: 130, capacity: '350ml', category: 'shakes-mocktail', image: 'https://www.disposoul.com/cdn/shop/collections/plastic-shake-glass.jpg?v=1738216085&width=600' },
  { id: 15, name: '2 Compartment Meal Box Tray With Lid', price: 212.50, capacity: 'Standard', category: 'meal-trays', image: 'https://www.disposoul.com/cdn/shop/files/70.jpg?v=1738214549&width=533' },
  { id: 16, name: 'Rectangular Food Container With LID 500 ml', price: 325, capacity: '500ml', category: 'food-containers', image: 'https://www.disposoul.com/cdn/shop/files/01_650-1_1000-X-1000-px-1.jpg?v=1731584138&width=533' },
];

export default function Shop() {
  const urlParams = new URLSearchParams(window.location.search);
  const initialCategory = urlParams.get('category') || 'all';
  
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('featured');
  const [gridCols, setGridCols] = useState(4);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: () => utc.entities.Product.list('-created_date', 100),
  });

  const displayProducts = products.length > 0 ? products : staticProducts;

  const filteredProducts = displayProducts.filter(product => {
    if (selectedCategory === 'all') return true;
    return product.category === selectedCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const currentCategoryLabel = categories.find(c => c.value === selectedCategory)?.label || 'All Products';

  return (
    <div className="min-h-screen bg-neutral-950 pt-20">
      {/* Header Banner */}
      <div className="bg-neutral-900 py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-light tracking-tight text-white"
          >
            {currentCategoryLabel}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-neutral-400"
          >
            {sortedProducts.length} products
          </motion.p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="sticky top-16 md:top-20 bg-neutral-900 border-b border-neutral-800 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Mobile Filter Button */}
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="md:hidden rounded-none">
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                  <div>
                    <h4 className="font-medium mb-4">Category</h4>
                    <div className="space-y-3">
                      {categories.map((category) => (
                        <label 
                          key={category.value} 
                          className="flex items-center gap-3 cursor-pointer"
                        >
                          <Checkbox 
                            checked={selectedCategory === category.value}
                            onCheckedChange={() => {
                              setSelectedCategory(category.value);
                              setIsFilterOpen(false);
                            }}
                          />
                          <span className="text-sm">{category.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Desktop Category Filter */}
            <div className="hidden md:flex items-center gap-2 flex-wrap">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`px-4 py-2 text-sm transition-colors ${
                    selectedCategory === category.value
                      ? 'bg-amber-500 text-black'
                      : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>

            {/* Sort & Grid */}
            <div className="flex items-center gap-3">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[160px] rounded-none">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="name">Alphabetically</SelectItem>
                </SelectContent>
              </Select>


            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`grid grid-cols-2 gap-4 md:gap-6 ${
              gridCols === 3 ? 'md:grid-cols-3' : 'md:grid-cols-3 lg:grid-cols-4'
            }`}
          >
            {sortedProducts.map((product, index) => (
              <Product3DCard 
                key={product.id} 
                product={product} 
                index={index}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {sortedProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-neutral-400 text-lg">No products found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}