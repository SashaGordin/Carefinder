import React from 'react';
import { Button, Card } from 'react-bootstrap';

export default function Step5({ providerInfo, onFinish, onBack }) {
  return (

    <>
      <Card className="claimProfileCard">

        <Card.Body>

          <Card.Title>Discolsure of Service</Card.Title>

          <Card.Text>
            <p>[text coming from Micah?]</p>
          </Card.Text>

          <Button onClick={onFinish} variant="primary">Confirm</Button>
          <Button onClick={onBack}>Back</Button> 

        </Card.Body>
        
      </Card>
    </>
    
  );
};