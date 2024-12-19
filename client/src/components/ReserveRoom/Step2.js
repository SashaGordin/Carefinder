import React, { useState } from 'react';
import { Button, Card, Image, Form } from 'react-bootstrap';

export default function Step2({ onBack, onNext, provider }) {
  const rooms = provider.listingsData[0].roomData;
  const [selectedRoom, setSelectedRoom] = useState(null);

  const handleRoomSelection = (room) => {
    setSelectedRoom(room);
    console.log(room);
  };

  const handleNext = () => {
    if (selectedRoom) {
      onNext(selectedRoom);
    } else {
      alert('Please select a room');
    }
  };

  return (
    <>
      <Card className="claimProfileCard">
        <Card.Body>
          <Card.Title>Select a room</Card.Title>
          <Card.Text>
            Please select the room that you are interested in.
          </Card.Text>
          {rooms.map((room, index) => (
            <Form.Check
              key={index}
              type="checkbox"
              id={`room-${index}`}
              label={
                <>
                  <Image src={room.roomPhotos[0]} thumbnail />
                </>
              }
              checked={selectedRoom === room}
              onChange={() => handleRoomSelection(room)}
            />
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button onClick={onBack}>Back</Button>
            <Button onClick={handleNext}>Next</Button>
          </div>
        </Card.Body>
      </Card>
    </>
  );
}
