import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import axios from 'axios';

export default function Step1({ onNext }) {
  const [providerNumber, setProviderNumber] = useState('');
  //const [providerInfo, setProviderInfo] = useState(null);

  const handleFetchProviderInfo = () => {
    // Fetch provider information using the entered provider number
    // Example fetch call
    const providerObject = {
      providerNumber: providerNumber
    }
    axios.post('http://localhost:3001/findProvider', providerObject)
        .then(response => {
          console.log('provider info:', response.data.providerInfo);
          onNext();
        })
        .catch(error => {
          console.error('Error:', error);
        });
  };

  return (
    <div>
      <h2>Step 1: Enter Provider Number</h2>
      <input type="text" value={providerNumber} onChange={e => setProviderNumber(e.target.value)} />
      <Button onClick={handleFetchProviderInfo}>Next</Button>
    </div>
  );
}