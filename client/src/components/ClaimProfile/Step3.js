import React from 'react';
import { Button } from 'react-bootstrap';

export default function Step3({ providerInfo, onNext, onBack }) {
  return (
    <div className="container">
      <h2>Verify Provider Information</h2>
      <div className="row">
        <div className="col-md-6">
          <p><strong>Provider Name:</strong> {providerInfo.FacilityPOC}</p>
          <p><strong>Phone Number:</strong> {providerInfo.TelephoneNmbr}</p>
          <p><strong>License Number:</strong> {providerInfo.LicenseNumber}</p>
        </div>
      </div>
      <Button onClick={onBack}>Back</Button>
      <Button onClick={onNext} variant="primary">Confirm</Button>
    </div>
  );
};
