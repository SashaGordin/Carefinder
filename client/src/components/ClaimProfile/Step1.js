import React, { useState, useEffect } from 'react';
import { Button, Card } from 'react-bootstrap';
import axios from 'axios';

export default function Step1({ onNext, setProviderInfo }) {
  const [providerNumber, setProviderNumber] = useState('');
  const [error, setError] = useState(null);
  //const [providerInfo, setProviderInfo] = useState(null);

  const handleFetchProviderInfo = () => {
    // Fetch provider information using the entered provider number
    // Example fetch call
    const providerObject = {
      providerNumber: providerNumber,
    };
    axios
      .post(`${process.env.REACT_APP_ENDPOINT}/findProvider`, providerObject)
      .then((response) => {
        setProviderInfo(response.data.providerInfo[0]);
        console.log(
          'provider info:',
          response.data.providerInfo[0].TelephoneNmbr
        );

        // axios
        //   .post(`${process.env.REACT_APP_ENDPOINT}/sendConfirmationText`, {
        //     phone: response.data.providerInfo[0].TelephoneNmbr,
        //   })
        //   .then((response) => {
        //     console.log('Confirmation text sent successfully.');
        //   })
        //   .catch((error) => {
        //     console.error('Error sending confirmation text >>> :', error);
        //   });

        onNext();
      })
      .catch((error) => {
        console.error('Error:', error);
        setError('Error fetching provider information. Please try again.');
      });
  };

  return (
    <>
      <Card className="claimProfileCard">
        <Card.Body>
          <Card.Title>Search AFH</Card.Title>
          <Card.Text>
            Enter your AFH provider number to proceed
            <br />
            <input
              className="mt-2"
              type="text"
              placeholder="Enter AFH number"
              value={providerNumber}
              onChange={(e) => setProviderNumber(e.target.value)}
            />
            {error && <div className="text-danger">{error}</div>}
          </Card.Text>
          <Button onClick={handleFetchProviderInfo}>Next</Button>
        </Card.Body>
      </Card>
    </>
  );
}
