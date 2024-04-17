import React, { useState, useEffect } from "react";
import SurveyQuestionRadio from "../components/ClientSurvey/SurveyQuestionRadio";
import SurveyQuestionText from "../components/ClientSurvey/SurveyQuestionText";
import SurveyQuestionCheckboxes from "../components/ClientSurvey/SurveyQuestionCheckboxes";
import SurveyUpload from "../components/ClientSurvey/SurveyUpload";
import SurveyReview from "../components/ClientSurvey/SurveyReview";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { firestore } from "../firebase";
import { serverTimestamp } from "firebase/firestore";
import SurveyInfo from "../components/ClientSurvey/SurveyInfo";
import { Card, Button, Container, Row } from "react-bootstrap";

import TopNav from "../components/TopNav";
import Footer from "../components/Footer";

const Survey = () => {
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [progress, setProgress] = useState(0);
	const [answers, setAnswers] = useState({});
	const navigate = useNavigate(); // Initialize useHistory
	const { currentUser } = useAuth();

	// ADDED THE FOLLOWING TYPES OF QUESTIONS as 'qtype' in question json below...:
	// 'text' -- loads text SurveyQuestionsText.js
	// 'radio' -- loads SurveyQuestionsRadio.js
	// 'checkboxes' -- loads SurveyQuestionsCheckboxes.js

	/** This is roughed-in at the moment... I need a user ID to continue testing / will look at that next. Also will look at Micah's text to see if we also need a free-form textarea type answer (large text box instead of one-line). Need to CSS these things a bit more, too.
	 */

	const questions = [
		{
			qtype: "info",
			question: "We need some information",
			label: "Personal_Info"
		},
		{
			qtype: "radio",
			question: "Who is in need of care?",
			options: ["Spouse", "Parent", "Myself", "Someone else", "Family member"],
			label: "Relation"
		},
		{
			qtype: "radio",
			question: "Where is the senior currently residing?",
			options: [
				"Home (Alone)",
				"Home (with help)",
				"Assisted living",
				"Hospital",
				"Rehab Facility",
				"Adult Family Home",
				"Other",
			],
			label: "Current_Location"
		},
		{
			qtype: "radio",
			question: "Do any of these currently apply to the senior?",
			options: [
				"Independent",
				"Assistance with daily living",
				"Memory care",
				"Hospice (end of life)",
				"Other",
			],
			label: "Current_Lifestyle"
		},
		{
			qtype: "radio",
			question: "How are they currently getting around?",
			options: [
				"Independent",
				"Walker",
				"Bed ridden",
				"Wheelchair",
				"Electric wheelchair",
				"Immobile",
			],
			label: "Mobility"
		},
		{
			qtype: "radio",
			question: "What type of room does the senior seek?",
			options: ["Private", "Shared", "Private/private bathroom", "Any room"],
			label: "Room_Type_Preference"
		},
		//to do
		{
			qtype: "checkboxes",
			question: "Any religious affiliations?",
			question_titles: ["Religion"],
			options: [
				"Christian",
				"Islam",
				"Hindu",
				"Buddist",
				"Jewish",
				"Other",
				"No affiliation",
			],
			label: "Religious_Affiliation"
		},
		//to do
		{
			qtype: "checkboxes",
			question: "Any additional languages spoken?",
			question_titles: ["Primary language", "Secondary language (optional)"],
			options: [
				"English",
				"Spanish",
				"Chinese (Mandarin or Cantonese)",
				"Vietnamese",
				"French",
				"Korean",
				"Arabic",
				"Russian",
				"Other",
			],
			label: "Language"
		},
		{
			qtype: "radio",
			question: "How do we feel about pets?",
			options: [
				"I want to bring a dog",
				"I want to bring a cat",
				"Must be pet free",
				"No preference",
				"Its okay if the home has pets",
				"Other",
			],
			label: "Pets"
		},
		{
			qtype: "radio",
			question: "How soon do you require care?",
			options: ["Urgent", "Few days", "Few week", "Few month", "This year"],
			label: "Urgency"
		},
		{
			qtype: "radio",
			question: "What are preferences on the home demographics?",
			options: ["Seniors only", "Women only", "Men only", "No preference"],
			label: "Demographic_Preference"
		},
		{
			qtype: "radio",
			question: "How will you pay for care?",
			options: ["Medicaid", "Private pay", "Long term care insurance", "Other"],
			label: "Payment_Method"
		},
		{
			qtype: "radio",
			question:
				"What amount of funding do you have available to cover care expenses?",
			options: [
				"Less than $10,000",
				"$10,000-$50,000",
				"$50,000-$100,000",
				"$100,000-$200,000",
				"$200,000-$500,000",
				"$500,000+",
			],
			label:"Funding",
			description:
				"Some providers necessitate full monthly payment, while others offer continued care even if your funds are depleted, transitioning to Medicaid. To determine the best care option for you, we require information about your available funds to cover expenses.",
			footer:
				"This represents your budget for covering the entire cost of care. While no financial disclosures are required, being honest upfront can help avoid complications later. We do not share or disclose your selections to the providers; instead, we simply inform them whether or not you meet their requirements.",
		},
		{
			qtype: "radio",
			question: "Do you have a current assessment?",
			options: ["Yes", "No"],
			label: "Current_Assessment",
			description:
				"Please note: Assessments are due annually by Washington State law Wac 13.4.23. If your assessment is more than one year old, you are required to receive a new one. Luckily, we offer a complimentary virtual assessment, saving your hundreds.",
		},
		{
			qtype: "upload",
			assessment: answers[14],
			label: "Assessment",
			description:
				"Please note: You're information is safe. The assessment is sent to selected care providers for review in order to provide a tailored quote. Your private information is safe.",
		},
		{
			qtype: "meets",
			title: "Schedule google meets",
			description: "Please select from the available time slots.",
		},
		{
			qtype: "text",
			label: "Additional_Info",
			question: "Anything else you would like to add?",
		},
		{
			qtype: "final",
		},

		// END OF THIS PART OF SURVEY:
		// FROM HERE IT SPLITS OFF
		// IF YES:  Upload it now:
		// IF NO:  Schedule assessment screen
	];

	const handleAnswerSelect = (answer) => {
		const newAnswers = {...answers};
		newAnswers[questions[currentQuestionIndex - 1].label] = answer;
		setAnswers(newAnswers);
	};

	const handleNextQuestion = async () => {
		//const userId = currentUser.uid;

		try {
			if (currentQuestionIndex - 1 < questions.length - 1) {
				setCurrentQuestionIndex(currentQuestionIndex + 1);
			} else {
				if (currentUser) {
					await firestore.collection("surveyResponses").add({
						userId: currentUser.uid,
						surveyData: answers,
						timestamp: serverTimestamp(),
					});
					navigate("/");
				} else {
					localStorage.setItem("surveyData", JSON.stringify(answers));
					navigate("/signup");
				}
				setAnswers([]);
				setCurrentQuestionIndex(0);
			}
			// else {
			//   await firestore.collection('surveyResponses').add({
			//     userId,
			//     surveyData: answers,
			//     timestamp: serverTimestamp(),
			//   })

			//   axios.post('http://localhost:3001/matchUserWithHouses', answers)
			//   .then(response => {
			//     console.log('Matched houses:', response.data.matchedHouses);
			//   })
			//   .catch(error => {
			//     console.error('Error:', error);
			//   });

			//   setAnswers([])
			//   setCurrentQuestionIndex(0)
			//   navigate("/")
			//   // Survey is complete, handle submission or navigate to the next page
			// }
		} catch (error) {
			console.error("Error submitting survey: ", error);
		}
	};

	const handleBack = async () => {
		try {
			if (currentQuestionIndex - 1 > 0) {
				setCurrentQuestionIndex(currentQuestionIndex - 1);
			}
		} catch (error) {
			console.error("Error submitting survey: ", error);
		}
	};

	const startSurvey = async () => {
		setCurrentQuestionIndex(1);
	};

	// if (currentQuestionIndex > 0) {
	// 	// console.log("qidx: ", currentQuestionIndex - 1);
	// 	// console.log("qtype: " + questions[currentQuestionIndex - 1].qtype);
	// 	console.log(answers);
	// }

	useEffect(() => {
		// Calculate progress percentage whenever currentQuestionIndex or questions.length changes
		setProgress((currentQuestionIndex / questions.length) * 100);
	  }, [currentQuestionIndex, questions.length]);

	return (
		<>
			<TopNav />
			<div className="contentContainer utilityPage seniorSurvey">
				{/* IF INDEX is 0, we run a welcome / splash page... */}
				{currentQuestionIndex === 0 && (
					<>
						<Card>
							<Card.Img variant="top" src="senior.jpg" />
							<Card.Body>
								<Card.Title>Tell Us About Your Senior</Card.Title>
								<Card.Text>
									In this step, we will get to know your senior, circumstances,
									requirements, wants, and needs. Let's get started!
								</Card.Text>
								<Button variant="primary" onClick={startSurvey}>
									Get Started
								</Button>
							</Card.Body>
						</Card>
					</>
				)}

				{/* IF it's a RADIO BUTTON question ... */}
				{currentQuestionIndex > 0 &&
					questions[currentQuestionIndex - 1].qtype === "radio" && (
						<>
							<Card>
								<Card.Body>
									<Card.Title>Survey</Card.Title>
									<Card.Text>
										<p>
											Question {currentQuestionIndex} of {questions.length}
										</p>
										<SurveyQuestionRadio
											question={questions[currentQuestionIndex - 1].question}
											options={questions[currentQuestionIndex - 1].options}
											description={
												questions[currentQuestionIndex - 1].description
											}
											onSelect={handleAnswerSelect}
											onNext={handleNextQuestion}
											onBack={handleBack}
										/>
									</Card.Text>
									<div className="progress-bar">
										<div className="progress" style={{ width: `${progress}%` }}></div>
										<p className="progress-text">{progress.toFixed(0)}% Complete</p>
									</div>									

								</Card.Body>
							</Card>
						</>
					)}

				{/* IF it's a CHECKBOX question ... needs some tweaking to allow multiple choices. */}
				{currentQuestionIndex > 0 &&
					questions[currentQuestionIndex - 1].qtype === "checkboxes" && (
						<>
							<Card>
								<Card.Body>
									<Card.Title>Survey</Card.Title>
									<Card.Text>
										<p>
											Question {currentQuestionIndex} of {questions.length}
										</p>
										<SurveyQuestionCheckboxes
											question={questions[currentQuestionIndex - 1].question}
											options={questions[currentQuestionIndex - 1].options}
											questionTitles={
												questions[currentQuestionIndex - 1].question_titles
											}
											onSelect={handleAnswerSelect}
											onNext={handleNextQuestion}
											onBack={handleBack}
										/>
									</Card.Text>
									<div className="progress-bar">
										<div className="progress" style={{ width: `${progress}%` }}></div>
										<p className="progress-text">{progress.toFixed(0)}% Complete</p>
									</div>									
								</Card.Body>
							</Card>
						</>
					)}

				{/* IF it's a ONE-LINE TEXT question ... */}
				{currentQuestionIndex > 0 &&
					questions[currentQuestionIndex - 1].qtype === "text" && (
						<>
							<Card>
								<Card.Body>
									<Card.Title>Survey</Card.Title>
									<Card.Text>
										<p>
											Question {currentQuestionIndex} of {questions.length}
										</p>
										<SurveyQuestionText
											question={questions[currentQuestionIndex - 1].question}
											options={questions[currentQuestionIndex - 1].options}
											onSelect={handleAnswerSelect}
											onNext={handleNextQuestion}
											onBack={handleBack}
										/>
									</Card.Text>
									<div className="progress-bar">
										<div className="progress" style={{ width: `${progress}%` }}></div>
										<p className="progress-text">{progress.toFixed(0)}% Complete</p>
									</div>									
								</Card.Body>
							</Card>
						</>
					)}
				{currentQuestionIndex > 0 &&
					questions[currentQuestionIndex - 1].qtype === "upload" && (
						<>
							<Card>
								<Card.Body>
									<Card.Title>Survey</Card.Title>
									<Card.Text>
										<p>
											Question {currentQuestionIndex} of {questions.length}
										</p>
										<SurveyUpload
											assessment={
												questions[currentQuestionIndex - 1].assessment === "Yes"
											}
											description={
												questions[currentQuestionIndex - 1].description
											}
											onNext={handleNextQuestion}
											onBack={handleBack}
										/>
									</Card.Text>
									<div className="progress-bar">
										<div className="progress" style={{ width: `${progress}%` }}></div>
										<p className="progress-text">{progress.toFixed(0)}% Complete</p>
									</div>									
								</Card.Body>
							</Card>
						</>
					)}
				{currentQuestionIndex > 0 &&
					questions[currentQuestionIndex - 1].qtype === "meets" && (
						<>
							<Card>
								<Card.Body>
									<Card.Title>Survey</Card.Title>
									<Card.Text>
										<p>
											Question {currentQuestionIndex} of {questions.length}
										</p>
										<Container
											className="p-5"
											style={{ backgroundColor: "#333", color: "#fff" }}
										>
											<Row className="justify-content-center">
												<h2 className="mb-4">
													Do you have any questions? Would you like to set up a
													Google Meet session with a local advisor?
												</h2>
												<div className="mb-4">
													Please select a day and time from available options.
												</div>

												{/* input calendly here */}
												<iframe
													title="Calendly Scheduler"
													src="https://calendly.com/carefinderwa/chat-with-micah-local-senior-advisor"
													style={{
														width: "100%",
														height: "800px",
														border: "0",
													}}
													scrolling="no"
												></iframe>
												<div className="d-flex justify-content-between mt-4">
													<Button variant="secondary" onClick={handleBack}>
														Back
													</Button>
													<Button
														variant="primary"
														onClick={handleNextQuestion}
													>
														Next
													</Button>
												</div>
											</Row>
										</Container>
									</Card.Text>
									<div className="progress-bar">
										<div className="progress" style={{ width: `${progress}%` }}></div>
										<p className="progress-text">{progress.toFixed(0)}% Complete</p>
									</div>									
								</Card.Body>
							</Card>
						</>
					)}
				{currentQuestionIndex > 0 &&
					questions[currentQuestionIndex - 1].qtype === "final" && (
						<>
							<Card>
								<Card.Body>
									<Card.Title>Survey</Card.Title>
									<Card.Text>
										<p>
											Question {currentQuestionIndex} of {questions.length}
										</p>
										<SurveyReview
											onBack={handleBack}
											onNext={handleNextQuestion}
										/>
									</Card.Text>
									<div className="progress-bar">
										<div className="progress" style={{ width: `${progress}%` }}></div>
										<p className="progress-text">{progress.toFixed(0)}% Complete</p>
									</div>									
								</Card.Body>
							</Card>
						</>
					)}
				{currentQuestionIndex > 0 &&
					questions[currentQuestionIndex - 1].qtype === "info" && (
						<>
							<Card>
								<Card.Body>
									<Card.Title>Survey</Card.Title>
									<Card.Text>
										<p>
											Question {currentQuestionIndex} of {questions.length}
										</p>
										<SurveyInfo
											onSelect={handleAnswerSelect}
											onBack={handleBack}
											onNext={handleNextQuestion}
										/>
									</Card.Text>
									<div className="progress-bar">
										<div className="progress" style={{ width: `${progress}%` }}></div>
										<p className="progress-text">{progress.toFixed(0)}% Complete</p>
									</div>									
								</Card.Body>
							</Card>
						</>
					)}

			</div>
			<Footer />
		</>
	);
};

export default Survey;
