import React from 'react';
import { Card } from 'react-bootstrap';

export default function Step1() {
  return (
    <>
      <Card className="claimProfileCard">
        <Card.Body>
          <Card.Title>Step 1</Card.Title>
          <h2>Tell us about your room.</h2>
          <Card.Text>
            Get specific about the room you have available, upload photos and
            give us some details before making your listing visible.
          </Card.Text>
        </Card.Body>
      </Card>
    </>
  );
}
