import React from 'react';
import { Card } from 'react-bootstrap';


export default function Step7({ roomInfo, setRoomInfo }) {
  const handleChange = (e) => {
    setRoomInfo({
      ...roomInfo,
      roomNotes: e.target.value});
  }

  return (

    <>
      <Card className="claimProfileCard">

        <Card.Body>

          <Card.Title>Anything else you care to share about the room?</Card.Title>
            <textarea className="small" rows="5" cols="50" placeholder="Type here" value={roomInfo.roomNotes ?? ""} onChange={handleChange} />
        </Card.Body>
      </Card>
    </>

  );
}
