import React from "react";
import { Button, Container, Row, Col } from "react-bootstrap";

const SurveyUpload = ({ assessment, description, onNext, onBack }) => {
	const handleNext = () => {
		onNext();
	};

	const handleBack = () => {
		onBack();
	};

	console.log("RADIO HANDLING!");

	return (
		<>
			{assessment ? (
				<Container
					className="p-5"
					style={{ backgroundColor: "#333", color: "#fff" }}
				>
					<Row className="justify-content-center text-center">
						<h2 className="mb-4">Great! Upload it now</h2>
						{description && <div className="mb-4">{description}</div>}
						<Col xs={12} md={8} lg={8}>
							<Button
								className="w-100 mb-2 text-left"
								//onClick={() => handleOptionClick(option)}
								style={{ fontSize: "1.2rem" }}
							>
								Upload
							</Button>
							<div className="d-flex justify-content-between mt-4">
								<Button variant="secondary" onClick={handleBack}>Back</Button>
								<Button variant="primary" onClick={handleNext}>
									Next
								</Button>
							</div>
						</Col>
					</Row>
				</Container>
			) : (
				<Container
					className="p-5"
					style={{ backgroundColor: "#333", color: "#fff" }}
				>
					<Row className="justify-content-center">
						<h2 className="mb-4">Schedule virtual assessment</h2>
						<div className="mb-4">
							Please select a day and time that you and your senior are able to
							be in the same room and conduct a 45 minute assessment via google
							meets.
						</div>

							{/* input calendly here */}
							<iframe
								title="Calendly Scheduler"
								src="https://calendly.com/carefinderwa/30min"
								style={{ width: "100%", height: "800px", border: "0" }}
								scrolling="no"
							></iframe>
							<div className="d-flex justify-content-between mt-4">
								<Button variant="secondary" onClick={handleBack}>Back</Button>
								<Button variant="primary" onClick={handleNext}>
									Next
								</Button>
							</div>
					</Row>
				</Container>
			)}
		</>
	);
};

export default SurveyUpload;
