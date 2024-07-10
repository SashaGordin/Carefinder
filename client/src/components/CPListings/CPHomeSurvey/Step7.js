import React from 'react';
import { Card, Form } from 'react-bootstrap';

export default function Step7({ listingInfo, setListingInfo }) {
  const options = ["French", "Spanish", "German"]; //TODO add comprehesnive list of languages
  const handleChange = () => {
    let options = [];
    document.querySelectorAll("[type='checkbox']:checked").forEach((t) => {
        options.push(t.id);
    });
    setListingInfo({
      ...listingInfo,
      languages: options});
  }

  return (
    <>
      <Card className="claimProfileCard">

        <Card.Body>

          <Card.Title>Cultural & language</Card.Title>
          <Card.Text>Do you or the staff speak any languages other than English?</Card.Text>
          <Form>
              {options.map((option) => (
                  <Form.Check
                    key={option}
                    type='checkbox'
                    id={option}
                    label={option}
                    checked={listingInfo.languages?.includes(option) ?? false}
                    onChange={handleChange}
                  />
              ))}
            </Form>
        </Card.Body>

      </Card>

    </>

  );
};