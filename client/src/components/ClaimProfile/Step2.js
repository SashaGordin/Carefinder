import React, { useState } from 'react';
import { Button, Form, Card } from 'react-bootstrap';
import axios from 'axios';


export default function Step2({ onNext, onBack, providerInfo }) {
  const [confirmationCode, setConfirmationCode] = useState('');
  const [verificationError, setVerificationError] = useState('');




  const verifyConfirmationCode = () => {
    // Make a request to the server to verify the confirmation code
    axios.post('http://localhost:3001/verifyConfirmationCode', { phoneNumber: providerInfo.TelephoneNmbr, code: confirmationCode })
      .then(response => {
        // If code is verified successfully, proceed to next step
        onNext();
      })
      .catch(error => {
        setVerificationError('Invalid confirmation code. Please try again.');
      });
  };

  return (

    <>
      <Card className="claimProfileCard">

        <Card.Body>

          <Card.Title>Step 2: Confirm Phone Number</Card.Title>

          <Card.Text>Please confirm your phone number by entering the confirmation code received via SMS.</Card.Text>
          <Form>
            <Form.Group controlId="confirmationCode">
              <Form.Control type="text" placeholder="Enter confirmation code" value={confirmationCode} onChange={(e) => setConfirmationCode(e.target.value)} />
              <Form.Text className="text-danger">{verificationError}</Form.Text>
            </Form.Group>
            <Button onClick={onBack}>Back</Button>
            <Button onClick={verifyConfirmationCode}>Verify Code</Button>
          </Form>

          {/* Button to go back to previous step */}
        </Card.Body>
      </Card>
    </>

  );
}
