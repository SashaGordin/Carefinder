import React, { useState } from 'react';
import { Button, Card } from 'react-bootstrap';

export default function WelcomeMsg(props) {
  const [providerNumber, setProviderNumber] = useState('');
  const defaultText = `Thank you for supporting us!  Were just getting started, your  input will help ensure were serving our seniors 
  and YOU to the best of our abilities.  Give us some feedback to be entered into our monthly sweepstakes giveaway!`;
  
  return (

    <>
      <Card className="providerDashboardCard">
      <Card.Body>
        <Card.Title className="text-left"><h2>Hey {props.providerName},</h2></Card.Title>
        <Card.Text className="text-left mx-2">{defaultText}</Card.Text>
        <Button>Feedback</Button>        
      </Card.Body>
      </Card>
    </>

  );
}