import React, { useState } from 'react';
import { Row, Col, Form, Button, Fade, Alert, Card, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import { careDescriptions } from '../../constants';

export default function CostOfCare({ listingInfo, setListingInfo, handleUpdate }) {
	const [justSaved, setJustSaved] = useState(false);
	const [careLevel, setCareLevel] = useState('L');

	const defaultServiceList = ["Transportation", "Special diets", "Wound care", "Manicures", "Physical therapy", "House keeping", "Laundry"];
	const fullServiceList = listingInfo.costOfCare?.fullServiceList ?? defaultServiceList;
	const toggleButton = (val, e) => {
		handleChange(e);
	}

	const addService = () => {
		const newService = document.getElementById("NewService").value;
		if (!newService)
			return;

		let newServiceList = new Set(fullServiceList); //removes case-sensitive duplicates
		newServiceList.add(newService);
		setListingInfo({
			...listingInfo,
			costOfCare: {
				...listingInfo.costOfCare,
				fullServiceList: [...newServiceList]
			}
		});

		document.getElementById("NewService").value = "";
	}

	const handleChange = (e) => {
		let val;

		//sample costOfCare object
		let sampleCostOfCare = {
			L: {
				lowPrice: 2,
				highPrice: 10,
				services: ["service1", "service2", "etc."]
			},
			M: {
				lowPrice: 2,
				highPrice: 10,
				services: ["service1", "service2", "etc."]
			},
			H: {
				lowPrice: 2,
				highPrice: 10,
				services: ["service1", "service2", "etc."]
			},
			T: {
				lowPrice: 2,
				highPrice: 10,
				services: ["service1", "service2", "etc."]
			},
			fullServiceList: ["Transportation", "Special diets", "etc."]
		};

		let name = e.target.name;
		if (e.target.type == "checkbox") {
			val = [];
			document.querySelectorAll(`[name='${name}']:checked`).forEach((t) => {
				val.push(t.value);
			});
		}
		else
			val = e.target.value;

		// listingInfo.costOfCare.[careLevel]
		setListingInfo({
			...listingInfo,
			costOfCare: {
				...listingInfo.costOfCare,
				[careLevel]: {
					...listingInfo.costOfCare?.[careLevel],
					[name]: val
				}
			}
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
								<input type="currency" required name="lowPrice" value={listingInfo.costOfCare?.[careLevel]?.lowPrice ?? ""} onChange={handleChange} />
							</Col>
							<Col>
								<label>To</label>
								<input type="currency" required name="highPrice" value={listingInfo.costOfCare?.[careLevel]?.highPrice ?? ""} onChange={handleChange} />
							</Col>
						</Row>
						<div className="small">
							Base Price:
							<div style={{ height: '200px', overflowY: 'auto' }}>
								{listingInfo.costOfCare?.[`${careLevel}`]?.services?.map((option, i) => (
									<div key={i}>{option}</div>
								))}
							</div>
						</div>
					</Card>
				</Col>
				<Col>
					<h6>Select services that are included in this tier</h6>
					<Card>
						<Card.Body style={{ height: '400px', overflowY: 'auto' }}>
							<ToggleButtonGroup type="checkbox" name="services" vertical value={listingInfo.costOfCare?.[careLevel]?.services ?? []} onChange={toggleButton}>
								{fullServiceList.map((service, i) => (
									<ToggleButton className={"mb-3"} id={`services-${i}`} key={i} value={service}>
										{service}
									</ToggleButton>
								))}
							</ToggleButtonGroup>
						</Card.Body>
					</Card>
					<div>
						<input onKeyDown={(e) => { if (e.key === 'Enter') addService() }} type="text" id="NewService" placeholder="Add service" />
						<Button onClick={addService}>Add</Button>
					</div>
				</Col>
			</Row>
			<div className={'d-inline-block'}>
				<Button onClick={handleSave}>Save Changes</Button>
				<Alert show={justSaved} onClose={() => setJustSaved(false)} dismissible variant={"success"}>Saved</Alert>
			</div>
		</>

	);
}
