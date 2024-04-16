import React, { useState } from 'react';
import { Button, Card, Form, Image} from 'react-bootstrap';
import { getStorage, ref, uploadBytes } from "firebase/storage";
import FileUpload from '../FileUpload';

export default function Step13({ listingInfo, setListingInfo }) {
  const options = ["Humana Medicare", "UnitedHealthcare", "Kaiser Permanente", "Aetna Medicare", "Cigna Medicare", "Premera Blue Cross", "Health Alliance", "Providence medicare", "Community Health"]; 
  const handleChange = () => {
    let options = [];
    document.querySelectorAll("[type='checkbox']:checked").forEach((t) => {
        options.push(t.id);
    });
    setListingInfo({
      ...listingInfo, 
      insuranceContracts: options});
  }

  return (
    <>
      <Card className="claimProfileCard">

        <Card.Body>

          <Card.Title>What insurance does your home doctor contract with?</Card.Title>
          <Form>
              {options.map((option) => (
                  <Form.Check 
                    key={option}
                    type='checkbox'
                    id={option}
                    label={option}
                    value
                    checked={listingInfo.insuranceContracts?.includes(option) ?? false}
                    onChange={handleChange}
                  />
              ))}
            </Form>
        </Card.Body>

      </Card>

    </>

  );
};