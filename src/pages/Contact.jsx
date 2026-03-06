import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-neutral-950 pt-20">
      {/* Hero Section */}
      <div className="bg-neutral-900 py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-light tracking-tight text-white mb-4"
          >
            Contact Us
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-neutral-300 text-lg"
          >
            We'd love to hear from you. Get in touch with our team.
          </motion.p>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-2xl font-light text-white mb-6">Get in Touch</h2>
                <p className="text-neutral-300 leading-relaxed">
                  Have questions about our products or need help with an order? 
                  Our team is here to help you find the perfect packaging solutions for your business.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-neutral-800 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white mb-1">Visit Us</h3>
                    <p className="text-neutral-300 text-sm">
                      123 Business Park, Industrial Area<br />
                      Mumbai, Maharashtra 400001<br />
                      India
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-neutral-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-neutral-900 mb-1">Call Us</h3>
                    <p className="text-neutral-600 text-sm">
                      +91 98765 43210<br />
                      +91 98765 43211
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-neutral-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-neutral-900 mb-1">Email Us</h3>
                    <p className="text-neutral-600 text-sm">
                      info@disposoul.com<br />
                      support@disposoul.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-neutral-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-neutral-900 mb-1">Business Hours</h3>
                    <p className="text-neutral-600 text-sm">
                      Monday - Saturday: 9:00 AM - 7:00 PM<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {isSubmitted ? (
                <div className="bg-neutral-900 p-12 text-center">
                  <CheckCircle className="w-16 h-16 text-amber-400 mx-auto mb-6" />
                  <h3 className="text-2xl font-medium text-white mb-2">Message Sent!</h3>
                  <p className="text-neutral-300">
                    Thank you for reaching out. We'll get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-neutral-900 p-8 md:p-10 space-y-6">
                  <h3 className="text-xl font-medium text-white mb-6">Send us a Message</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-white">Your Name *</Label>
                      <Input 
                        id="name"
                        placeholder="John Doe"
                        className="rounded-none h-12 bg-neutral-800 border-neutral-700 text-white"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input 
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        className="rounded-none h-12 bg-white"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        className="rounded-none h-12 bg-white"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Input 
                        id="subject"
                        placeholder="How can we help?"
                        className="rounded-none h-12 bg-white"
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Your Message *</Label>
                    <Textarea 
                      id="message"
                      placeholder="Write your message here..."
                      className="rounded-none min-h-[150px] bg-white"
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-amber-500 hover:bg-amber-400 text-black rounded-none h-14 text-sm tracking-wide font-medium shadow-lg shadow-amber-500/50"
                  >
                    Send Message
                    <Send className="w-4 h-4 ml-2" />
                  </Button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="h-96 bg-neutral-200">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.11609823277!2d72.74109995!3d19.08219865!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1635835000000!5m2!1sen!2sin"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Location Map"
        />
      </div>
    </div>
  );
}