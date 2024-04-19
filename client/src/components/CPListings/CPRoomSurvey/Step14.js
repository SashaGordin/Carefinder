import React, { useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import axios from 'axios';

export default function Step14({listingInfo}) {

  return (

    <>
      <Card className="claimProfileCard">
      <Card.Body>
        <Card.Title>Congratulations!</Card.Title>
        <Card.Text>
            Your profile for {listingInfo.facilityName} is complete!
        </Card.Text>
      </Card.Body>
      </Card>
    </>

  );
}