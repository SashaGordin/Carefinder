import React from 'react';
import { Button, Card } from 'react-bootstrap';

export default function Step5({ providerInfo, onNext, onBack }) {
  return (

    <>
      <Card className="claimProfileCard">

        <Card.Body>

          <Card.Title>Discolsure of Service</Card.Title>

          <Card.Text>
            <p>[text coming from Micah?]</p>
          </Card.Text>

          <Button onClick={onBack}>Back</Button>
          <Button onClick={onNext} variant="primary">Confirm</Button>

        </Card.Body>

      </Card>
    </>

  );
};