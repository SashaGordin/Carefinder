import React, { useState } from 'react';
import { Button, Card, Form, Image} from 'react-bootstrap';
import { getStorage, ref, uploadBytes } from "firebase/storage";
import FileUpload from '../FileUpload';

export default function Step11({ listingInfo, setListingInfo }) {
  const options = ["Less than $10K", "$10-50K", "$50-100K", "$100-200K", "$200-300K", "$300-500K", "$500-700K", "$700K-1M", "$1-1.5M"]; 
  const handleChange = (e) => {
    setListingInfo({
      ...listingInfo, 
      minFunding: e.target.id});
  }

  return (
    <>
      <Card className="claimProfileCard">

        <Card.Body>

          <Card.Title>What is the minimum amount of funding you require from residents before transition to Medicaid?</Card.Title>
          <Form>
              {options.map((option) => (
                  <Form.Check 
                    key={option}
                    type='radio'
                    id={option}
                    label={option}
                    checked={listingInfo.minFunding?.includes(option) ?? false}
                    onChange={handleChange}
                    name='minFunding'
                    required
                  />
              ))}
            </Form>
        </Card.Body>

      </Card>

    </>

  );
};