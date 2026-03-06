import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { utc } from '@/api/utcClient';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Facebook, Instagram, Twitter, Youtube, Mail, MapPin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Footer() {
  const { data: settings = [] } = useQuery({
    queryKey: ['site-settings'],
    queryFn: () => utc.entities.SiteSettings.list('-created_date', 100),
  });

  const getSetting = (key, defaultValue = '') => {
    const setting = settings.find(s => s.setting_key === key);
    return setting?.setting_value || defaultValue;
  };

  return (
    <footer className="bg-neutral-900 text-white">
      {/* Newsletter Section */}
      <div className="border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-light mb-4">
              Subscribe to our newsletter
            </h3>
            <p className="text-neutral-400 mb-6">
              Get the latest updates on new products and upcoming sales
            </p>
            <div className="flex gap-2">
              <Input 
                placeholder="Enter your email" 
                className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 rounded-none h-12"
              />
              <Button className="bg-amber-500 text-black hover:bg-amber-400 rounded-none h-12 px-8 font-medium">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/utc-prod/public/695f409ea784b9d3881e695f/d4a535b6b_WhatsAppImage2025-10-21at013134.jpg"
              alt="UTC Logo"
              className="h-16 w-auto mb-4"
            />
            <p className="text-neutral-400 text-sm leading-relaxed mb-6">
              UTC offers a wide range of disposable food packaging from corn-starch containers to tamper-proof solutions designed for restaurants, cloud kitchens, and takeaways.
            </p>
            <div className="flex gap-4">
              {getSetting('facebook_url') && (
                <a href={getSetting('facebook_url')} target="_blank" rel="noopener noreferrer" className="p-2 bg-neutral-800 hover:bg-neutral-700 transition-colors rounded-full">
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {getSetting('instagram_url') && (
                <a href={getSetting('instagram_url')} target="_blank" rel="noopener noreferrer" className="p-2 bg-neutral-800 hover:bg-neutral-700 transition-colors rounded-full">
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {getSetting('twitter_url') && (
                <a href={getSetting('twitter_url')} target="_blank" rel="noopener noreferrer" className="p-2 bg-neutral-800 hover:bg-neutral-700 transition-colors rounded-full">
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {getSetting('youtube_url') && (
                <a href={getSetting('youtube_url')} target="_blank" rel="noopener noreferrer" className="p-2 bg-neutral-800 hover:bg-neutral-700 transition-colors rounded-full">
                  <Youtube className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold tracking-wider uppercase mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link to={createPageUrl('Shop')} className="text-neutral-400 hover:text-white transition-colors text-sm">
                  All Products
                </Link>
              </li>
              <li>
                <Link to={createPageUrl('Shop?category=food-containers')} className="text-neutral-400 hover:text-white transition-colors text-sm">
                  Food Containers
                </Link>
              </li>
              <li>
                <Link to={createPageUrl('Shop?category=bagasse-products')} className="text-neutral-400 hover:text-white transition-colors text-sm">
                  Bagasse Products
                </Link>
              </li>
              <li>
                <Link to={createPageUrl('Shop?category=eco-friendly')} className="text-neutral-400 hover:text-white transition-colors text-sm">
                  Eco Friendly
                </Link>
              </li>
              <li>
                <Link to={createPageUrl('BulkOrders')} className="text-neutral-400 hover:text-white transition-colors text-sm">
                  Bulk Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-sm font-semibold tracking-wider uppercase mb-6">Customer Service</h4>
            <ul className="space-y-3">
              <li>
                <Link to={createPageUrl('Contact')} className="text-neutral-400 hover:text-white transition-colors text-sm">
                  Contact Us
                </Link>
              </li>
              <li>
                <a href="#" className="text-neutral-400 hover:text-white transition-colors text-sm">
                  Shipping Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-400 hover:text-white transition-colors text-sm">
                  Return Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-400 hover:text-white transition-colors text-sm">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-400 hover:text-white transition-colors text-sm">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold tracking-wider uppercase mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-neutral-500 mt-0.5 flex-shrink-0" />
                <span className="text-neutral-400 text-sm">
                  {getSetting('address', '123 Business Park, Industrial Area, Mumbai, India')}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-neutral-500 flex-shrink-0" />
                <span className="text-neutral-400 text-sm">{getSetting('phone', '+91 98765 43210')}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-neutral-500 flex-shrink-0" />
                <span className="text-neutral-400 text-sm">{getSetting('email', 'info@base44.com')}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col items-center md:items-start gap-1">
              <p className="text-neutral-500 text-sm">
                © 2025 UTC. All rights reserved.
              </p>
              <p className="text-neutral-600 text-xs">
                Made with ❤️ by <span className="text-cyan-400 font-medium">nirajsavlani</span>
              </p>
            </div>
            <div className="flex items-center gap-6">
              <img src="https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.en/assets/visa.sxIq5Dot.svg" alt="Visa" className="h-6 opacity-50" />
              <img src="https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.en/assets/mastercard.1c4_lyMp.svg" alt="Mastercard" className="h-6 opacity-50" />
              <img src="https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.en/assets/amex.CEHhgcx-.svg" alt="Amex" className="h-6 opacity-50" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}