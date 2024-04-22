import React, { useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import axios from 'axios';

export default function Step9() {

  return (

    <>
      <Card className="claimProfileCard">
      <Card.Body>
        <Card.Title>Congratulations!</Card.Title>
        <Card.Text>
            Your room listing has been updated and your profile is now live!
        </Card.Text>
      </Card.Body>
      </Card>
    </>

  );
}