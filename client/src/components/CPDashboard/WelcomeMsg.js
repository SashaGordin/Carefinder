import React from 'react';
import { Button, Card } from 'react-bootstrap';

export default function WelcomeMsg(props) {
  const defaultText = `Thank you for supporting us!  Were just getting started, your input will help ensure were serving our seniors
  and YOU to the best of our abilities.  Give us some feedback to be entered into our monthly sweepstakes giveaway!`;

  return (
    <>
      <div className="providerDashboardCard">
        <Card>
          <Card.Body>
            <Card.Title className="text-left">
              <h2>Hey {props.providerName},</h2>
            </Card.Title>
            <Card.Text className="text-left mx-2">{defaultText}</Card.Text>
            <Button>Feedback</Button>
          </Card.Body>
        </Card>
      </div>
    </>
  );
}
