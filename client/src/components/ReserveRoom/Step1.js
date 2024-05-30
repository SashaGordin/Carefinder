import React from "react";
import { Button, Card } from "react-bootstrap";

export default function Step1({ onNext, setProviderInfo }) {

	return (
		<>
			<Card className="claimProfileCard">
				<Card.Body>
					<div style={{ display: "flex", justifyContent: "space-between" }}>
						<div>iamge</div>
						<div>
							<Card.Title>Reserve room</Card.Title>
							<Card.Text style={{ fontSize: "12px"}}>
								<div style={{ textAlign: "left"}}>
									<div style={{ font: "bold" }}>Step 1: Reserving a Room</div>
									<p>
									  Reserving a room is the first step towards booking care. Take
  									some time to review the provider contract, house rules, select
  									a move-in date, and then make a non-refundable deposit to hold
  									the room. (applied towards first months rent)
									</p>
								</div>
								<div style={{ textAlign: "left"}}>
									<div style={{ font: "bold" }}>
										Step 2: Finalizing the Process
									</div>
									<p>
									  On move-in day, we will send you a link to "Book Care," which
  									streamlines all required paperwork and the overall process for
  									admitting your senior into the home.
									</p>
								</div>
							</Card.Text>
							<Button onClick={onNext}>Next</Button>
						</div>
					</div>
				</Card.Body>
			</Card>
		</>
	);
}
