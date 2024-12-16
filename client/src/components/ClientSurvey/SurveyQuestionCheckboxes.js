import React, { useState } from "react";
import { Button, Row, Col, Form } from "react-bootstrap";

const SurveyQuestionCheckboxes = ({
	question,
	questionTitles,
	options,
	onSelect,
	onNext,
	onBack,
	currentQuestionIndex,
	totalQuestions,
}) => {
	const [selectedOptions, setSelectedOptions] = useState({});
	const [errors, setErrors] = useState("");

	const progressPercentage =
		((currentQuestionIndex + 1) / totalQuestions) * 100;

	const handleOptionSelect = (title, option) => {
		const updatedOptions = {
			...selectedOptions,
			[title]: option,
		};
		setSelectedOptions(updatedOptions);
		setErrors((prevErrors) => ({
			...prevErrors,
			[title]: "", // Clear the error message when an option is selected
		}));
		onSelect(updatedOptions);
	};

	const handleNext = () => {
		const newErrors = {};

		// Check if any questionTitle is missing a selection
		questionTitles.forEach((title, index) => {
			if (index === 1 && title.endsWith("(optional)")) {
				// Skip validation for optional title
				return;
			}
			if (!selectedOptions[title]) {
				newErrors[title] = `Please select an option for "${title}"`;
			}
		});

		// If any error exists, update the errors state
		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
		} else {
			onNext(selectedOptions);
			setSelectedOptions({});
			setErrors({});
		}
	};

	const handleBack = () => {
		onBack();
	};

	return (
		<>
			<div className="text-center items-center h-[calc(100vh-15rem)] flex flex-col justify-center">
				<h1>{question}</h1>
				{questionTitles.map((title, index) => (
					<>
						<p key={index}>{title}</p>
						{errors[title] && (
							<div className="text-danger">{errors[title]}</div>
						)}
						<select
							className="w-full py-2 px-2 rounded-md max-w-[15rem] mx-auto text-black mb-3"
							onChange={(e) => handleOptionSelect(title, e.target.value)}
							value={selectedOptions[title] || ""}
						>
							<option value="">Select an option</option>
							{options.map((option, index) => (
								<option className="text-black" key={index} value={option}>
									{option}
								</option>
							))}
						</select>
					</>
				))}
			</div>
			<div className="w-full h-2 bg-gray-200 fixed bottom-0 left-0 rounded mb-20">
				<div
					className="h-full bg-pink-500 transition-all duration-300 rounded"
					style={{ width: `${progressPercentage}%` }}
				></div>
				<div className="d-flex justify-content-between mx-20 my-4">
					<Button variant="secondary" className="px-2" onClick={handleBack}>
						Back
					</Button>
					<Button variant="primary" className="px-2" onClick={handleNext}>
						Next
					</Button>
				</div>
			</div>
			{/* <h2>{question}</h2>

			{questionTitles.map((title, index) => (
				<div key={index} className="mt-4">
					<Row>
						<Col>
							<Form.Label>{title}</Form.Label>
							<Form.Control
								as="select"
								onChange={(e) => handleOptionSelect(title, e.target.value)}
								value={selectedOptions[title] || ""}
							>
								<option value="">Select an option</option>
								{options.map((option, index) => (
									<option key={index} value={option}>
										{option}
									</option>
								))}
							</Form.Control>
						</Col>
					</Row>
					{errors[title] && (
						<span className="text-danger">{errors[title]}</span>
					)}
				</div>
			))}
			<div className="d-flex justify-content-between mt-4">
				<Button variant="secondary" onClick={handleBack}>
					Back
				</Button>
				<Button variant="primary" onClick={handleNext}>
					Next
				</Button>
			</div> */}
		</>
	);
};

export default SurveyQuestionCheckboxes;
