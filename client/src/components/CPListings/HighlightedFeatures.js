import React, { useState } from 'react';
import { Row, Col, Form, Button, Fade, Alert, Card, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';


export default function HighlightedFeatures({ listingInfo, setListingInfo, handleUpdate }) {
	const [justSaved, setJustSaved] = useState(false);

	const features = ["Transportation", "Special diets", "Wound care", "Manicures", "Physical therapy", "House keeping", "Laundry"];

	const toggleButton = (val, e) => {
		handleChange(e);
	}
	const handleChange = (e) => {
		let val;
		let name = e.target.name;
		if (e.target.type == "checkbox") {
			val = [];
			document.querySelectorAll(`[name='${name}']:checked`).forEach((t) => {
				val.push(t.value);
			});
		}
		else
			val = e.target.value;
		setListingInfo({
			...listingInfo,
			[name]: val
		});
	}

	const handleSave = () => {
		handleUpdate(listingInfo).then(() => {
			setJustSaved(true);
			console.log("success");
		});
	}

	return (

		<>
			<Row>
				<Col>
					<Card>
							<Card.Title>
								<h2>Highlighted features & Activities</h2>
							</Card.Title>

							{listingInfo.features?.map((option, i) => (
								<div key={i}>{option}</div>
							))}
					</Card>
				</Col>
				<Col>
					<h6>Select features that your AFH has to offer</h6>
					<Card>
						<Card.Body>
							<ToggleButtonGroup type="checkbox" name="features" vertical value={listingInfo.features} onChange={toggleButton}>
								{features.map((option, i) => (
								  <ToggleButton className={"mb-3"} id={`features-${i}`} key={i} value={option}>
									{option}
								  </ToggleButton>
								))}
							</ToggleButtonGroup>
						</Card.Body>
					</Card>
					<div>
					<input type="text" placeholder="Add feature" />
					<Button>Add</Button>
				</div>
				</Col>
			</Row>
		</>

	);
}
