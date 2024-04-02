import React from 'react';
import { Button, Card } from 'react-bootstrap';


export default function Step3({ providerInfo, onNext, onBack }) {
  return (

    <>
      <Card className="claimProfileCard">

        <Card.Body>

          <Card.Title>Verify Provider Information</Card.Title>

          <Card.Text>
            <p><strong>Provider Name:</strong> {providerInfo.FacilityPOC}</p>
            <p><strong>Phone Number:</strong> {providerInfo.TelephoneNmbr}</p>
            <p><strong>License Number:</strong> {providerInfo.LicenseNumber}</p>
          </Card.Text>

          <Button onClick={onBack}>Back</Button>
          <Button onClick={onNext} variant="primary">Confirm</Button>

        </Card.Body>

      </Card>
    </>

  );
};
