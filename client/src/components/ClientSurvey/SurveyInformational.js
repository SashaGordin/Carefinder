import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
const SurveyInformational = ({
	title,
	onNext,
	currentQuestionIndex,
	handleAnswerSelect,
	totalQuestions,
}) => {
	const navigate = useNavigate();
	const progressPercentage = (currentQuestionIndex / totalQuestions) * 100;

	const handleExit = () => {
		navigate("/client-dashboard");
	};

	const handleNext = () => {
		handleAnswerSelect("Care_Setting", "Adult Family Home");
		onNext();
	};

	return (
		<div className="min-h-[calc(100vh-30rem)] text-center flex flex-col justify-center items-center max-w-[50rem] mx-auto relative">
			<h2 className="mb-4">{title}</h2>
			<div className="text-left">
			  <p>
  				While we're continually expanding our services, we're unable to assist
  				with other care options at this time. Sorry for the inconvenience, we're
  				a new service and will be able to offer more services soon.
  			</p>
  			<p>Do you want to continue with adult family homes?</p>
			</div>
			<div className="w-full h-2 bg-gray-200 fixed bottom-0 left-0 rounded mb-20">
				<div
					className="h-full bg-pink-500 transition-all duration-300 rounded"
					style={{ width: `${progressPercentage}%` }}
				></div>
				<div className="d-flex justify-content-between mx-20 my-4">
					<Button variant="secondary" className="px-2" onClick={handleExit}>
						Exit
					</Button>
					<Button variant="primary" className="px-2" onClick={handleNext}>
						Continue
					</Button>
				</div>
			</div>
		</div>
	);
};

export default SurveyInformational;
