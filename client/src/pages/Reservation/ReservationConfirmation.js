import React from "react";
import { Card } from "react-bootstrap";

export default function ReservationConfirmation() {
	return (
		<Card>
			<Card.Body>

        <Card.Title style={{textAlign: "center"}}>Reservation Confirmed</Card.Title>
				<Card.Text>
					<p>Congratulations, the reservation has been successfully confirmed!</p>
          <p>Move in day: </p>
				</Card.Text>
			</Card.Body>
		</Card>
	);
}
