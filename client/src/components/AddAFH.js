import React from 'react';
import { Button, Card, CardTitle, CardText, CardBody } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function AddAFH({ uid }) {
	const navigate = useNavigate();

	const goToClaimProfile = () => {
		navigate('/claim-profile', { state: { addAFH: true, uid: uid } });
	}

	return (

		<>

			<Card>
				<CardBody><CardTitle>Add AFH</CardTitle>
					<CardText>Please note: Adding another AFH will automatically place you into our "multiple home membership" tier. As always, you won't be charged until you land a resident in this specific home. Same terms and model apply.
					</CardText>
					<Button onClick={goToClaimProfile}>Add AFH</Button>
				</CardBody>
			</Card>
		</>

	);
}