import React, { useState } from 'react';
import { Button, Card, Form } from 'react-bootstrap';

export default function Step5({ listingInfo, setListingInfo}) {
  const handleChange = () => {
    let pets = [];
    document.querySelectorAll("[type='checkbox']:checked").forEach((t) => {
        pets.push(t.id);
    });
    setListingInfo({
      ...listingInfo, 
      pets: pets});
  }

  
  const options = ["Cat", "Dog", "Other"];
  
  return (
    <>
      <Card className="claimProfileCard">

        <Card.Body>

          <Card.Title>Do you have pets in the home?</Card.Title>
            <Form>
              {options.map((option) => (
                  <Form.Check 
                    key={option}
                    type='checkbox'
                    id={option}
                    label={option}
                    checked={listingInfo.pets?.includes(option) ?? false}
                    onChange={handleChange}
                  />
              ))}
          </Form>
        </Card.Body>
        
      </Card>

    </>

  );
};