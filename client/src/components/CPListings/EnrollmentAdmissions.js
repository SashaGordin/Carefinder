import React, { useState } from 'react';
import { Row, Col, Form, Button, Fade, Alert, Card, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';


export default function EnrollmentAdmissions({ listingInfo, setListingInfo, handleUpdate }) {
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
			
			<h1>ToDo</h1>
			<div className={"d-none"}></div>
		</>

	);
}
