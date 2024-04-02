import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';


export default function Step8({ onNext, onBack, isPremium }) {
  const handleOk = async () => {
    const stripe = await loadStripe('pk_test_51OvifLIXjP7K0OxqJ8zHZILXRgvFMw10MfHUJO6om0DSxvXSHnAPNdwizq8NEd7h7ku5dLTkM93XTT09tDPkSpCu00wktZecut');
    // Perform any necessary actions before navigating to the next step
    const response = await axios.post('http://localhost:3001/create-checkout-session', {
      priceId: 'price_1OwXeJIXjP7K0OxqytIC2Ndl'
    })

    const session = await response.data;
    console.log(session, session.id);

    const result = stripe.redirectToCheckout({
      sessionId: session.id
    });

    if (result.error) {
      console.log(result.error);
    }
    onNext();
  };

  return (
    <div>
      <h2>We need a card on file</h2>
      <h3>You wont be charged until you have landed a resident who stays more than 30 days. In order to proceed we need a valid card on file.</h3>
      <button onClick={handleOk}>OK</button>
      <button onClick={onBack}>Back</button>
    </div>
  );
}