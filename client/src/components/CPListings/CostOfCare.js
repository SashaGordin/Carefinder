import React, { useState } from 'react';
import { Row, Col, Form, Button, Fade, Alert, Card, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';


export default function CostOfCare({ listingInfo, setListingInfo, handleUpdate }) {
	const [justSaved, setJustSaved] = useState(false);

	const services = ["Transportation", "Special diets", "Wound care", "Manicures", "Physical therapy", "House keeping", "Laundry"];

	const toggleButton = (val, e) => {
		handleChange(e);
	}
	const handleChange = (e) => {
		let val;
		let name = e.target.name;
		if (e.target.type == "checkbox") {
			val = [];
			document.querySelectorAll(`[name='${name}']:checked`).forEach((t) => {
				val.push(t.id);
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
								<Form.Select>
									<option>Light care</option>
									<option>Medium care</option>
									<option>Heavy care</option>
								</Form.Select>
							</Card.Title>

							<div>Supervised but can accomplish most ADL's by themselves</div>
							<Row className="small">
								<Col>Monthly price:</Col>
								<Col>
									<label>From</label>
									<input type="text" required name="lowPrice" value={listingInfo.lightCare?.lowPrice ?? ""} onChange={handleChange} />
								</Col>
								<Col>
									<label>To</label>
									<input type="text" required name="highPrice" value={listingInfo.lightCare?.highPrice ?? ""} onChange={handleChange} />
								</Col>
							</Row>
							<div className="small">
								Base Price:
								Breakfast, Lunch and Dinner
								Tea, Coffee and Snacks any time
								Medications Management
								Blood pressure / Weight checks
								Housekeeping and Flat Linens Laundry
								Personal Laundry
								Social and Recreational activities
								24 / 7 Emergency care
								Light support on toileting
								No special diet required
							</div>
					</Card>
				</Col>
				<Col>
					<h6>Select services that are included in this tier</h6>
					<Card>
						<Card.Body>
							<ToggleButtonGroup type="checkbox" name="services" vertical value={listingInfo.lightCare?.services} onChange={toggleButton}>
								{services.map((option, i) => (
								  <ToggleButton className={"mb-3"} id={`services-${i}`} key={i} value={option}>
									{option}
								  </ToggleButton>
								))}
							</ToggleButtonGroup>
						</Card.Body>
					</Card>
					<div>
					<input type="text" placeholder="Add service" />
					<Button>Add</Button>
				</div>
				</Col>
			</Row>
		</>

	);
}
