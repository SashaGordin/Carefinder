import React from "react";
import { Button, Card } from "react-bootstrap";

export default function Step3({ onNext, onBack, houseName }) {
	return (
		<>
			<Card>
				<Card.Body>
					<Card.Title style={{textAlign: "center"}}>Review {houseName} Contract</Card.Title>

					<Card.Text>
						Adult Family Home Resident Agreement] This Agreement ("Agreement")
						is entered into on [Date] between [Name of Adult Family Home],
						located at [Address of Adult Family Home] ("Provider"), and [Name of
						Resident], located at [Address of Resident] ("Resident"). Services
						Provided: Provider agrees to provide the following services to
						Resident: Room and board Assistance with activities of daily living
						(ADLs) as needed, including bathing, dressing, grooming, toileting,
						eating, and mobility Medication management and administration
						Monitoring of health status and assistance with medical appointments
						Social and recreational activities Term: This Agreement shall be
						effective as of [Date] and shall continue on a month-to-month basis
						until terminated by either party with [Number] days\' written
						notice. Fees and Payment: Resident agrees to pay Provider the
						following fees for the services provided: Monthly fee of [Amount]
						for room and board Additional fees for specialized services or
						amenities, if applicable Payment is due on the first day of each
						month. Rights and Responsibilities: Provider\'s Responsibilities:
						Provide care and assistance in a safe and respectful manner Maintain
						the cleanliness and safety of the premises Respect Resident\'s
						privacy and dignity Provide meals and snacks that meet Resident\'s
						dietary needs and preferences Ensure that staff are properly trained
						and qualified to provide care Resident\'s Responsibilities:
						Cooperate with Provider and staff in developing and implementing a
						care plan Pay fees and charges in a timely manner Respect the rights
						and privacy of other residents Provide accurate and complete
						information about health status and medical history Abide by the
						rules and policies of the Adult Family Home Termination: Either
						party may terminate this Agreement with [Number] days\' written
						notice. Provider may terminate this Agreement immediately if
						Resident\'s behavior poses a threat to the health or safety of
						themselves or others, or if Resident fails to pay fees as required.
						Miscellaneous: This Agreement constitutes the entire agreement
						between the parties and supersedes all prior agreements and
						understandings, whether written or oral. This Agreement may not be
						modified or amended except in writing signed by both parties. This
						Agreement shall be governed by the laws of [State]. IN WITNESS
						WHEREOF, the parties hereto have executed this Agreement as of the
						date first above written. Provider: [Signature] Date: [Date]
					</Card.Text>

					<div style={{display: "flex", justifyContent: "space-between"}}>
					  <Button onClick={onBack}>Back</Button>
  					<Button onClick={onNext}>Agree</Button>
					</div>

					{/* Button to go back to previous step */}
				</Card.Body>
			</Card>
		</>
	);
}
