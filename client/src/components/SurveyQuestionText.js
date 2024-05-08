import React from "react";
import { Button } from "react-bootstrap";

const SurveyQuestionText = ({
	question,
	options,
	onNext,
	onBack,
}) => {
	const handleNext = () => {
		onNext();
	};
	const handleBack = () => {
		onBack();
	};

	console.log("TEXT HANDLING!");

	return (
		<>
			<h2>{question}</h2>
			<p>
				<input type="text" placeholder="Type a message" />
			</p>
      <div className="d-flex justify-content-between mt-4">
        <Button variant="secondary" onClick={handleBack}>
          Back
        </Button>
        <Button variant="primary" onClick={handleNext}>
          Next
        </Button>
      </div>
		</>
	);
};

export default SurveyQuestionText;
