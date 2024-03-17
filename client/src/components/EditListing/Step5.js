import React from 'react';
import { Button, Card } from 'react-bootstrap';

export default function Step5({  onNext, onBack, listingInfo, setListingInfo}) {
  return (

    <>
      <Card className="claimProfileCard">

        <Card.Body>

          <Card.Title>Discolsure of Service</Card.Title>

          <Card.Text>
            <p>[text coming from Micah?]</p>
          </Card.Text>

          <Button  variant="primary">Confirm</Button>
          <Button onClick={onBack}>Back</Button> 

        </Card.Body>
        
      </Card>
    </>
    
  );
};