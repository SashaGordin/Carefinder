import React from 'react';
import { Button, Card } from 'react-bootstrap';

export default function Step4({ providerInfo, onNext, onBack }) {
  return (
    <>
      <Card className="claimProfileCard">

        <Card.Body>

          <Card.Title>Terms and Conditions</Card.Title>

          <Card.Text>
            <p>[Terms and conditions text coming from Micah.]</p>
          </Card.Text>

          <Button onClick={onBack}>Back</Button>
          <Button onClick={onNext} variant="primary">Confirm</Button>

        </Card.Body>

      </Card>

    </>

  );
};