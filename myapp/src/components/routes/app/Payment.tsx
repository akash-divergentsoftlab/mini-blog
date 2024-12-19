import { loadStripe } from '@stripe/stripe-js';
import { useUserId } from '@nhost/react';



export default function Payment() {
  const stripePromise = loadStripe('pk_test_51QXcuqP1aeDbPFiRyINuZ54t6O1VJWwmyG0XhmKYvrfjs4VcSMl6XjyIVV84S6wMqFECtIOSJt6e7TBSlhh4PRQt00sM9w5rBQ');
  const priceId = "price_1QXdD5P1aeDbPFiRUgKMhPfQ";

  const user = useUserId();


  const handleCheckout = async () => {
    
    try {
      const response = await fetch('http://localhost:8000/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }),
      });

      const data = await response.json();

      const stripe = await stripePromise;

      if (!stripe) {
        console.error('Stripe failed to load.');
        return;
      }

      await stripe.redirectToCheckout({ sessionId: data.sessionId });
    } catch (error) {
      console.error('Error during checkout:', error);
    }
  };

  return (
    <div className="flex flex-col w-full gap-4">
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <button
          onClick={handleCheckout}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
        >
          Make Payment
        </button>
      </div>
    </div>
  );
}
