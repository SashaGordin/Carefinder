import React, { useState } from 'react';
import { Button } from 'react-bootstrap';

export default function Step2({ onNext, onBack }) {
  const [numberOfRooms, setNumberOfRooms] = useState(0);

  return (
    <div>
      <h2>Step 2: Enter Number of Rooms</h2>
      <input type="number" value={numberOfRooms} onChange={e => setNumberOfRooms(e.target.value)} />
      <Button onClick={onBack}>Back</Button>
      <Button onClick={onNext}>Next</Button>
    </div>
  );
}