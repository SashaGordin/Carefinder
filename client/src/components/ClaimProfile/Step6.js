import React, { useState } from "react";
import { Button, Card, Form } from "react-bootstrap";

export default function Step6({ onNext, onBack }) {
  const [agreed, setAgreed] = useState(false);

  const handleChange = () => {
    setAgreed(!agreed);
  };

  return (
    <>
      <Card className="claimProfileCard">
        <Card.Body>
          <Card.Title>Terms of Service</Card.Title>

          <Card.Text>
            <Form>
              <Form.Group controlId="formBasicCheckbox">
                <Form.Check
                  type="checkbox"
                  label="I agree to the terms and conditions"
                  checked={agreed}
                  onChange={handleChange}
                />
              </Form.Group>
            </Form>
          </Card.Text>

          <Button
            onClick={onNext}
            variant="primary"
            disabled={!agreed}
          >
            Confirm
          </Button>
          <Button onClick={onBack}>Back</Button>
        </Card.Body>
      </Card>
    </>
  );
}