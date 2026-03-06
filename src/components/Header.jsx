import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Search, ShoppingCart, Menu, X, ChevronDown, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const collections = [
  { name: 'Meal Trays', slug: 'meal-trays' },
  { name: 'Food Containers', slug: 'food-containers' },
  { name: 'Bagasse Products', slug: 'bagasse-products' },
  { name: 'Aluminium Containers', slug: 'aluminium-containers' },
  { name: 'Paper Products', slug: 'paper-products' },
  { name: 'Eco Friendly', slug: 'eco-friendly' },
  { name: 'Shakes & Mocktail', slug: 'shakes-mocktail' },
  { name: 'Print & Customization', slug: 'print-customization' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-neutral-900 shadow-lg' : 'bg-neutral-900/95 backdrop-blur-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 -ml-2 text-white"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Navigation - Desktop */}
            <nav className="hidden md:flex items-center gap-8">
              <Link 
                to={createPageUrl('Home')} 
                className="text-sm tracking-wide text-neutral-300 hover:text-amber-400 transition-colors"
              >
                Home
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 text-sm tracking-wide text-neutral-300 hover:text-amber-400 transition-colors">
                  Our Collection
                  <ChevronDown className="w-4 h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-neutral-800 border-neutral-700">
                  {collections.map((collection) => (
                    <DropdownMenuItem key={collection.slug} asChild className="text-neutral-200 hover:text-amber-400 focus:text-amber-400">
                      <Link to={createPageUrl(`Shop?category=${collection.slug}`)}>
                        {collection.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Link 
                to={createPageUrl('Shop')} 
                className="text-sm tracking-wide text-neutral-300 hover:text-amber-400 transition-colors"
              >
                Shop
              </Link>
              
              <Link 
                to={createPageUrl('BulkOrders')} 
                className="text-sm tracking-wide text-neutral-300 hover:text-amber-400 transition-colors"
              >
                Bulk Orders
              </Link>
              
              <Link 
                to={createPageUrl('Contact')} 
                className="text-sm tracking-wide text-neutral-300 hover:text-amber-400 transition-colors"
              >
                Contact Us
              </Link>
            </nav>

            <div className="hidden md:block h-6 w-px bg-neutral-700 mx-4"></div>

            <Link 
              to={createPageUrl('OrderTracking')} 
              className="hidden md:flex items-center gap-2 text-sm tracking-wide text-neutral-300 hover:text-amber-400 transition-colors"
            >
              <Package className="w-4 h-4" />
              Track Order
            </Link>

            <Link 
              to={createPageUrl('AdminLogin')} 
              className="hidden md:block text-sm tracking-wide text-amber-400 hover:text-amber-300 transition-colors font-medium"
            >
              Admin
            </Link>

            {/* Logo */}
            <Link 
              to={createPageUrl('Home')} 
              className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0"
            >
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/utc-prod/public/695f409ea784b9d3881e695f/d4a535b6b_WhatsAppImage2025-10-21at013134.jpg"
                alt="UTC Logo"
                className="h-12 md:h-14 w-auto"
              />
            </Link>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="p-2 hover:bg-neutral-800 rounded-full transition-colors text-white"
              >
                <Search className="w-5 h-5" />
              </button>
              <Link 
                to={createPageUrl('Cart')}
                className="p-2 hover:bg-neutral-800 rounded-full transition-colors relative text-white"
              >
                <ShoppingCart className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 left-0 bottom-0 w-80 bg-white z-50 overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <img 
                    src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/utc-prod/public/695f409ea784b9d3881e695f/d4a535b6b_WhatsAppImage2025-10-21at013134.jpg"
                    alt="UTC Logo"
                    className="h-10 w-auto"
                  />
                  <button onClick={() => setIsMobileMenuOpen(false)}>
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <nav className="space-y-4">
                  <Link 
                    to={createPageUrl('Home')} 
                    className="block py-2 text-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                  
                  <div className="py-2">
                    <p className="text-lg font-medium mb-3">Our Collection</p>
                    <div className="pl-4 space-y-2">
                      {collections.map((collection) => (
                        <Link 
                          key={collection.slug}
                          to={createPageUrl(`Shop?category=${collection.slug}`)}
                          className="block py-1 text-neutral-600"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {collection.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                  
                  <Link 
                    to={createPageUrl('Shop')} 
                    className="block py-2 text-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Shop
                  </Link>
                  
                  <Link 
                    to={createPageUrl('BulkOrders')} 
                    className="block py-2 text-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Bulk Orders
                  </Link>
                  
                  <Link 
                    to={createPageUrl('Contact')} 
                    className="block py-2 text-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Contact Us
                  </Link>

                  <div className="border-t border-neutral-700 my-4"></div>

                  <Link 
                    to={createPageUrl('OrderTracking')} 
                    className="block py-2 text-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Track Order
                  </Link>

                  <Link 
                    to={createPageUrl('AdminLogin')} 
                    className="block py-2 text-lg text-amber-400 font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Admin Login
                  </Link>
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white z-50 flex items-start justify-center pt-32"
          >
            <div className="w-full max-w-2xl px-6">
              <div className="flex items-center justify-end mb-8">
                <button onClick={() => setIsSearchOpen(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full text-2xl md:text-4xl border-b-2 border-neutral-200 pb-4 outline-none focus:border-black transition-colors"
                  autoFocus
                />
                <Search className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 text-neutral-400" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}