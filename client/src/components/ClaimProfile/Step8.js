import React from "react";
import { Button, Card } from "react-bootstrap";

export default function Step8({ onNext, onBack }) {
  // const [agreed, setAgreed] = useState(false);

  // const handleChange = () => {
  //   setAgreed(!agreed);
  // };

  return (
    <>
      <Card className="claimProfileCard">
        <Card.Body>
          <Card.Title>We need a card on file</Card.Title>

          <Card.Text>
            You won't be charged until you have landed a resident who stays more than 30 days. In order to proceed we will need a valid card on file.
          </Card.Text>

          <Button
            onClick={onNext}
            variant="primary"
            // disabled={!agreed}
          >
            Ok
          </Button>
          <Button onClick={onBack}>Back</Button>
        </Card.Body>
      </Card>
    </>
  );
}