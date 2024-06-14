import React from "react";
import { Card } from "react-bootstrap";
import TopNav from "../../components/TopNav";


export default function ReservationDenial() {
	return (
		<>
			<TopNav/>
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
		</>
	);
}
