import React from "react";
import { Button, Card } from "react-bootstrap";

export default function Step5({ onNext, onBack }) {
	return (
		<>
			<Card className="claimProfileCard">
				<Card.Body>
					<Card.Title>Review agreement</Card.Title>

					<Card.Text>
						<div style={{ fontWeight: "bold", marginBottom: "10px" }}>
							CAREFINDER SERVICES AGREEMENT
						</div>

						<div style={{ marginBottom: "10px" }}>
							I. Parties The parties to this agreement are Carefinder and the
							Service Provider ("Provider"), as identified in the signature
							blocks below. Each party represents that by signing this
							agreement, they have the authority to bind the individual or
							entity on behalf of whom they are executing this agreement. This
							agreement is not intended to create a partnership or joint venture
							between the parties. Carefinder's client(s) (the person or persons
							in need of placement) are not a party to this agreement.
						</div>

						<div style={{ marginBottom: "10px" }}>
							II. Assessment and Suitability Carefinder matches suitability
							based on comprehensive assessment criteria provided by the client.
							Carefinder assumes no responsibility for the suitability of the
							Provider to meet the care needs of the client.
						</div>

						<div style={{ marginBottom: "10px" }}>
							III. Referral Fee Agreement Carefinder charges a flat rate annual
							membership fee for access to its platform. The membership fee
							covers unlimited access to the platform for one or multiple homes,
							depending on the selected membership tier. There are no referral
							fees charged by Carefinder.
						</div>

						{/* Add additional div elements for the remaining sections */}
						<div style={{ marginBottom: "10px" }}>
							IV. Housing Standards and Regulatory Compliance The Provider
							agrees to maintain minimum standards set forth by regulatory
							agencies and ensure compliance with all applicable regulations.
							The Provider must notify Carefinder of any pending or existing
							violations by regulatory agencies.
						</div>
						<div style={{ marginBottom: "10px" }}>
							V. Indemnification Provider shall indemnify Carefinder from and
							against any liability arising out of this agreement for any acts
							related to client care by Provider.
						</div>
						<div style={{ marginBottom: "10px" }}>
							VI. Notice Notice shall be deemed sufficient if delivered in
							person, emailed, or texted.
						</div>
						<div style={{ marginBottom: "10px" }}>
							VII. Governing Law and Choice of Venue This agreement shall be
							governed by the laws of the State of Washington. Venue is limited
							to King County, Washington.
						</div>
						<div style={{ marginBottom: "10px" }}>
							VIII. Miscellaneous Provisions (1) Failure of any party to insist
							on strict performance of this agreement shall not impair any
							remedy herein provided; (2) This agreement represents the entire
							agreement between the parties and may only be modified by written
							consent of each party; (3) Each party acknowledges review of this
							agreement; (4) Any provision of this agreement is severable and
							does not invalidate the remainder of this agreement.
						</div>
					</Card.Text>

					<Button onClick={onNext} variant="primary">
						Confirm
					</Button>
					<Button onClick={onBack}>Back</Button>
				</Card.Body>
			</Card>
		</>
	);
}
