import React from "react";
import { Button, Card } from "react-bootstrap";

export default function Step4({ onNext, onBack, calendlyLink }) {
	return (
		<>
			<Card>
				<Card.Body>
					<Card.Title style={{textAlign: "center"}}>Select move in day</Card.Title>

					<div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
            <iframe
              title="Calendly"
              src={calendlyLink}
              width="100%"
              height="500"
              frameBorder="0"
              style={{ borderRadius: "8px" }}
            ></iframe>
          </div>

					<div style={{display: "flex", justifyContent: "space-between"}}>
					  <Button onClick={onBack}>Back</Button>
  					<Button onClick={onNext}>Next</Button>
					</div>

					{/* Button to go back to previous step */}
				</Card.Body>
			</Card>
		</>
	);
}
