import React, { useState } from 'react';
import { Row, Col, Form, Button, Fade, Alert } from 'react-bootstrap';


export default function MedicalQuestionaire({ listingInfo, setListingInfo, handleUpdate }) {
	const [justSaved, setJustSaved] = useState(false);
	const sectionId = "medicalQuestionaire";
	const covidInfectionOptions = ["Covid 19 positive & requires isolation", "Covid 19 tested presumed positive", "Covid 19 not tested", "Covid 19 tested & negative"];
	const covidImmunityOptions = ["Vaccinated", "Non vaccinated"];
	const incontinenceSupportOptions = ["Bladder", "Bowel"];
	const mentalHealthOptions = ["Dementia/alzheimers", "Cognitivie/alert", "Mental health", "Devlopmentally disabled"];
	const genderOptions = ["Males", "Females", "Other"];
	const targetResidentOptions = ["Males", "Females", "Other", "Exit seeking", "Sun downing", "Dementia", "Assistance feeding", "Low care", "Medium care", "High care", "Total care"];

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
			<div id={sectionId}>
				<div>
					<label>Provider accepts patients with the following Covid 19 infections</label>
					{covidInfectionOptions.map((option, i) => (
						<Form.Check
							name='covidInfectionsAccepted'
							key={i}
							type='checkbox'
							value={i}
							label={option}
							checked={listingInfo.covidInfectionsAccepted?.includes(i) ?? false}
							onChange={handleChange}
						/>
					))}
				</div>
				<div>
					<label>Provider accepts patients with the following Covid 19 immunities</label>
					<div>{covidImmunityOptions.map((option, i) => (
						<Form.Check
							inline
							name='covidImmunitiesAccepted'
							key={i}
							type='checkbox'
							value={i}
							label={option}
							checked={listingInfo.covidImmunitiesAccepted?.includes(i) ?? false}
							onChange={handleChange}
						/>
					))}
					</div>
				</div>
				<div className={"switchBtnGrp"}>
					<label>Care provider accepts medicade on arrival</label>
					<Form.Switch inline name="acceptsMedicaidOnArrival" value="1" checked={listingInfo.acceptsMedicaidOnArrival?.length > 0 ? true : false} onChange={handleChange} />
				</div>
				<div className={"switchBtnGrp"}>
					<label>Care provider accepts private pay</label>
					<Form.Switch inline name="acceptsPrivatePay" value="1" checked={listingInfo.acceptsPrivatePay?.length > 0 ? true : false} onChange={handleChange} />
				</div>
				<div className={"switchBtnGrp"}>
					<label>Care provider accepts VA benefits</label>
					<Form.Switch inline name="acceptsVABenefits" value="1" checked={listingInfo.acceptsVABenefits?.length > 0 ? true : false} onChange={handleChange} />
				</div>
				<div className={"switchBtnGrp"}>
					<label>Care provider accepts long term care insurance</label>
					<Form.Switch inline name="acceptsLTCInsurance" value="1" checked={listingInfo.acceptsLTCInsurance?.length > 0 ? true : false} onChange={handleChange} />
				</div>
				<div>
					<label>Care provider incontinence support</label>
					<div>
						{incontinenceSupportOptions.map((option, i) => (
							<Form.Check
								inline
								name='incontinenceSupport'
								key={i}
								type='checkbox'
								value={i}
								label={option}
								checked={listingInfo.incontinenceSupport?.includes(i) ?? false}
								onChange={handleChange}
							/>
						))}
					</div>
				</div>

				<div className={"switchBtnGrp"}>
					<label>Can support complex diabetes management</label>
					<Form.Switch inline name="diabetesManagement" value="1" checked={listingInfo.diabetesManagement?.length > 0 ? true : false} onChange={handleChange} />
				</div>
				<div className={"switchBtnGrp"}>
					<label>Can support oxygen administration</label>
					<Form.Switch inline name="oxygenAdmin" value="1" checked={listingInfo.oxygenAdmin?.length > 0 ? true : false} onChange={handleChange} />
				</div>
				<div className={"switchBtnGrp"}>
					<label>Can support colostomy ileostomy care</label>
					<Form.Switch inline name="colostomyCare" value="1" checked={listingInfo.colostomyCare?.length > 0 ? true : false} onChange={handleChange} />
				</div>
				<div className={"switchBtnGrp"}>
					<label>Allows private pay to become medicaid within 12 months</label>
					<Form.Switch inline name="privatePayToMedicaid" value="1" checked={listingInfo.privatePayToMedicaid?.length > 0 ? true : false} onChange={handleChange} />
				</div>
				<div>
					<label>Care provider accepts:</label>
					<div>{mentalHealthOptions.map((option, i) => (
						<Form.Check
							inline 
							name='mentalHealthAccepted'
							key={i}
							type='checkbox'
							value={i}
							label={option}
							checked={listingInfo.mentalHealthAccepted?.includes(i) ?? false}
							onChange={handleChange}
						/>
					))}</div>
				</div>
				<div className={"switchBtnGrp"}>
					<label>Care provider accepts patients with mental decline not due to dementia/alzheimers</label>
					<Form.Switch inline name="mentalDeclineAccepted" value="1" checked={listingInfo.mentalDeclineAccepted?.length > 0 ? true : false} onChange={handleChange} />
				</div>
				<div>
					<label>Care provider accepts:</label>
					<div>{genderOptions.map((option, i) => (
						<Form.Check
							inline
							name='gendersAccepted'
							key={i}
							type='checkbox'
							value={i}
							label={option}
							checked={listingInfo.gendersAccepted?.includes(i) ?? false}
							onChange={handleChange}
						/>
					))}</div>
				</div>
				<div className={"switchBtnGrp"}>
					<label>Care provider can provide insulin care</label>
					<Form.Switch inline name="insulinCare" value="1" checked={listingInfo.insulinCare?.length > 0 ? true : false} onChange={handleChange} />
				</div>
				<div className={"switchBtnGrp"}>
					<label>Care provider can provide non-insulin diabetes care</label>
					<Form.Switch inline name="nonInsulinDiabetesCare" value="1" checked={listingInfo.nonInsulinDiabetesCare?.length > 0 ? true : false} onChange={handleChange} />
				</div>
				<div className={"switchBtnGrp"}>
					<label>Care provider can provide feeding tube care</label>
					<Form.Switch inline name="feedingTubeCare" value="1" checked={listingInfo.feedingTubeCare?.length > 0 ? true : false} onChange={handleChange} />
				</div>
				<div className={"switchBtnGrp"}>
					<label>Care provider can provide catheter care</label>
					<Form.Switch inline name="catheterCare" value="1" checked={listingInfo.catheterCare?.length > 0 ? true : false} onChange={handleChange} />
				</div>
				<div className={"switchBtnGrp"}>
					<label>Care provider can provide colostomy care</label>
					<Form.Switch inline name="colostomyCare" value="1" checked={listingInfo.colostomyCare?.length > 0 ? true : false} onChange={handleChange} />
				</div>
				<div className={"switchBtnGrp"}>
					<label>Care provider can provide hospice care</label>
					<Form.Switch inline name="hospiceCare" value="1" checked={listingInfo.hospiceCare?.length > 0 ? true : false} onChange={handleChange} />
				</div>
				<div className={"switchBtnGrp"}>
					<label>Care provider can accept smokers</label>
					<Form.Switch inline name="smokersAccepted" value="1" checked={listingInfo.smokersAccepted?.length > 0 ? true : false} onChange={handleChange} />
				</div>
				<div className={"switchBtnGrp"}>
					<label>Care provider has awake staff at night</label>
					<Form.Switch inline name="awakeStaffAtNight" value="1" checked={listingInfo.awakeStaffAtNight?.length > 0 ? true : false} onChange={handleChange} />
				</div>
				<div className={"switchBtnGrp"}>
					<label>Care provider can provide accept bariatric</label>
					<Form.Switch inline name="bariatricAccepted" value="1" checked={listingInfo.bariatricAccepted?.length > 0 ? true : false} onChange={handleChange} />
				</div>
				<div className={"switchBtnGrp"}>
					<label>Care provider can provide palliative care</label>
					<Form.Switch inline name="palliativeCare" value="1" checked={listingInfo.palliativeCare?.length > 0 ? true : false} onChange={handleChange} />
				</div>
				<div className={"switchBtnGrp"}>
					<label>Care provider can provide mechanical hoyer lift</label>
					<Form.Switch inline name="mechanicalHoyerLift" value="1" checked={listingInfo.mechanicalHoyerLift?.length > 0 ? true : false} onChange={handleChange} />
				</div>
				<div className={"switchBtnGrp"}>
					<label>Care provider accepts currently homeless</label>
					<Form.Switch inline name="acceptsHomeless" value="1" checked={listingInfo.acceptsHomeless?.length > 0 ? true : false} onChange={handleChange} />
				</div>
				<div className={"switchBtnGrp"}>
					<label>Care provider accepts patients with behaviors</label>
					<Form.Switch inline name="acceptsPatientsWithBehaviors" value="1" checked={listingInfo.acceptsPatientsWithBehaviors?.length > 0 ? true : false} onChange={handleChange} />
				</div>
				<div className={"switchBtnGrp"}>
					<label>Care provider accepts patients on psychoactive medications</label>
					<Form.Switch inline name="acceptsPatientsOnPAMeds" value="1" checked={listingInfo.acceptsPatientsOnPAMeds?.length > 0 ? true : false} onChange={handleChange} />
				</div>
				<div className={"switchBtnGrp"}>
					<label>Care provider can accomodate & accept exit seekers</label>
					<Form.Switch inline name="acceptsExitSeekers" value="1" checked={listingInfo.acceptsExitSeekers?.length > 0 ? true : false} onChange={handleChange} />
				</div>
				<div>
					<label>What type of residents do you seek to care for?</label>
					<Row>{targetResidentOptions.map((option, i) => (
						<Col xs={4} key={i} >
							<Form.Check
								name='targetResidents'
								type='checkbox'
								value={i}
								label={option}
								checked={listingInfo.targetResidents?.includes(i) ?? false}
								onChange={handleChange}
							/>
						</Col>

					))}</Row>
				</div>
			</div>
			<div className={'d-inline-block'}>
				<Button onClick={handleSave}>Save</Button>
				<Alert show={justSaved} onClose={() => setJustSaved(false)} dismissible variant={"success"}>Saved</Alert>
			</div>
		</>

	);
}
