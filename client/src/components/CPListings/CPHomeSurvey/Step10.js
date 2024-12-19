import React from 'react';
import { Card, Form } from 'react-bootstrap';

export default function Step10({ listingInfo, setListingInfo }) {
  const options = [
    'Seniors only',
    'Women only',
    'Men only',
    'Developmentally disabled only',
    'Other',
  ];
  const handleChange = () => {
    let options = [];
    document.querySelectorAll("[type='checkbox']:checked").forEach((t) => {
      options.push(t.id);
    });
    setListingInfo({
      ...listingInfo,
      demographics: options,
    });
  };

  return (
    <>
      <Card className="claimProfileCard">
        <Card.Body>
          <Card.Title>
            What are the current demographics of your home?
          </Card.Title>
          <Form>
            {options.map((option) => (
              <Form.Check
                key={option}
                type="checkbox"
                id={option}
                label={option}
                value
                checked={listingInfo.demographics?.includes(option) ?? false}
                onChange={handleChange}
              />
            ))}
          </Form>
        </Card.Body>
      </Card>
    </>
  );
}
