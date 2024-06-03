import React, { useState } from 'react';
import { Button, Form, Card, Placeholder } from 'react-bootstrap';
import axios from 'axios';


export default function Step6({ roomInfo, setRoomInfo }) {
  const handleChange = (e) => {
    setRoomInfo({
      ...roomInfo, 
      dimensions: e.target.value});
  }

  return (

    <>
      <Card className="claimProfileCard">

        <Card.Body>

          <Card.Title>Provide a rough estimate of room dimensions</Card.Title>
         
            <input required type="text" placeholder="e.g. 120 Sq ft" value={roomInfo.dimensions ?? ""} onChange={handleChange} />
            <Card.Text>Calculate the length times the width of the room and add it together for total</Card.Text>
        </Card.Body>
      </Card>
    </>

  );
}
