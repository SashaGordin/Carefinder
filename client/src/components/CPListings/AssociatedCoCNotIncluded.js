import React, { useState } from 'react';
import { Row, Col, Form, Button, Fade, Alert, Card, ToggleButton, ToggleButtonGroup} from 'react-bootstrap';
import { defaultNotIncludedFeatureList } from '../../constants';

export default function AssociatedCoCNotIncluded({ listingInfo, setListingInfo, handleUpdate }) {
	const [justSaved, setJustSaved] = useState(false);
	const sectionId = "associatedCoCNotIncluded";
	const fullFeatureList = listingInfo.associatedCoCNotIncluded?.fullFeatureList ?? defaultNotIncludedFeatureList;

	const toggleButton = (val, e) => {
		handleChange(e);
	}
	const addService = () => {
		const newService = document.getElementById(sectionId + "_NewFeature").value;
		if (!newService)
			return;

		let newFeatureList = new Set(fullFeatureList); //removes case-sensitive duplicates
		newFeatureList.add(newService);
		setListingInfo({
			...listingInfo,
			associatedCoCNotIncluded: {
				...listingInfo.associatedCoCNotIncluded,
				fullFeatureList: [...newFeatureList]
			}
		});

		document.getElementById(sectionId + "_NewFeature").value = "";
	}

	const handleChange = (e) => {
		let val;
		let name = e.target.name;
		if (e.target.type == "checkbox") {
			val = [];
			document.querySelectorAll(`#${sectionId} [name='${name}']:checked`).forEach((t) => {
				val.push(parseInt(t.value));
			});
		}
		else
			val = e.target.value;
		// listingInfo.associatedCoCNotIncluded.selectedFeatures
		setListingInfo({
			...listingInfo,
			associatedCoCNotIncluded: {
				...listingInfo.associatedCoCNotIncluded,
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
			<div id={sectionId}>
				<Row>
					<Col xs={8}>
						<Card>
							<Card.Title>
								<h2>Associated cost of care not included</h2>
							</Card.Title>
							<div style={{ height: '400px', overflowY: 'auto' }}>

								{listingInfo.associatedCoCNotIncluded?.selectedFeaturesNotIncluded?.map((featureId, i) => (
									<div className={'small'} key={i}>{fullFeatureList[featureId]}</div>
								))}</div>
						</Card>
					</Col>
					<Col xs={4}>
						<h6>Select features that your AFH has to offer</h6>
						<Card>
							<Card.Body style={{ height: '400px', overflowY: 'auto', padding: '10px', display: 'flex' }}>
								<ToggleButtonGroup className="m-auto" type="checkbox" name="selectedFeaturesNotIncluded" vertical value={listingInfo.associatedCoCNotIncluded?.selectedFeaturesNotIncluded} onChange={toggleButton}>
									{fullFeatureList.map((option, i) => (
										<ToggleButton className={"mb-3"} id={`not-included-features-${i}`} key={i} value={i}>
											{option}
										</ToggleButton>
									))}
								</ToggleButtonGroup>
							</Card.Body>
						</Card>
						<div className="d-flex mt-3 flex-column">
							<input className="w-100" onKeyDown={(e) => { if (e.key === 'Enter') addService() }} type="text" id={sectionId + "_NewFeature"} placeholder="Add service" />
							<Button onClick={addService}>Add</Button>
						</div>
					</Col>
				</Row>
				<div className={'d-inline-block'}>
					<Button onClick={handleSave}>Save Changes</Button>
					<Alert show={justSaved} onClose={() => setJustSaved(false)} dismissible variant={"success"}>Saved</Alert>
				</div >
			</div>
		</>

	);
}
