import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Phone, Mail, Package, Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function BulkOrders() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    businessType: '',
    productInterest: '',
    estimatedQuantity: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-neutral-950 pt-20">
      {/* Hero Section */}
      <div className="relative bg-neutral-900 py-20 md:py-32">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80)' }}
        />
        <div className="relative max-w-4xl mx-auto px-4 md:px-6 text-center text-white">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-light tracking-tight mb-6"
          >
            Bulk Orders
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto"
          >
            Special pricing for restaurants, cafés, cloud kitchens, and businesses. 
            Get quality packaging at wholesale prices.
          </motion.p>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16 md:py-20 bg-neutral-900">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Package,
                title: 'Wholesale Pricing',
                description: 'Get significant discounts on bulk orders with competitive wholesale rates'
              },
              {
                icon: Building2,
                title: 'Custom Branding',
                description: 'Add your logo and branding to packaging for a professional look'
              },
              {
                icon: CheckCircle,
                title: 'Dedicated Support',
                description: 'Personal account manager for all your packaging needs'
              }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-14 h-14 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">{benefit.title}</h3>
                <p className="text-neutral-300 text-sm">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-light tracking-tight text-white mb-4">
              Request a Quote
            </h2>
            <p className="text-neutral-300">
              Fill out the form below and our team will get back to you within 24 hours
            </p>
          </motion.div>

          {isSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 bg-neutral-900"
            >
              <CheckCircle className="w-16 h-16 text-amber-400 mx-auto mb-6" />
              <h3 className="text-2xl font-medium text-white mb-2">Thank You!</h3>
              <p className="text-neutral-300">
                We've received your inquiry. Our team will contact you within 24 hours.
              </p>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="businessName" className="text-white">Business Name *</Label>
                  <Input 
                    id="businessName"
                    placeholder="Your business name"
                    className="rounded-none h-12 bg-neutral-900 border-neutral-800 text-white"
                    required
                    value={formData.businessName}
                    onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactName">Contact Person *</Label>
                  <Input 
                    id="contactName"
                    placeholder="Your name"
                    className="rounded-none h-12"
                    required
                    value={formData.contactName}
                    onChange={(e) => setFormData({...formData, contactName: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input 
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    className="rounded-none h-12"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input 
                    id="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    className="rounded-none h-12"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Business Type</Label>
                  <Select 
                    value={formData.businessType}
                    onValueChange={(value) => setFormData({...formData, businessType: value})}
                  >
                    <SelectTrigger className="rounded-none h-12">
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="restaurant">Restaurant</SelectItem>
                      <SelectItem value="cafe">Café</SelectItem>
                      <SelectItem value="cloud-kitchen">Cloud Kitchen</SelectItem>
                      <SelectItem value="catering">Catering Service</SelectItem>
                      <SelectItem value="hotel">Hotel</SelectItem>
                      <SelectItem value="distributor">Distributor</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Product Interest</Label>
                  <Select 
                    value={formData.productInterest}
                    onValueChange={(value) => setFormData({...formData, productInterest: value})}
                  >
                    <SelectTrigger className="rounded-none h-12">
                      <SelectValue placeholder="Select product category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="food-containers">Food Containers</SelectItem>
                      <SelectItem value="meal-trays">Meal Trays</SelectItem>
                      <SelectItem value="bagasse-products">Bagasse Products</SelectItem>
                      <SelectItem value="paper-products">Paper Products</SelectItem>
                      <SelectItem value="all">All Products</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Estimated Monthly Quantity</Label>
                <Input 
                  id="quantity"
                  placeholder="e.g., 5000 pieces"
                  className="rounded-none h-12"
                  value={formData.estimatedQuantity}
                  onChange={(e) => setFormData({...formData, estimatedQuantity: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Additional Requirements</Label>
                <Textarea 
                  id="message"
                  placeholder="Tell us about your specific requirements, custom branding needs, etc."
                  className="rounded-none min-h-[120px]"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-amber-500 hover:bg-amber-400 text-black rounded-none h-14 text-sm tracking-wide font-medium shadow-lg shadow-amber-500/50"
              >
                Submit Inquiry
                <Send className="w-4 h-4 ml-2" />
              </Button>
            </motion.form>
          )}
        </div>
      </div>

      {/* Contact Info */}
      <div className="bg-neutral-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-white/60 text-sm">Call us directly</p>
                <p className="text-lg font-medium">+91 98765 43210</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-white/60 text-sm">Email for bulk orders</p>
                <p className="text-lg font-medium">bulk@disposoul.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}