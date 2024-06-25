import React from 'react';
import { Card, Form } from 'react-bootstrap';

export default function Step2({ roomInfo, setRoomInfo}) {
  const handleChange = (e) => {
    setRoomInfo({
      ...roomInfo,
      medicaidAccepted: e.target.id});
  }


  const options = ["No", "Yes", "Conditional on approved daily rate", "Contingent upon the family agreeing to subsidize the cost."];

  return (
    <>
      <Card className="claimProfileCard">

        <Card.Body>

          <Card.Title>Would you accept a medicaid resident for this room?</Card.Title>

          <Form>
              {options.map((option) => (
                  <Form.Check
                    key={option}
                    type='radio'
                    id={option}
                    label={option}
                    checked={roomInfo.medicaidAccepted?.includes(option) ?? false}
                    onChange={handleChange}
                    name='medicaidAccepted'
                    required
                  />
              ))}
            </Form>
        </Card.Body>

      </Card>

    </>

  );
};