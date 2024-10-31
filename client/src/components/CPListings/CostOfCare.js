import React, { useState } from 'react';
import { Row, Col, Form, Button, Fade, Alert, Card, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';


export default function CostOfCare({ listingInfo, setListingInfo, handleUpdate }) {
	const [justSaved, setJustSaved] = useState(false);
	const [careLevel, setCareLevel] = useState('L');

	const careDescriptions = { "L": "Supervised but can accomplish most ADL's by themselves", "M": "Medium care description", "H": "Heavy care description", "T": "Total care description" };
	const defaultServiceList = ["Transportation", "Special diets", "Wound care", "Manicures", "Physical therapy", "House keeping", "Laundry"];
	const fullServiceList = listingInfo.costOfCare?.fullServiceList ?? defaultServiceList;
	const toggleButton = (val, e) => {
		handleChange(e);
	}
	const handleChange = (e) => {
		let val;
		//how to handle multi-tiered approach to this
		//listingInfo.costOfCare.L.services??


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
							<Form.Select name="careLevel" value={careLevel} onChange={(e) => (setCareLevel(e.target.value))}>
								<option value="L">Light care</option>
								<option value="M">Medium care</option>
								<option value="H">Heavy care</option>
								<option value="T">Total care</option>
							</Form.Select>
						</Card.Title>

						<div>{careDescriptions[`${careLevel}`]}</div>
						<Row className="small">
							<Col>Monthly price:</Col>
							<Col>
								<label>From</label>
								<input type="text" required name="lowPrice" value={listingInfo.costOfCare?.[`${careLevel}`]?.lowPrice ?? ""} onChange={handleChange} />
							</Col>
							<Col>
								<label>To</label>
								<input type="text" required name="highPrice" value={listingInfo.costOfCare?.[`${careLevel}`]?.highPrice ?? ""} onChange={handleChange} />
							</Col>
						</Row>
						<div className="small">
							Base Price:
							{listingInfo.costOfCare?.[`${careLevel}`]?.services.map((option, i) => (
								<div key={i}>{option}</div>
							))}
						</div>
					</Card>
				</Col>
				<Col>
					<h6>Select services that are included in this tier</h6>
					<Card>
						<Card.Body>
							<ToggleButtonGroup type="checkbox" name="services" vertical value={listingInfo.costOfCare?.[`${careLevel}`]?.services} onChange={toggleButton}>
								{fullServiceList.map((service, i) => (
									<ToggleButton className={"mb-3"} id={`services-${i}`} key={i} value={service}>
										{service}
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
