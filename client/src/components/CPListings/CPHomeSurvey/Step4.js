import React from 'react';
import { Card, Form } from 'react-bootstrap';

export default function Step4({ listingInfo, setListingInfo}) {
  const handleCredentialsChange = () => {
    let credentials = [];
    document.querySelectorAll("[type='checkbox']:checked").forEach((t) => {
        credentials.push(t.id);
    });
    setListingInfo({
      ...listingInfo,
      providerCredentials: credentials});
  }


  const options = ["MD", "DO", "PA-C", "ARNP", "RN, BSN", "RN", "LPN", "EMT", "Other"]

  return (
    <>
      <Card className="claimProfileCard">

        <Card.Body>

          <Card.Title>Does the home provider or manager hold any of following credentials?</Card.Title>

          <Card.Text>
           Select all that apply

          </Card.Text>
          <Form>
              {options.map((option) => (
                  <Form.Check
                    key={option}
                    type='checkbox'
                    id={option}
                    label={option}
                    checked={listingInfo.providerCredentials?.includes(option) ?? false}
                    onChange={handleCredentialsChange}
                  />
              ))}
          </Form>
        </Card.Body>

      </Card>

    </>

  );
};