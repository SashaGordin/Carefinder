import React from 'react';
import { Button } from 'react-bootstrap';

export default function Step4({ providerInfo, onNext, onBack }) {
  return (
    <div className="container">
      <h2>Terms and Conditions</h2>

      <Button onClick={onBack}>Back</Button>
      <Button onClick={onNext} variant="primary">Confirm</Button>
    </div>
  );
};