import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { utc } from '@/api/utcClient';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

const staticSlides = [
  {
    image: 'https://www.disposoul.com/cdn/shop/files/71336b99-5520-489e-ada5-bb53168653c5.jpg?v=1759738263&width=3840',
    title: 'Premium Food Containers',
    subtitle: 'Reusable & Durable Solutions'
  },
  {
    image: 'https://www.disposoul.com/cdn/shop/files/808c0260-6377-44ef-95d0-1ddd9c35b1a3.jpg?v=1759738304&width=3840',
    title: 'Eco-Friendly Products',
    subtitle: 'Sustainable Packaging Solutions'
  },
  {
    image: 'https://www.disposoul.com/cdn/shop/files/0c428bb8-5b75-47ce-a785-c1dd1602b889.jpg?v=1759738328&width=3840',
    title: 'Bagasse Products',
    subtitle: 'Natural & Biodegradable'
  }
];

export default function HeroSlider() {
  const { data: banners = [] } = useQuery({
    queryKey: ['banners'],
    queryFn: async () => {
      const allBanners = await utc.entities.Banner.list('order', 100);
      return allBanners.filter(b => b.is_active);
    },
  });

  const slides = banners.length > 0 ? banners.map(b => ({
    image: b.image,
    title: b.title,
    subtitle: b.subtitle || ''
  })) : staticSlides;

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const goToSlide = (index) => setCurrentSlide(index);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);

  return (
    <div className="relative w-full h-[60vh] md:h-[85vh] overflow-hidden bg-neutral-100">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
          >
            <div className="absolute inset-0 bg-black/30" />
          </div>
          
          <div className="relative h-full flex items-center justify-center">
            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-center text-white px-4"
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tight mb-4">
                {slides[currentSlide].title}
              </h1>
              <p className="text-lg md:text-xl font-light mb-8 opacity-90">
                {slides[currentSlide].subtitle}
              </p>
              <Button 
                className="bg-amber-500 text-black hover:bg-amber-400 px-8 py-6 text-sm tracking-widest uppercase font-medium rounded-none shadow-lg shadow-amber-500/50"
              >
                Shop Now
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-2 text-white/80 hover:text-white transition-colors"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-2 text-white/80 hover:text-white transition-colors"
      >
        <ChevronRight className="w-8 h-8" />
      </button>

      {/* Dots & Pause */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4">
        <div className="flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-white w-8' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
        <button 
          onClick={() => setIsPaused(!isPaused)}
          className="p-2 text-white/80 hover:text-white transition-colors"
        >
          {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}