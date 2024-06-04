import React from "react";
import { Card } from "react-bootstrap";

export default function ReservationDenial() {
	return (
		<Card>
			<Card.Body>
				<Card.Title style={{ textAlign: "center" }}>
					Reservation Denied
				</Card.Title>
				<Card.Text>
					<p>
						You have successfully denied the reservation request.
					</p>
				</Card.Text>
			</Card.Body>
		</Card>
	);
}
