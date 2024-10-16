import React, { useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import axios from 'axios';

export default function Step1({ onNext, setProviderInfo }) {
  const [providerNumber, setProviderNumber] = useState('');
  //const [providerInfo, setProviderInfo] = useState(null);

  const handleFetchProviderInfo = () => {
    // Fetch provider information using the entered provider number
    // Example fetch call
    const providerObject = {
      providerNumber: providerNumber
    }
    axios.post(`${process.env.REACT_APP_ENDPOINT}/findProvider`, providerObject)
        .then(response => {
          setProviderInfo(response.data.providerInfo[0])
          console.log('provider info:', response.data.providerInfo[0].TelephoneNmbr);

          axios.post(`${process.env.REACT_APP_ENDPOINT}/sendConfirmationText`, { phone: response.data.providerInfo[0].TelephoneNmbr })
            .then(response => {
              console.log('Confirmation text sent successfully.');
            })
            .catch(error => {
              console.error('Error sending confirmation text >>> :', error);
            });

          onNext();
        })
        .catch(error => {
          console.error('Error:', error);
        });
  };

  return (

    <>
      <Card className="claimProfileCard">
      <Card.Body>
        <Card.Title>Step 1: Enter Provider Number</Card.Title>
        <Card.Text>
        <input type="text" value={providerNumber} onChange={e => setProviderNumber(e.target.value)} />
        </Card.Text>
        <Button onClick={handleFetchProviderInfo}>Next</Button>
      </Card.Body>
      </Card>
    </>

  );
}