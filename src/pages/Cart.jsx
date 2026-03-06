import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const cart = localStorage.getItem('cart');
    if (cart) {
      setCartItems(JSON.parse(cart));
    }
  }, []);

  const updateCart = (newCart) => {
    setCartItems(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    const newCart = cartItems.map(item =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    updateCart(newCart);
  };

  const removeItem = (itemId) => {
    const newCart = cartItems.filter(item => item.id !== itemId);
    updateCart(newCart);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = subtotal > 999 ? 0 : 50;
  const total = subtotal + shippingCost;

  return (
    <div className="min-h-screen bg-neutral-950 pt-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-16">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-light tracking-tight text-white mb-8"
        >
          Shopping Cart
        </motion.h1>

        {cartItems.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <ShoppingBag className="w-16 h-16 mx-auto mb-6 text-neutral-700" />
            <h2 className="text-xl font-medium text-white mb-2">Your cart is empty</h2>
            <p className="text-neutral-400 mb-8">Looks like you haven't added anything to your cart yet.</p>
            <Link to={createPageUrl('Shop')}>
              <Button className="bg-amber-500 hover:bg-amber-400 text-black rounded-none px-8 h-12 font-medium shadow-lg shadow-amber-500/50">
                Continue Shopping
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-4 p-4 border border-neutral-800 bg-neutral-900"
                >
                  <div className="w-24 h-24 bg-neutral-800 flex-shrink-0 rounded overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-white truncate">{item.name}</h3>
                    <p className="text-sm text-neutral-400 mt-1">{item.capacity}</p>
                    <p className="font-medium text-amber-400 mt-2">₹{item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-neutral-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="flex items-center border border-neutral-700">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 hover:bg-neutral-800 text-white"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-sm text-white">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 hover:bg-neutral-800 text-white"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Order Summary */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-neutral-900 border border-neutral-800 p-6 h-fit"
            >
              <h2 className="text-lg font-medium mb-6 text-white">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-400">Subtotal</span>
                  <span className="text-white">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-400">Shipping</span>
                  <span className="text-white">{shippingCost === 0 ? 'FREE' : `₹${shippingCost.toFixed(2)}`}</span>
                </div>
                {subtotal < 999 && (
                  <p className="text-xs text-neutral-500">Free shipping on orders above ₹999</p>
                )}
              </div>

              <div className="border-t border-neutral-800 pt-4 mb-6">
                <div className="flex justify-between font-medium text-lg">
                  <span className="text-white">Total</span>
                  <span className="text-amber-400">₹{total.toFixed(2)}</span>
                </div>
              </div>

              <Link to={createPageUrl('Checkout')}>
                <Button className="w-full bg-amber-500 hover:bg-amber-400 text-black rounded-none h-12 font-medium shadow-lg shadow-amber-500/50">
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>

              <Link 
                to={createPageUrl('Shop')}
                className="block text-center text-sm text-neutral-400 hover:text-amber-400 mt-4"
              >
                Continue Shopping
              </Link>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}