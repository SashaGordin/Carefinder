import React from 'react';
import { Button } from 'react-bootstrap';

export default function Step5({ providerInfo, onFinish, onBack }) {
  return (
    <div className="container">
      <h2>Discolsure of Service </h2>

      <Button onClick={onBack}>Back</Button>
      <Button onClick={onFinish} variant="primary">Confirm</Button>
    </div>
  );
};