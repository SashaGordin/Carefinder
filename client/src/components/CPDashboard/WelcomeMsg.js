import React from 'react';
import { Button, Card } from 'react-bootstrap';

export default function WelcomeMsg(props) {
  const defaultText = `We are incredibly grateful to have you with us. As a new service, our results may be limited during thie initial phase. We are currently testing our MVP (minimal viable product) and your feedback will help us build new features and updates soon. Thank you for your support and patience as we continue to improve.`;

  return (

    <>
     <div className="providerDashboardCard">

        <Card>
        <Card.Body>
          <Card.Title className="text-left"><h2>Hey {props.providerName},</h2></Card.Title>
          <Card.Text className="text-left mx-2">{defaultText}</Card.Text>
          <Button>Feedback</Button>
        </Card.Body>
        </Card>

      </div>
    </>

  );
}