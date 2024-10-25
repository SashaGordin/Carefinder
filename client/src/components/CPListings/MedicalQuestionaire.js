import React, {useState} from 'react';
import { Row, Col, Form, Button, Fade, Alert } from 'react-bootstrap';


export default function MedicalQuestionaire({ listingInfo, setListingInfo, handleUpdate }) {
	const [justSaved, setJustSaved] = useState(false);

	const licenseOptions = ["Dementia", "Developmentally disabled", "Mental health"];

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
			<h1>Todo</h1>
			<div className={"d-none"}>
				<div>
					<label>How is this home operated:</label>
					<input type="text" required name="homeOperation" value={listingInfo.homeOperation ?? ""} onChange={handleChange} />
				</div>
				<div>
					<label>Provider credentials</label>
					<input type="text" required name="credentials" value={listingInfo.credentials ?? ""} onChange={handleChange} />
				</div>
				<div>
					<label>Licensed for</label>
					{licenseOptions.map((option) => (
						<Form.Check
							name='speciality'
							key={option}
							type='checkbox'
							id={option}
							label={option}
							checked={listingInfo.speciality?.includes(option) ?? false}
							onChange={handleChange}
						/>
					))}
				</div>
				<div>
					<label>Select contracts</label>
					<input type="text" required name="contracts" value={listingInfo.contracts ?? ""} onChange={handleChange} />
				</div>
				<div>
					<label>Provider statement:</label>
					<input type="textarea" required className="small" rows="5" cols="50" name="statement" value={listingInfo.statement ?? ""} onChange={handleChange} />
				</div>
				<div>
					<label>Do you want to receive text notifications?</label>
					<Form.Switch inline name="textNotifications" value="1" checked={listingInfo.textNotifications?.length > 0 ? true : false} onChange={handleChange} />
				</div>
				<div>
					<label>Do you require prospective residents to be qualified to message you?</label>
					<Form.Switch inline name="qualifiedMessagesOnly" value="1" checked={listingInfo.qualifiedMessagesOnly?.length > 0 ? true : false} onChange={handleChange} />
				</div>
				<div>
					<label>Link to disclosure of services:</label>
					<input type="text" required name="serviceDisclosureLink" value={listingInfo.serviceDisclosureLink ?? ""} onChange={handleChange} />
				</div>
				<div>
					<label>Link to latest inspection:</label>
					<input type="text" required name="inspectionLink" value={listingInfo.inspectionLink ?? ""} onChange={handleChange} />
				</div>
				<Row>
					<Col><label>Do you have any pets in the home?</label>
						<Form.Select name="petsInHome" value={listingInfo.petsInHome ?? "N"} onChange={handleChange} >
							<option value="Y">Yes</option>
							<option value="N">No</option>
						</Form.Select>
					</Col>
					<Col>
						<label>Do you accept pets into the home?</label>
						<Form.Select name="petsAccepted" value={listingInfo.petsAccepted ?? "N"} onChange={handleChange} >
							<option value="Y">Yes</option>
							<option value="N">No</option>
						</Form.Select>
					</Col>
				</Row>
				<div>
					<label>Do you or staff speak any languages other than english</label>
					<input type="text" required name="languages" value={listingInfo.languages ?? ""} onChange={handleChange} />
				</div>
				<div>
					<label>What is the current resident demographic?</label>
					<input type="text" required name="demographics" value={listingInfo.demographics ?? ""} onChange={handleChange} />
				</div>
				<div>
					<label>What is the staffing ratio?</label>
					<input type="text" required name="staffingRatio" value={listingInfo.staffingRatio ?? ""} onChange={handleChange} />
				</div>
				<div>
					<label>Set boundaries for financial spend down</label>
					<input type="text" required name="financialBoundaries" value={listingInfo.financialBoundaries ?? ""} onChange={handleChange} />
				</div>
				<div>
					<label>Policy for depleted funds</label>
					<input type="text" required name="depletedFundsPolicy" value={listingInfo.depletedFundsPolicy ?? ""} onChange={handleChange} />
				</div>
			</div>
			<div className={'d-inline-block'}>
				<Button onClick={handleSave}>Save</Button>
				<Alert show={justSaved} onClose={() => setJustSaved(false)} dismissible variant={"success"}>Saved</Alert>
			</div>
		</>

	);
}
