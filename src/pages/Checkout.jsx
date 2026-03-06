import React, { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { utc } from '@/api/utcClient';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, Smartphone, Building, Wallet, CheckCircle, Lock, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_51QevxO04hGdK5EvCG2G0LnQAUv5UUPPdvwXo4FAQZ8BtRXLHaFSh1K9pEd9UPKdz0qCWX9dqWPbHaWI9WVzOO4wz00dPEVhL7A');

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    street: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'India',
    payment_method: 'cod',
    notes: '',
    upi_transaction_id: '',
    payment_screenshot: null
  });

  useEffect(() => {
    const cartData = localStorage.getItem('cart');
    if (cartData) {
      setCart(JSON.parse(cartData));
    } else {
      navigate(createPageUrl('Cart'));
    }
  }, [navigate]);

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = subtotal > 999 ? 0 : 50;
  const total = subtotal + shippingCost;

  const createOrderMutation = useMutation({
    mutationFn: (orderData) => utc.entities.Order.create(orderData),
    onSuccess: async (data) => {
      const orderNum = data.order_number || `ORD-${Date.now()}`;
      setOrderNumber(orderNum);
      
      // Send confirmation email
      try {
        const itemsList = cart.map(item => 
          `• ${item.name} (Qty: ${item.quantity}) - ₹${(item.price * item.quantity).toFixed(2)}`
        ).join('\n');
        
        await utc.integrations.Core.SendEmail({
          to: formData.customer_email,
          subject: `Order Confirmation - ${orderNum}`,
          body: `
Dear ${formData.customer_name},

Thank you for your order! We've received your order and will process it shortly.

Order Number: ${orderNum}
Order Date: ${new Date().toLocaleDateString()}

Order Details:
${itemsList}

Subtotal: ₹${subtotal.toFixed(2)}
Shipping: ${shippingCost === 0 ? 'FREE' : `₹${shippingCost.toFixed(2)}`}
Total: ₹${total.toFixed(2)}

Shipping Address:
${formData.street}
${formData.city}, ${formData.state} ${formData.postal_code}
${formData.country}

Payment Method: ${formData.payment_method.toUpperCase()}
Payment Status: ${formData.payment_method === 'cod' ? 'Pending (Cash on Delivery)' : 'Paid'}

We'll send you another email when your order ships.

Thank you for shopping with us!

Best regards,
UTC Team
          `
        });
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError);
      }
      
      setOrderComplete(true);
      localStorage.removeItem('cart');
      setIsProcessing(false);
    },
    onError: () => {
      alert('Order creation failed. Please try again.');
      setIsProcessing(false);
    }
  });

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const { file_url } = await utc.integrations.Core.UploadFile({ file });
        setFormData({ ...formData, payment_screenshot: file_url });
      } catch (error) {
        alert('Failed to upload screenshot. Please try again.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // For UPI, require transaction ID or screenshot
    if (formData.payment_method === 'upi' && !formData.upi_transaction_id && !formData.payment_screenshot) {
      alert('Please provide UPI Transaction ID or upload payment screenshot');
      setIsProcessing(false);
      return;
    }

    // Create order directly for all payment methods except card
    const orderData = {
      order_number: `ORD-${Date.now()}`,
      customer_name: formData.customer_name,
      customer_email: formData.customer_email,
      customer_phone: formData.customer_phone,
      shipping_address: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        postal_code: formData.postal_code,
        country: formData.country
      },
      items: cart.map(item => ({
        product_id: item.id,
        product_name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image
      })),
      subtotal: subtotal,
      shipping_cost: shippingCost,
      total: total,
      status: 'pending',
      payment_method: formData.payment_method,
      payment_status: formData.payment_method === 'cod' ? 'pending' : 'paid',
      notes: formData.notes + (formData.upi_transaction_id ? `\nUPI Transaction ID: ${formData.upi_transaction_id}` : '') + (formData.payment_screenshot ? `\nPayment Screenshot: ${formData.payment_screenshot}` : '')
    };

    setTimeout(() => {
      createOrderMutation.mutate(orderData);
    }, 1500);
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-neutral-950 pt-20 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <Card className="bg-neutral-900 border-neutral-800 text-center">
            <CardContent className="p-8">
              <CheckCircle className="w-20 h-20 text-cyan-400 mx-auto mb-6" />
              <h2 className="text-2xl font-medium text-white mb-2">Order Placed Successfully!</h2>
              <p className="text-neutral-400 mb-6">
                Your order number is <span className="text-cyan-400 font-medium">{orderNumber}</span>
              </p>
              <p className="text-neutral-400 text-sm mb-8">
                We've sent a confirmation email to {formData.customer_email}
              </p>
              <div className="flex gap-3">
                <Button 
                  onClick={() => navigate(createPageUrl('Home'))}
                  variant="outline"
                  className="flex-1 border-neutral-700 text-white"
                >
                  Continue Shopping
                </Button>
                <Button 
                  onClick={() => navigate(createPageUrl('Home'))}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white"
                >
                  Go Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 pt-20">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            onClick={() => navigate(createPageUrl('Cart'))}
            className="border-neutral-700 text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-3xl font-light text-white">Checkout</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Information */}
              <Card className="bg-neutral-900 border-neutral-800">
                <CardHeader>
                  <CardTitle className="text-white">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.customer_name}
                      onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                      className="bg-neutral-800 border-neutral-700 text-white"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-white">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.customer_email}
                        onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                        className="bg-neutral-800 border-neutral-700 text-white"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-white">Phone *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.customer_phone}
                        onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                        className="bg-neutral-800 border-neutral-700 text-white"
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card className="bg-neutral-900 border-neutral-800">
                <CardHeader>
                  <CardTitle className="text-white">Shipping Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="street" className="text-white">Street Address *</Label>
                    <Input
                      id="street"
                      value={formData.street}
                      onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                      className="bg-neutral-800 border-neutral-700 text-white"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-white">City *</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="bg-neutral-800 border-neutral-700 text-white"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state" className="text-white">State *</Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="bg-neutral-800 border-neutral-700 text-white"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="postal" className="text-white">Postal Code *</Label>
                      <Input
                        id="postal"
                        value={formData.postal_code}
                        onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                        className="bg-neutral-800 border-neutral-700 text-white"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country" className="text-white">Country *</Label>
                      <Input
                        id="country"
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        className="bg-neutral-800 border-neutral-700 text-white"
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card className="bg-neutral-900 border-neutral-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup 
                    value={formData.payment_method} 
                    onValueChange={(value) => setFormData({ ...formData, payment_method: value })}
                  >
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 p-4 border border-neutral-800 rounded-lg cursor-pointer hover:border-amber-500 transition-colors">
                        <RadioGroupItem value="cod" id="cod" />
                        <Wallet className="w-5 h-5 text-amber-400" />
                        <div className="flex-1">
                          <p className="font-medium text-white">Cash on Delivery</p>
                          <p className="text-sm text-neutral-400">Pay when you receive (Recommended)</p>
                        </div>
                      </label>

                      <label className="flex items-center gap-3 p-4 border border-neutral-800 rounded-lg cursor-pointer hover:border-cyan-500 transition-colors">
                        <RadioGroupItem value="upi" id="upi" />
                        <Smartphone className="w-5 h-5 text-cyan-400" />
                        <div className="flex-1">
                          <p className="font-medium text-white">UPI Payment</p>
                          <p className="text-sm text-neutral-400">Pay via UPI apps</p>
                        </div>
                      </label>

                      {formData.payment_method === 'upi' && (
                        <div className="p-4 bg-neutral-800/50 rounded-lg space-y-4">
                          <div className="bg-white rounded-lg p-6 text-center">
                            <p className="text-slate-800 font-semibold text-lg mb-4">Scan QR Code to Pay</p>
                            <img 
                              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/utc-prod/public/695f409ea784b9d3881e695f/cb6bc7dcb_WhatsAppImage2026-02-10at182113.jpg"
                              alt="UPI QR Code"
                              className="w-64 h-64 mx-auto mb-4 object-contain"
                            />
                            <p className="text-slate-600 text-sm font-medium mb-1">UPI ID: nirajsavlani157@oksbi</p>
                            <p className="text-slate-500 text-xs">Scan to pay with any UPI app</p>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="space-y-2">
                              <Label className="text-white text-sm">Transaction ID (Optional)</Label>
                              <Input
                                placeholder="Enter UPI Transaction ID"
                                value={formData.upi_transaction_id}
                                onChange={(e) => setFormData({ ...formData, upi_transaction_id: e.target.value })}
                                className="bg-neutral-800 border-neutral-700 text-white"
                              />
                            </div>
                            
                            <div className="text-center text-neutral-400 text-sm">OR</div>
                            
                            <div className="space-y-2">
                              <Label className="text-white text-sm">Upload Payment Screenshot</Label>
                              {formData.payment_screenshot ? (
                                <div className="relative">
                                  <img 
                                    src={formData.payment_screenshot} 
                                    alt="Payment proof" 
                                    className="w-full h-32 object-cover rounded-lg"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, payment_screenshot: null })}
                                    className="absolute top-2 right-2 p-1 bg-red-500 rounded-full"
                                  >
                                    <X className="w-4 h-4 text-white" />
                                  </button>
                                </div>
                              ) : (
                                <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-neutral-700 rounded-lg cursor-pointer hover:border-cyan-500 transition-colors">
                                  <Upload className="w-8 h-8 text-neutral-400 mb-2" />
                                  <span className="text-sm text-neutral-400">Click to upload screenshot</span>
                                  <input 
                                    type="file" 
                                    accept="image/*" 
                                    className="hidden" 
                                    onChange={handleFileUpload}
                                  />
                                </label>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      <label className="flex items-center gap-3 p-4 border border-neutral-800 rounded-lg cursor-pointer hover:border-cyan-500 transition-colors">
                        <RadioGroupItem value="net_banking" id="net_banking" />
                        <Building className="w-5 h-5 text-cyan-400" />
                        <div className="flex-1">
                          <p className="font-medium text-white">Net Banking</p>
                          <p className="text-sm text-neutral-400">Direct bank transfer</p>
                        </div>
                      </label>
                    </div>
                  </RadioGroup>

                  <div className="mt-4 space-y-2">
                    <Label htmlFor="notes" className="text-white">Order Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="bg-neutral-800 border-neutral-700 text-white"
                      placeholder="Any special instructions..."
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="bg-neutral-900 border-neutral-800 sticky top-24">
                <CardHeader>
                  <CardTitle className="text-white">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <div className="w-16 h-16 bg-neutral-800 rounded flex-shrink-0">
                          {item.image && (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white truncate">{item.name}</p>
                          <p className="text-xs text-neutral-400">Qty: {item.quantity}</p>
                          <p className="text-sm text-amber-400 font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-neutral-800 pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-400">Subtotal</span>
                      <span className="text-white">₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-400">Shipping</span>
                      <span className="text-white">
                        {shippingCost === 0 ? 'FREE' : `₹${shippingCost.toFixed(2)}`}
                      </span>
                    </div>
                    {subtotal < 999 && (
                      <p className="text-xs text-neutral-500">Free shipping on orders above ₹999</p>
                    )}
                    <div className="flex justify-between font-medium text-lg pt-2 border-t border-neutral-800">
                      <span className="text-white">Total</span>
                      <span className="text-amber-400">₹{total.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white h-12 font-semibold shadow-lg"
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Processing Order...' : 'Place Order'}
                  </Button>

                  <p className="text-xs text-center text-neutral-500">
                    <Lock className="w-3 h-3 inline mr-1" />
                    Your payment information is secure
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Checkout() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}