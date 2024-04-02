import React from 'react';

export default function Step7({ onNext, onBack, isPremium }) {
  return (
    <div>
      <h2>{isPremium ? 'Premium Membership' : 'Membership'}</h2>
      <p>{isPremium ? 'Cost: $10/day' : 'Cost: $6/day'}</p>
      <button onClick={onNext}>OK</button>
      <button onClick={onBack}>Back</button>
    </div>
  );
}