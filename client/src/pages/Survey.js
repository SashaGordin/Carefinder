import React, { useState } from "react";
import SurveyQuestionRadio from "../components/ClientSurvey/SurveyQuestionRadio";
import SurveyQuestionText from "../components/ClientSurvey/SurveyQuestionText";
import SurveyQuestionCheckboxes from "../components/ClientSurvey/SurveyQuestionCheckboxes";
import SurveyUpload from "../components/ClientSurvey/SurveyUpload";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { firestore } from "../firebase";
import { serverTimestamp } from "firebase/firestore";
import SurveyInfo from "../components/ClientSurvey/SurveyInfo";
import { Button } from "react-bootstrap";
import TopNav from "../components/TopNav";
import SurveyInformational from "../components/ClientSurvey/SurveyInformational";
import SurveyAddress from "../components/ClientSurvey/SurveyAddress";
import { getDocs, doc, updateDoc } from "firebase/firestore";
import SurveyMedicaidNoAssessment from "../components/ClientSurvey/SurveyMedicaidNoAssessment";
import SurveyFinal from "../components/ClientSurvey/SurveyFinal";

const Survey = () => {
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [answers, setAnswers] = useState({});
	const navigate = useNavigate(); // Initialize useHistory
	const { currentUser } = useAuth();

	const questions = [
		{
			qtype: "radio",
			question: "What type of care settings are you interested in?",
			options: [
				"Adult Family Home",
				"Assisted Living",
				"Memory Care",
				"Independent Living",
				"Rehab Facility",
				"I don't know",
				"Other",
			],
			label: "Care_Setting",
		},
		{
			qtype: "informational",
			title:
				"We specialize in connecting individuals seeking care with Adult Family Homes.",
			skipLogic: (answers) => answers["Care_Setting"] === "Adult Family Home",
		},
		{
			qtype: "radio",
			question: "Who is in need of care?",
			options: ["Spouse", "Parent", "Myself", "Someone else", "Family member"],
			label: "Relation",
			doubleBack: true,
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
			label: "Current_Location",
		},
		{
			qtype: "radio",
			question: "What type of room does the senior seek?",
			options: ["Private", "Shared", "Private/private bathroom", "Any room"],
			label: "Room_Type_Preference",
		},
		{
			qtype: "radio",
			question: "Does your senior require a certain gender of staff?",
			options: [
				"Female staff only",
				"Female night staff",
				"Male & female",
				"All",
			],
			label: "Gender_Preference",
		},
		{
			qtype: "radio",
			question: "Is the senior okay with pets?",
			options: [
				"Must be pet free",
				"Its okay if the home has pets",
				"No preference",
				"I have a pet I want to bring with me",
				"Other",
			],
			label: "Pets",
		},
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
			label: "Religious_Affiliation",
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
			label: "Current_Lifestyle",
		},
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
			label: "Language",
		},
		{
			qtype: "radio",
			question: "How soon do you require care?",
			options: ["Urgent", "Few days", "Few week", "Few month", "This year"],
			label: "Urgency",
		},
		{
			qtype: "radio",
			question: "What type of home environment do you prefer?",
			options: ["Seniors only", "Women only", "Men only", "No preference"],
			label: "Demographic_Preference",
		},
		{
			qtype: "address",
			question:
				"Enter address of visitors to pre-load travel distance for all care options.",
			label: "Address",
		},
		{
			qtype: "radio",
			question: "Estimate your seniors level of care.",
			options: ["Low", "Medium", "High", "Total care"],
			descriptions: [
				{
					option: "Low",
					description:
						"Seniors who are mostly independent but need occassional help.",
				},
				{
					option: "Medium",
					description:
						"Requires regular assistance with daily activities and supervision for safety.",
				},
				{
					option: "High",
					description:
						"Needs substantial help with most activities and constant supervision.",
				},
				{
					option: "Total care",
					description:
						"Completely dependent on caregivers for all daily tasks and medical care.",
				},
			],
			label: "Care_Level",
		},
		{
			qtype: "radio",
			question:
				"What amount of funding do you have available to cover care expenses?",
			options: [
				"Less than $60k (Less than 1 year)",
				"$100k-$250k (1-2 years)",
				"$300k-$500k (2.5-5 years)",
				"$500k-$1M (5-10 years)",
				"Several million",
			],
			label: "Funding",
			description:
				"Some providers necessitate full monthly payment, while others offer continued care even if your funds are depleted, transitioning to Medicaid. To determine the best care option for you, we require information about your available funds to cover expenses.",
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
			assessment: answers["Current_Assessment"],
			label: "Assessment",
			description:
				"Please note: You're information is safe. The assessment is sent to selected care providers for review in order to provide a tailored quote. Your private information is safe.",
		},
		{
			qtype: "radio",
			question: "How will you pay for care?",
			options: ["Medicaid", "Private pay", "Long term care insurance", "Other"],
			label: "Payment_Method",
		},
		{
			qtype: "MedicaidNoAssessment",
			skipLogic: (answers) =>
				(answers["Payment_Method"] === "Medicaid" &&
					answers["Current_Assessment"] === "Yes") ||
				answers["Payment_Method"] !== "Medicaid",
		},
		{
			qtype: "radio",
			question: "Are you selling a home to pay for care?",
			options: ["Yes", "No"],
			label: "Selling_Home",
			description: `We partner with local real estate investors who purchase homes "as-is".
			This can be a convenient option for seniors who need to sell their homes quickly to fund care costs,
			as it can streamline the selling process and reduce stress. Would you be interested in
			connecting with these investors to explore potential solutions for your real estate needs?`,
			skipLogic: (answers) => answers["Payment_Method"] !== "Private pay",
			doubleBack: true,
		},
		// {
		// 	qtype: "radio",
		// 	question: "How are they currently getting around?",
		// 	options: [
		// 		"Independent",
		// 		"Walker",
		// 		"Bed ridden",
		// 		"Wheelchair",
		// 		"Electric wheelchair",
		// 		"Immobile",
		// 	],
		// 	label: "Mobility",
		// },

		// {
		// 	qtype: "meets",
		// 	title: "Schedule google meets",
		// 	description: "Please select from the available time slots.",
		// },
		{
			qtype: "text",
			label: "Additional_Info",
			question: "Anything else you would like to add?",
			description:
				"Tell us anything that you think we should know about your senior.",
			tripleBack: true,
		},
		{
			qtype: "info",
			question: "We need some information",
			label: "Personal_Info",
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
		const newAnswers = { ...answers };
		newAnswers[questions[currentQuestionIndex - 1].label] = answer;
		setAnswers(newAnswers);
	};

	const handleNextQuestion = async () => {
		try {
			let nextIndex = currentQuestionIndex + 1;

			// Check for skipLogic and skip questions if needed
			while (
				nextIndex - 1 < questions.length &&
				questions[nextIndex - 1].skipLogic &&
				questions[nextIndex - 1].skipLogic(answers)
			) {
				nextIndex++;
			}

			if (nextIndex - 1 < questions.length) {
				setCurrentQuestionIndex(nextIndex);
			} else {
				const surveyResponsesRef = firestore.collection("surveyResponses");
				const userQuery = surveyResponsesRef.where(
					"userId",
					"==",
					currentUser.uid
				);
				const userSnapshot = await getDocs(userQuery);
				if (currentUser && userSnapshot.docs.length === 0) {
					await firestore.collection("surveyResponses").add({
						userId: currentUser.uid,
						surveyData: answers,
						timestamp: serverTimestamp(),
					});
					navigate("/client-dashboard");
				} else if (currentUser && userSnapshot.docs.length > 0) {
					const docId = userSnapshot.docs[0].id;
					const docRef = doc(surveyResponsesRef, docId);
					await updateDoc(docRef, {
						surveyData: answers,
					});
					navigate("/client-dashboard");
				} else {
					localStorage.setItem("surveyData", JSON.stringify(answers));
					navigate("/signup");
				}
				setAnswers([]);
				setCurrentQuestionIndex(0);
			}
		} catch (error) {
			console.error("Error submitting survey: ", error);
		}
	};

	const handleBack = async (doubleBack, tripleBack) => {
		try {
			if (currentQuestionIndex - 1 >= 0) {
				if (doubleBack) {
					setCurrentQuestionIndex(currentQuestionIndex - 2);
				} else if (tripleBack) {
					setCurrentQuestionIndex(currentQuestionIndex - 3);
				} else {
					setCurrentQuestionIndex(currentQuestionIndex - 1);
				}
			}
		} catch (error) {
			console.error("Error submitting survey: ", error);
		}
	};

	const startSurvey = async () => {
		setCurrentQuestionIndex(1);
	};

	const renderQuestionComponent = () => {
    const currentQuestion = questions[currentQuestionIndex - 1];

    if (!currentQuestion) return null;

    const commonProps = {
      currentQuestionIndex,
      totalQuestions: questions.length,
      onNext: handleNextQuestion,
      onBack: handleBack,
    };

    switch (currentQuestion.qtype) {
      case "radio":
        return (
          <SurveyQuestionRadio
            {...commonProps}
            question={currentQuestion.question}
            options={currentQuestion.options}
            description={currentQuestion.description}
            onSelect={handleAnswerSelect}
            descriptions={currentQuestion.descriptions}
            doubleBack={currentQuestion.doubleBack}
            tripleBack={currentQuestion.tripleBack}
          />
        );

      case "informational":
        return (
          <SurveyInformational
            {...commonProps}
            title={currentQuestion.title}
            handleAnswerSelect={handleAnswerSelect}
          />
        );

      case "MedicaidNoAssessment":
        return <SurveyMedicaidNoAssessment />;

      case "address":
        return (
          <SurveyAddress
            {...commonProps}
            question={currentQuestion.question}
            onSelect={handleAnswerSelect}
          />
        );

      case "checkboxes":
        return (
          <SurveyQuestionCheckboxes
            {...commonProps}
            question={currentQuestion.question}
            options={currentQuestion.options}
            questionTitles={currentQuestion.question_titles}
            onSelect={handleAnswerSelect}
          />
        );

      case "text":
        return (
          <SurveyQuestionText
            {...commonProps}
            question={currentQuestion.question}
            options={currentQuestion.options}
            description={currentQuestion.description}
            onSelect={handleAnswerSelect}
          />
        );

      case "upload":
        return (
          <SurveyUpload
            {...commonProps}
            assessment={answers["Current_Assessment"]}
            description={currentQuestion.description}
          />
        );

      case "meets":
        return (
          <div className="text-center">
            <h2>Schedule Virtual Assessment</h2>
            <p>
              Please select a day and time that you and your senior are able to be
              in the same room and conduct a 45-minute assessment via Google
              Meets. Assessments are conducted by a Washington state registered
              nurse.
            </p>
          </div>
        );

      case "final":
        return <SurveyFinal {...commonProps} />;

      case "info":
        return (
          <SurveyInfo
            {...commonProps}
            onSelect={handleAnswerSelect}
          />
        );

      default:
        return null;
    }
  };


	return (
		<div className="w-full h-screen flex flex-col">
			<TopNav />
			{/* IF INDEX is 0, we run a welcome / splash page... */}
			{currentQuestionIndex === 0 ? (
				<>
					<div className="flex flex-row max-h-[calc(100vh-4rem)]">
						<div className="bg-[#1e1e1e] flex flex-1 flex-col text-center align-center justify-center p-10">
							<h1>Tell Us About Your Senior</h1>
							<p>
								In this step, we will get to know your senior, circumstances,
								requirements, wants, and needs. Let's get started!
							</p>
							<Button
								className="self-center w-auto px-5 py-2 bg-pink-500 text-white rounded hover:bg-pink-600"
								variant="primary"
								onClick={startSurvey}
							>
								Start
							</Button>
						</div>
						<div className="flex-1">
							<img className="object-cover h-full w-full opacity-50" src="suvery-photo.jpg" alt="Senior" />
						</div>
					</div>
				</>
			) : (
				renderQuestionComponent()
			)}
		</div>
	);
};

export default Survey;
