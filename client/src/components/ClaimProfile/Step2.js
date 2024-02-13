import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
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
    <div>
      <h2>Step 2: Confirm Phone Number</h2>
      <p>Please confirm your phone number by entering the confirmation code received via SMS.</p>

      {/* Button to send confirmation text */}

      {/* Form to enter confirmation code */}
      <Form>
        <Form.Group controlId="confirmationCode">
          <Form.Label>Confirmation Code</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter confirmation code"
            value={confirmationCode}
            onChange={(e) => setConfirmationCode(e.target.value)}
          />
          <Form.Text className="text-danger">{verificationError}</Form.Text>
        </Form.Group>
        <Button onClick={verifyConfirmationCode}>Verify Code</Button>
      </Form>

      {/* Button to go back to previous step */}
      <Button onClick={onBack}>Back</Button>
    </div>
  );
}
