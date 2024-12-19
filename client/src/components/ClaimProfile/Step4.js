import React from 'react';
import { Button, Card } from 'react-bootstrap';

export default function Step4({ onNext, onBack }) {
  return (
    <>
      <Card className="claimProfileCard">
        <Card.Body>
          <Card.Title>Review disclosure</Card.Title>

          <Card.Text>
            <p>Membership Model</p>
            <div style={{ marginBottom: '10px' }}>
              <span style={{ fontWeight: 'bold' }}>
                Zero Risk, No Upfront Cost:{' '}
              </span>
              List your Adult Family Home (AFH) with us and make it visible to
              all seniors seeking care at absolutely no cost. Your membership
              subscription will be activated once you\'ve welcomed your first
              private pay resident.
            </div>
            <div style={{ marginBottom: '10px' }}>
              <span style={{ fontWeight: 'bold' }}>
                $6/Day Membership (Single Home):
              </span>
              Gain unlimited access to our platform for one home with up to 8
              rooms. Whether you need to fill one room or the entire house, our
              annual membership fee covers it all. Billed annually at $2,100,
              this flat rate ensures no hidden costs or referral fees.
            </div>
            <div style={{ marginBottom: '10px' }}>
              <span style={{ fontWeight: 'bold' }}>
                $10/Day Membership (Multiple Homes):
              </span>
              Fill rooms across multiple homes with the same benefits as our
              regular membership, plus access to multiple homes for a low flat
              rate. Billed annually at $3,600, this option offers flexibility
              and convenience for care providers.
            </div>
            <div>
              We charge ZERO PERCENT referral fee, focusing solely on providing
              a transparent and cost-effective membership model tailored to
              meeting your needs.
            </div>
          </Card.Text>

          <Button onClick={onNext} variant="primary">
            Confirm
          </Button>
          <Button onClick={onBack}>Back</Button>
        </Card.Body>
      </Card>
    </>
  );
}
