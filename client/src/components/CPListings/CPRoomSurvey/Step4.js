import React from 'react';
import { Card, Form } from 'react-bootstrap';

export default function Step4({ roomInfo, setRoomInfo}) {
  const handleChange = () => {
    let roomDetails = [];
    document.querySelectorAll("[type='checkbox']:checked").forEach((t) => {
      roomDetails.push(t.id);
    });
    setRoomInfo({
      ...roomInfo,
      roomDetails: roomDetails});
  }


  const options = ["Private room", "Shared room", "Private bathroom", "Half bathroom", "Shared bathroom", "No bathroom (Comode in room)", "Community shower", "Standard door", "Large door"]

  return (
    <>
      <Card className="claimProfileCard">

        <Card.Body>

          <Card.Title>Which of these apply to this room?</Card.Title>
          <Form>
              {options.map((option) => (
                  <Form.Check
                    key={option}
                    type='checkbox'
                    id={option}
                    label={option}
                    checked={roomInfo.roomDetails?.includes(option) ?? false}
                    onChange={handleChange}
                  />
              ))}
          </Form>
        </Card.Body>

      </Card>

    </>

  );
};