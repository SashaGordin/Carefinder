import React, { useState } from "react";
import { Button, Container, Row, Col, Form } from "react-bootstrap";

const SurveyQuestionRadio = ({
	question,
	options,
	description,
	onSelect,
	onNext,
	onBack,
	currentQuestionIndex,
	totalQuestions,
	descriptions,
	doubleBack,
	tripleBack,
}) => {
	const [selectedOption, setSelectedOption] = useState(null);
	const [error, setError] = useState("");
	const progressPercentage =
		((currentQuestionIndex + 1) / totalQuestions) * 100;

	console.log(descriptions);

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
		if (doubleBack) {
			onBack(true, false);
		} else if (tripleBack) {
			onBack(false, true);
		} else {
			onBack();
		}
		setSelectedOption(null);
		setError("");
	};

	return (
		<>
			<div className="text-center items-center h-[calc(100vh-15rem)] max-w-[50rem] mx-auto flex flex-col justify-center">
				{error && <div className="text-danger">{error}</div>}
				<h1 className="mb-4">{question}</h1>
				{description && <p>{description}</p>}
				{descriptions ? (
					<div className="flex flex-row max-w-[40rem] mx-auto gap-3">
						<div className="flex flex-col gap-4 min-w-[15rem] mx-auto">
							{options.map((option) => (
								<>
									<Button
										className="py-2 min-h-[3rem]"
										variant="primary"
										onClick={() => handleOptionClick(option)}
									>
										{option}
									</Button>
								</>
							))}
						</div>
						<div className="flex flex-col gap-4 mx-auto">
							{options.map((option) => (
								<div className="text-left text-white min-h-[3rem]">
									{
										descriptions.find((desc) => desc.option === option)
											.description
									}
								</div>
							))}
						</div>
					</div>
				) : (
					<div className="flex flex-col gap-3 justify-center min-w-[15rem] mx-auto">
						{options.map((option) => (
							<>
								<Button
									className="py-2"
									variant="primary"
									onClick={() => handleOptionClick(option)}
								>
									{option}
								</Button>
							</>
						))}
					</div>
				)}
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
		</>
		// <Container
		// 	className="p-5"
		// 	style={{ backgroundColor: "#333", color: "#fff" }}
		// >
		// 	<Row className="justify-content-center">
		// 		<h2 className="mb-4">{question}</h2>
		// 		{description && <div className="mb-4">{description}</div>}
		// 		<Col xs={12} md={8} lg={8}>
		// 			<Form onSubmit={handleNext}>
		// 				{options.map((option) => (
		// 					<Button
		// 						key={option}
		// 						variant={selectedOption === option ? "primary" : "secondary"}
		// 						className="w-100 mb-2 text-left"
		// 						onClick={() => handleOptionClick(option)}
		// 						style={{ fontSize: "1.2rem", width: "50px" }}
		// 					>
		// 						{option}
		// 					</Button>
		// 				))}
		// 				{error && <div className="text-danger">{error}</div>}
		// 				<div className="d-flex justify-content-between mt-4">
		// 					<Button variant="secondary" onClick={handleBack}>
		// 						Back
		// 					</Button>
		// 					<Button variant="primary" onClick={handleNext}>
		// 						Next
		// 					</Button>
		// 				</div>
		// 			</Form>
		// 		</Col>
		// 	</Row>
		// </Container>
	);
};

export default SurveyQuestionRadio;
