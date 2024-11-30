import React, { useState } from 'react';
import { Row, Col, Form, Button, Fade, Alert, Card, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';


export default function HighlightedFeatures({ listingInfo, setListingInfo, handleUpdate }) {
	const [justSaved, setJustSaved] = useState(false);

	const defaultFeatureList = ["Transportation", "Special diets", "Wound care", "Manicures", "Physical therapy", "House keeping", "Laundry"];
	const fullFeatureList = listingInfo.highlightedFeatures?.fullFeatureList ?? defaultFeatureList;

	const toggleButton = (val, e) => {
		handleChange(e);
	}
	const addService = () => {
		const newService = document.getElementById("NewFeature").value;
		if (!newService)
			return;

		let newFeatureList = new Set(fullFeatureList); //removes case-sensitive duplicates
		newFeatureList.add(newService);
		setListingInfo({
			...listingInfo,
			highlightedFeatures: {
				...listingInfo.highlightedFeatures,
				fullFeatureList: [...newFeatureList]
			}
		});

		document.getElementById("NewFeature").value = "";
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
		// listingInfo.highlightedFeatures.selectedFeatures
		setListingInfo({
			...listingInfo,
			highlightedFeatures: {
				...listingInfo.highlightedFeatures,
				[name]: val
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
							<h2>Highlighted features & Activities</h2>
						</Card.Title>
						<div style={{ height: '400px', overflowY: 'auto' }}>

						{listingInfo.highlightedFeatures?.selectedFeatures.map((option, i) => (
							<div key={i}>{option}</div>
						))}</div>
					</Card>
				</Col>
				<Col>
					<h6>Select features that your AFH has to offer</h6>
					<Card>
						<Card.Body style={{ height: '400px', overflowY: 'auto' }}>
							<ToggleButtonGroup type="checkbox" name="selectedFeatures" vertical value={listingInfo.highlightedFeatures?.selectedFeatures} onChange={toggleButton}>
								{fullFeatureList.map((option, i) => (
									<ToggleButton className={"mb-3"} id={`features-${i}`} key={i} value={option}>
										{option}
									</ToggleButton>
								))}
							</ToggleButtonGroup>
						</Card.Body>
					</Card>
					<div>
						<input onKeyDown={(e) => { if (e.key === 'Enter') addService() }} type="text" id="NewFeature" placeholder="Add service" />
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
