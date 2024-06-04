import React from "react";
import { Button, Card } from "react-bootstrap";

export default function Step1({ onNext, provider }) {
	return (
		<>
			<Card className="claimProfileCard">
				<Card.Body>
					<div style={{ display: "flex", flexDirection: "row" }}>
						<div style={{ flex: 1, maxHeight: "200px" }}>
							<img
								style={{ width: "100%", height: "100%", objectFit: "cover" }}
								src={provider.homePhotos[0]}
								alt="Profile pic"
							/>
						</div>
						<div style={{ flex: 1, marginLeft: "20px" }}>
							<Card.Title>Reserve room</Card.Title>
							<Card.Text style={{ fontSize: "12px" }}>
								<div style={{ textAlign: "left" }}>
									<div style={{ fontWeight: "bold" }}>
										Step 1: Reserving a Room
									</div>
									<p>
										Reserving a room is the first step towards booking care.
										Take some time to review the provider contract, house rules,
										select a move-in date, and then make a non-refundable
										deposit to hold the room. (applied towards first month's
										rent)
									</p>
								</div>
								<div style={{ textAlign: "left" }}>
									<div style={{ fontWeight: "bold" }}>
										Step 2: Finalizing the Process
									</div>
									<p>
										On move-in day, we will send you a link to "Book Care,"
										which streamlines all required paperwork and the overall
										process for admitting your senior into the home.
									</p>
								</div>
							</Card.Text>
						</div>
					</div>
					<div style={{ marginTop: "20px", textAlign: "center" }}>
						<Button onClick={onNext}>Next</Button>
					</div>
				</Card.Body>
			</Card>
		</>
	);
}
