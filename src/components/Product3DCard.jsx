import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ShoppingCart, Eye, MousePointer2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Product3DCard({ product, index }) {
  const ref = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  const addToCart = (e) => {
    e.preventDefault();
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  return (
    <Link to={createPageUrl('ProductDetail') + `?id=${product.id}`}>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.5 }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          scale: isHovered ? 1.02 : 1,
          transformStyle: "preserve-3d",
          transition: "scale 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
        className="relative group cursor-pointer"
      >
        {/* Premium Glow Effect */}
        <motion.div
          animate={{
            opacity: isHovered ? 0.6 : 0,
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute -inset-4 bg-gradient-to-r from-slate-500/20 via-cyan-500/20 to-blue-500/20 rounded-3xl blur-3xl"
          style={{ transform: "translateZ(-50px)" }}
        />
        
        {/* Interactive Cursor Indicator */}
        <motion.div
          animate={{
            opacity: isHovered ? 0.7 : 0,
            scale: isHovered ? 1 : 0.8,
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="absolute top-4 right-4 z-20 pointer-events-none"
          style={{ transform: "translateZ(80px)" }}
        >
          <MousePointer2 className="w-5 h-5 text-slate-300/80 drop-shadow-[0_0_10px_rgba(148,163,184,0.6)]" />
        </motion.div>

        {/* Card */}
        <div
          className="relative bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-2xl rounded-2xl overflow-hidden border border-slate-700/30 group-hover:border-slate-500/50 transition-all duration-700 shadow-2xl"
          style={{ 
            transform: "translateZ(60px)",
            boxShadow: isHovered 
              ? "0 30px 60px -15px rgba(0, 0, 0, 0.9), 0 10px 40px -10px rgba(100, 116, 139, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)" 
              : "0 10px 30px -10px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.03)"
          }}
        >
          {/* Image Container */}
          <div className="relative h-64 overflow-hidden bg-slate-900/50" style={{ transform: "translateZ(25px)" }}>
            <motion.img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              animate={{
                scale: isHovered ? 1.08 : 1,
              }}
              transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
            />
            
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            {/* Subtle Shine Effect */}
            <motion.div
              animate={{
                opacity: isHovered ? 0.15 : 0,
              }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/10 via-transparent to-transparent"
            />
            
            {/* Floating Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{
                opacity: isHovered ? 1 : 0,
                y: isHovered ? 0 : 15,
              }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 px-4"
              style={{ transform: "translateZ(70px)" }}
            >
              <Button
                onClick={addToCart}
                className="bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white flex items-center gap-2 shadow-xl border border-slate-600/30 backdrop-blur-sm"
              >
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </Button>
              <Button
                variant="outline"
                className="border-slate-600/40 text-slate-300 hover:bg-slate-800/50 shadow-xl backdrop-blur-sm"
              >
                <Eye className="w-4 h-4" />
              </Button>
            </motion.div>

            {/* Bestseller Badge */}
            {product.is_bestseller && (
              <motion.div 
                animate={{ opacity: isHovered ? 1 : 0.9 }}
                className="absolute top-3 left-3 bg-gradient-to-r from-slate-700 to-slate-800 text-slate-200 px-3 py-1.5 rounded-full text-xs font-semibold shadow-xl border border-slate-600/30 backdrop-blur-md" 
                style={{ transform: "translateZ(70px)" }}
              >
                ⭐ BESTSELLER
              </motion.div>
            )}
          </div>

          {/* Content */}
          <div className="p-5 space-y-3" style={{ transform: "translateZ(50px)" }}>
            <div>
              <h3 className="font-semibold text-white text-lg line-clamp-2 group-hover:text-slate-100 transition-colors duration-300">
                {product.name}
              </h3>
              {product.capacity && (
                <p className="text-slate-500 text-sm mt-1">{product.capacity}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-2xl font-bold text-white">₹{product.price}</span>
                {product.category && (
                  <p className="text-slate-600 text-xs mt-1 capitalize">{product.category.replace('-', ' ')}</p>
                )}
              </div>
              
              {/* 3D Floating Icon */}
              <motion.div
                animate={{
                  y: isHovered ? -4 : 0,
                }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                className="w-12 h-12 bg-gradient-to-br from-slate-700 to-slate-800 rounded-full flex items-center justify-center shadow-lg border border-slate-600/30"
                style={{ transform: "translateZ(60px)" }}
              >
                <ShoppingCart className="w-5 h-5 text-slate-200" />
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}