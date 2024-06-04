import React from "react";
import {  Card } from "react-bootstrap";

export default function ReservationComplete() {

	return (
		<>
			<Card className="claimProfileCard">
				<Card.Body>
					<Card.Title>Reservation Request Sent</Card.Title>
          <Card.Text>
            Thank you for submitting a reservation request. If the AFH provider accepts, you will be notified!
          </Card.Text>
				</Card.Body>
			</Card>
		</>
	);
}
