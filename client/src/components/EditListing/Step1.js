import React, { useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import axios from 'axios';

export default function Step1({}) {
  const [providerNumber, setProviderNumber] = useState('');
  //const [providerInfo, setProviderInfo] = useState(null);


  return (

    <>
      <Card className="claimProfileCard">
      <Card.Body>
        <Card.Title>Step 1</Card.Title>
        <h2>Tell us about your home.</h2>
        <Card.Text>
          In this step, will ask you which type of property you have, learn about the available room, and get a much greater understanding of home dynamics.
        </Card.Text>
      </Card.Body>
      </Card>
    </>

  );
}