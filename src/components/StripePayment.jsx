import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard } from 'lucide-react';

export default function StripePayment({ amount, onSuccess, onError }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const cardElement = elements.getElement(CardElement);

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        onError(error.message);
        setIsProcessing(false);
      } else {
        // Simulate payment success
        setTimeout(() => {
          onSuccess({
            id: paymentMethod.id,
            amount: amount,
            status: 'paid'
          });
          setIsProcessing(false);
        }, 2000);
      }
    } catch (err) {
      onError('Payment failed. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#fff',
                '::placeholder': {
                  color: '#94a3b8',
                },
                iconColor: '#22d3ee',
              },
              invalid: {
                color: '#ef4444',
                iconColor: '#ef4444',
              },
            },
          }}
        />
      </div>

      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white h-12 font-semibold"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing Payment...
          </>
        ) : (
          <>
            <CreditCard className="w-4 h-4 mr-2" />
            Pay ₹{amount.toFixed(2)}
          </>
        )}
      </Button>
    </form>
  );
}