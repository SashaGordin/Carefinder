import React from 'react';
import { Card, Form } from 'react-bootstrap';

export default function Step8({ listingInfo, setListingInfo }) {
  const options = ['Dementia', 'Developmentally disabled', 'Mental health'];
  const handleChange = () => {
    let options = [];
    document.querySelectorAll("[type='checkbox']:checked").forEach((t) => {
      options.push(t.id);
    });
    setListingInfo({
      ...listingInfo,
      speciality: options,
    });
  };

  return (
    <>
      <Card className="claimProfileCard">
        <Card.Body>
          <Card.Title>Select what you are licensed for?</Card.Title>
          <Form>
            {options.map((option) => (
              <Form.Check
                key={option}
                type="checkbox"
                id={option}
                label={option}
                checked={listingInfo.speciality?.includes(option) ?? false}
                onChange={handleChange}
              />
            ))}
          </Form>
        </Card.Body>
      </Card>
    </>
  );
}
