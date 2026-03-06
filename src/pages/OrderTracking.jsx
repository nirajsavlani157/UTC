import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { utc } from '@/api/utcClient';
import { motion } from 'framer-motion';
import { Phone, Lock, Package, Truck, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function OrderTracking() {
  const [step, setStep] = useState('phone'); // 'phone', 'otp', 'orders'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { data: orders = [], refetch } = useQuery({
    queryKey: ['customer-orders', phoneNumber],
    queryFn: () => utc.entities.Order.filter({ customer_phone: phoneNumber }, '-created_date', 50),
    enabled: step === 'orders',
  });

  const handleSendOtp = () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      alert('Please enter a valid phone number');
      return;
    }
    
    setIsLoading(true);
    // Generate 6-digit OTP
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    
    // Simulate sending OTP (in production, use SMS service)
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
      alert(`Your OTP is: ${newOtp}\n(In production, this would be sent via SMS)`);
    }, 1000);
  };

  const handleVerifyOtp = () => {
    if (otp === generatedOtp) {
      setStep('orders');
      refetch();
    } else {
      alert('Invalid OTP. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      processing: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      shipped: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      delivered: 'bg-green-500/20 text-green-400 border-green-500/30',
      cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
    };
    return colors[status] || colors.pending;
  };

  const getExpectedDelivery = (createdDate, status) => {
    if (status === 'delivered') return 'Delivered';
    if (status === 'cancelled') return 'Cancelled';
    
    const date = new Date(createdDate);
    date.setDate(date.getDate() + 7); // 7 days from order
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (step === 'phone') {
    return (
      <div className="min-h-screen bg-neutral-950 pt-20 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          <Card className="bg-neutral-900 border-neutral-800">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-slate-700 to-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-white">Track Your Order</CardTitle>
              <p className="text-neutral-400 text-sm mt-2">
                Enter your phone number to view order status
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-white">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="pl-10 bg-neutral-800 border-neutral-700 text-white"
                    maxLength={10}
                  />
                </div>
              </div>
              <Button
                onClick={handleSendOtp}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white h-12"
              >
                {isLoading ? 'Sending OTP...' : 'Send OTP'}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (step === 'otp') {
    return (
      <div className="min-h-screen bg-neutral-950 pt-20 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          <Card className="bg-neutral-900 border-neutral-800">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-slate-700 to-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-white">Enter OTP</CardTitle>
              <p className="text-neutral-400 text-sm mt-2">
                We've sent a 6-digit code to {phoneNumber}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp" className="text-white">OTP Code</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="text-center text-2xl tracking-widest bg-neutral-800 border-neutral-700 text-white"
                  maxLength={6}
                />
              </div>
              <Button
                onClick={handleVerifyOtp}
                className="w-full bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white h-12"
              >
                Verify & Continue
              </Button>
              <button
                onClick={() => setStep('phone')}
                className="w-full text-sm text-neutral-400 hover:text-white transition-colors"
              >
                Change phone number
              </button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 pt-20">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-light text-white mb-2">Your Orders</h1>
            <p className="text-neutral-400">Logged in as {phoneNumber}</p>
          </div>
          <Button
            onClick={() => {
              setStep('phone');
              setPhoneNumber('');
              setOtp('');
            }}
            variant="outline"
            className="border-neutral-700 text-white"
          >
            Logout
          </Button>
        </div>

        {orders.length === 0 ? (
          <Card className="bg-neutral-900 border-neutral-800">
            <CardContent className="p-12 text-center">
              <Package className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
              <p className="text-neutral-400 text-lg">No orders found</p>
              <p className="text-neutral-500 text-sm mt-2">Orders placed with this phone number will appear here</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="bg-neutral-900 border-neutral-800">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-white text-xl mb-2">
                          Order #{order.order_number}
                        </CardTitle>
                        <p className="text-neutral-400 text-sm">
                          Placed on {new Date(order.created_date).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status.toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Order Items */}
                    <div className="space-y-3">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="flex gap-3">
                          <div className="w-16 h-16 bg-neutral-800 rounded flex-shrink-0">
                            {item.image && (
                              <img src={item.image} alt={item.product_name} className="w-full h-full object-cover rounded" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-white text-sm">{item.product_name}</p>
                            <p className="text-neutral-400 text-xs">Qty: {item.quantity}</p>
                            <p className="text-amber-400 text-sm font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Summary */}
                    <div className="border-t border-neutral-800 pt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-400">Total Amount</span>
                        <span className="text-white font-medium">₹{order.total?.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-400">Payment Method</span>
                        <span className="text-white">{order.payment_method?.toUpperCase()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-400">Payment Status</span>
                        <span className={order.payment_status === 'paid' ? 'text-green-400' : 'text-yellow-400'}>
                          {order.payment_status?.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-400">Expected Delivery</span>
                        <span className="text-white">{getExpectedDelivery(order.created_date, order.status)}</span>
                      </div>
                    </div>

                    {/* Tracking Timeline */}
                    <div className="border-t border-neutral-800 pt-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Truck className="w-5 h-5 text-neutral-400" />
                        <span className="text-white font-medium">Order Status</span>
                      </div>
                      <div className="flex items-center gap-2 md:gap-4">
                        <div className="flex flex-col items-center gap-1 flex-1">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            ['pending', 'processing', 'shipped', 'delivered'].includes(order.status)
                              ? 'bg-green-500/20 border-2 border-green-500'
                              : 'bg-neutral-800 border-2 border-neutral-700'
                          }`}>
                            <Clock className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-xs text-neutral-400">Pending</span>
                        </div>
                        <div className="flex-1 h-0.5 bg-neutral-800"></div>
                        <div className="flex flex-col items-center gap-1 flex-1">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            ['processing', 'shipped', 'delivered'].includes(order.status)
                              ? 'bg-green-500/20 border-2 border-green-500'
                              : 'bg-neutral-800 border-2 border-neutral-700'
                          }`}>
                            <Package className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-xs text-neutral-400">Processing</span>
                        </div>
                        <div className="flex-1 h-0.5 bg-neutral-800"></div>
                        <div className="flex flex-col items-center gap-1 flex-1">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            ['shipped', 'delivered'].includes(order.status)
                              ? 'bg-green-500/20 border-2 border-green-500'
                              : 'bg-neutral-800 border-2 border-neutral-700'
                          }`}>
                            <Truck className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-xs text-neutral-400">Shipped</span>
                        </div>
                        <div className="flex-1 h-0.5 bg-neutral-800"></div>
                        <div className="flex flex-col items-center gap-1 flex-1">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            order.status === 'delivered'
                              ? 'bg-green-500/20 border-2 border-green-500'
                              : 'bg-neutral-800 border-2 border-neutral-700'
                          }`}>
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-xs text-neutral-400">Delivered</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}