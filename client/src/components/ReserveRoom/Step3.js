import React from "react";
import { Button, Card } from "react-bootstrap";

export default function Step3({ onNext, onBack, houseRules }) {
	return (
		<>
			<Card>
				<Card.Body>
					<Card.Title style={{ textAlign: "center" }}>House Rules</Card.Title>

					<Card.Text>
						<div>
							Quiet Hours: Establish specific times during the day when noise
							levels should be kept to a minimum to ensure peace and quiet for
							all residents.
						</div>
						<div>
							Respect for Others: Emphasize the importance of respecting other
							residents\' privacy, space, and belongings.
						</div>
						<div>
							Cleanliness and Hygiene: Encourage residents to maintain
							cleanliness and good hygiene standards in shared spaces such as
							kitchens, bathrooms, and living areas.
						</div>
						<div>
							No Smoking: Implement a no-smoking policy indoors to promote a
							healthy and smoke-free environment.
						</div>
						<div>
							Guest Policy: Set guidelines for having guests over, including
							restrictions on overnight stays and the number of visitors allowed
							at one time.
						</div>
						<div>
							Safety and Security: Remind residents to lock doors and windows
							when leaving the premises and report any suspicious activity to
							the appropriate authorities.
						</div>
						<div>
							Pets: If pets are allowed, establish rules regarding pet behavior,
							waste disposal, and noise control.
						</div>
						<div>
							Shared Responsibilities: Clearly outline residents\'
							responsibilities for chores, maintenance tasks, and other shared
							duties to ensure a well-maintained living environment.
						</div>
						<div>
							Prohibited Items: Specify items that are not allowed on the
							premises, such as illegal substances, weapons, or hazardous
							materials.
						</div>
						<div>
							Emergency Procedures: Provide guidance on what to do in case of
							emergencies, including evacuation procedures, emergency contact
							information, and location of emergency supplies.
						</div>
						<div>
							Parking Rules: Establish rules for parking vehicles, including
							designated parking areas, visitor parking, and restrictions on
							parking in certain areas.
						</div>
						<div>
							Internet and Technology Use: Set guidelines for internet and
							technology use, including bandwidth limitations, acceptable use
							policies, and consequences for violating these rules.
						</div>
						<div>
							Respect for Property: Encourage residents to take care of the
							property and report any damages or maintenance issues promptly.
						</div>
						<div>
							Community Events and Gatherings: Promote a sense of community by
							organizing regular events or gatherings for residents to socialize
							and connect with one another.
						</div>
						<div>
							Dispute Resolution: Provide procedures for resolving conflicts or
							disputes among residents in a peaceful and constructive manner.
						</div>
						<div>
							These house rules can help create a harmonious and respectful
							living environment for all residents. Adjustments can be made
							based on the specific needs and preferences of the community.
						</div>
					</Card.Text>

					<div style={{ display: "flex", justifyContent: "space-between" }}>
						<Button onClick={onBack}>Back</Button>
						<Button onClick={onNext}>Agree</Button>
					</div>

					{/* Button to go back to previous step */}
				</Card.Body>
			</Card>
		</>
	);
}
