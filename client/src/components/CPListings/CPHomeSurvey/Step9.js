import React from 'react';
import { Card, Form } from 'react-bootstrap';

export default function Step9({ listingInfo, setListingInfo }) {
  const options = [
    'Meaningful Day',
    'DDA',
    'Specialized Behavior Support',
    'Expanded Community Services',
    'Private Duty Nursing',
    'No Contract',
  ];
  const handleChange = () => {
    let options = [];
    document.querySelectorAll("[type='checkbox']:checked").forEach((t) => {
      options.push(t.id);
    });
    setListingInfo({
      ...listingInfo,
      contracts: options,
    });
  };

  return (
    <>
      <Card className="claimProfileCard">
        <Card.Body>
          <Card.Title>Select your current contracts</Card.Title>
          <Form>
            {options.map((option) => (
              <Form.Check
                key={option}
                type="checkbox"
                id={option}
                label={option}
                checked={listingInfo.contracts?.includes(option) ?? false}
                onChange={handleChange}
              />
            ))}
          </Form>
        </Card.Body>
      </Card>
    </>
  );
}
