import React from 'react';
import { Button, Card } from 'react-bootstrap';

export default function Step6({ setHasMultipleAFH, onNext, onBack }) {

  const handleYes = () => {
    setHasMultipleAFH(true);
    onNext();
  };

  const handleNo = () => {
    setHasMultipleAFH(false);
    onNext();
  };

  return (

    <>
      <Card className="claimProfileCard">

        <Card.Body>

          <Card.Title>Do you have more than one AFH?</Card.Title>



          <Button onClick={handleNo}>No</Button>
          <Button onClick={handleYes} variant="primary">Yes</Button>

        </Card.Body>

      </Card>
    </>

  );
};