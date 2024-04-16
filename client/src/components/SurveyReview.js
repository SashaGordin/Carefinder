import React from "react";
import { Button, Container, Row } from "react-bootstrap";

const SurveyReview = ({ onNext, onBack }) => {
	const handleNext = () => {
		onNext();
	};

	const handleBack = () => {
		onBack();
	};

	console.log("RADIO HANDLING!");

	return (
		<Container
			className="p-5"
			style={{ backgroundColor: "#333", color: "#fff" }}
		>
			<Row className="justify-content-center">
				<h2 className="mb-4">Survey is complete!</h2>
        <div className="mb-4">We will gather personalized quotes from providers that match your preferences. Please be patient as this process may take up to 24 hours. You will receive a notification once all quotes have been compiled.</div>
        <div className="mb-4">Thank you for your patience.</div>
				<div className="d-flex justify-content-between mt-4">
					<Button variant="secondary" onClick={handleBack}>
						Back
					</Button>
					<Button variant="primary" onClick={handleNext}>
						Submit
					</Button>
				</div>
			</Row>
		</Container>
	);
};

export default SurveyReview;
