import React, { useState } from "react";
import { Button, Container, Row, Col, Form } from "react-bootstrap";

const SurveyQuestionRadio = ({
	question,
	options,
	description,
	onSelect,
	onNext,
	onBack,
}) => {
	const [selectedOption, setSelectedOption] = useState(null);
	const [error, setError] = useState("");

	const handleOptionClick = (option) => {
		setSelectedOption(option);
		setError("");
		onSelect(option);
	};

	const handleNext = () => {
		if (selectedOption) {
			onNext();
			setSelectedOption(null);
			setError("");
		} else {
			setError("Please select an option");
		}
	};

	const handleBack = () => {
		onBack();
		setSelectedOption(null);
		setError("");
	};

	return (
		<Container
			className="p-5"
			style={{ backgroundColor: "#333", color: "#fff" }}
		>
			<Row className="justify-content-center">
				<h2 className="mb-4">{question}</h2>
				{description && <div className="mb-4">{description}</div>}
				<Col xs={12} md={8} lg={8}>
					<Form onSubmit={handleNext}>
						{options.map((option) => (
							<Button
								key={option}
								variant={selectedOption === option ? "primary" : "secondary"}
								className="w-100 mb-2 text-left"
								onClick={() => handleOptionClick(option)}
								style={{ fontSize: "1.2rem", width: "50px" }}
							>
								{option}
							</Button>
						))}
						{error && <div className="text-danger">{error}</div>}
						<div className="d-flex justify-content-between mt-4">
							<Button variant="secondary" onClick={handleBack}>
								Back
							</Button>
							<Button variant="primary" onClick={handleNext}>
								Next
							</Button>
						</div>
					</Form>
				</Col>
			</Row>
		</Container>
	);
};

export default SurveyQuestionRadio;
