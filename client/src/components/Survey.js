import React, { useState } from 'react';
import SurveyQuestionRadio from './SurveyQuestionRadio';
import SurveyQuestionText from './SurveyQuestionText';
import SurveyQuestionCheckboxes from './SurveyQuestionCheckboxes';
import { useNavigate } from 'react-router-dom'
import { useAuth } from "../contexts/AuthContext"
import { firestore } from '../firebase'
import { serverTimestamp } from 'firebase/firestore';
import axios from 'axios';
import { Card, Button } from 'react-bootstrap';

import TopNav from "./TopNav";
import Footer from "./Footer";

const Survey = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const navigate = useNavigate();  // Initialize useHistory
  const { currentUser } = useAuth();

  // ADDED THE FOLLOWING TYPES OF QUESTIONS as 'qtype' in question json below...:
  // 'text' -- loads text SurveyQuestionsText.js
  // 'radio' -- loads SurveyQuestionsRadio.js
  // 'checkboxes' -- loads SurveyQuestionsCheckboxes.js
  
  /** This is roughed-in at the moment... I need a user ID to continue testing / will look at that next. Also will look at Micah's text to see if we also need a free-form textarea type answer (large text box instead of one-line). Need to CSS these things a bit more, too.
  */

  const questions = [
    { qtype:'text', question: 'This is a test textquestion... what is your name?', options: [] },
    { qtype:'radio', question: 'Who is in need of care?', options: ['Spouse', 'Parent', 'Loved One', 'Myself', 'Someone else'] },
    { qtype:'radio', question: 'How soon do you require care?', options: ['Urgently','Few days', 'Few weeks', 'Few months', 'This year'] },
    { qtype:'text', question: 'How old is your loved one?', options: ['this','needs','to be','a text input'] },
    { qtype:'radio', question: 'How are you paying for care?', options: ['Medicaid','Savings','Sold a home','Other'] },
    { qtype:'radio', question: 'How far are you willing to travel?', options: ['Urgently','Few days','Few weeks','Few months'] },
    { qtype:'radio', question: 'Where is your loved one currently residing?', options: ['Home (alone)','Home (with help)','Assisted living','Hospital'] },
    { qtype:'radio', question: 'How are they currently getting around?', options: ['Independent','Walker','Bed ridden','Wheelchair','Immobile','Electric wheelchair'] },
    { qtype:'checkboxes', question: 'Do they need help with any of the following?', options: ['Medication', 'Toileting', 'Bathing', 'Diabetic Care', 'Special Diet', 'Social Activity', 'Daily Activities', 'None'] },
    { qtype:'radio', question: 'Do you have a current assessment?', options: ['Yes','No'], questionNote:'Please note: Assessments are due annually by Washington State law Wac 13.4.23. If your assessment is more than one year old, you are required to receive a new one. Luckily, we offer a complimentary virtual assessment, saving your hundreds.' },

    // END OF THIS PART OF SURVEY:
    // FROM HERE IT SPLITS OFF
    // IF YES:  Upload it now:
    // IF NO:  Schedule assessment screen

  ];


  const handleAnswerSelect = (answer) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answer;
    setAnswers(newAnswers);
  };


  const handleNextQuestion = async () => {
    const userId = currentUser.uid;

    try{
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        await firestore.collection('surveyResponses').add({
          userId,
          surveyData: answers,
          timestamp: serverTimestamp(),
        })

        axios.post('http://localhost:3001/matchUserWithHouses', answers)
        .then(response => {
          console.log('Matched houses:', response.data.matchedHouses);
        })
        .catch(error => {
          console.error('Error:', error);
        });

        setAnswers([])
        setCurrentQuestionIndex(0)
        navigate("/")
        // Survey is complete, handle submission or navigate to the next page
      }
    } catch (error) {
      console.error('Error submitting survey: ', error);
    }
  };

  const startSurvey = async () => {
    setCurrentQuestionIndex(1);
  }

  if (currentQuestionIndex>0) {
    console.log("qidx: " + currentQuestionIndex -1 ); 
    console.log('qtype: '+ questions[currentQuestionIndex-1].qtype);
  }

  return (
    <>
    <TopNav />
    <div className="contentContainer utilityPage">

      {/* IF INDEX is 0, we run a welcome / splash page... */}
      { currentQuestionIndex == 0 && 
        <>
          <Card>
            <Card.Img variant="top" src="senior.jpg" />
            <Card.Body>
              <Card.Title>Tell Us About Your Senior</Card.Title>
              <Card.Text>
              In this step, we will get to know your senior, circumstances, requirements, wants, and needs. Let's get started!
              </Card.Text>
              <Button variant="primary" onClick={startSurvey}>Get Started</Button>
            </Card.Body>
          </Card>            
        </>
      }

      {/* IF it's a RADIO BUTTON question ... */}
      { ( currentQuestionIndex > 0 && questions[currentQuestionIndex-1].qtype == 'radio' ) &&
          <>
            <Card>
              <Card.Body>
                <Card.Title>Survey</Card.Title>
                <Card.Text>
                <p>Question {currentQuestionIndex} of {questions.length}</p>
                <SurveyQuestionRadio
                  question={questions[currentQuestionIndex-1].question}
                  options={questions[currentQuestionIndex-1].options}
                  onSelect={handleAnswerSelect}
                  onNext={handleNextQuestion}
                  isLastQuestion={currentQuestionIndex === questions.length}
                />
                </Card.Text>
              </Card.Body>
            </Card>
          </>
      }

      {/* IF it's a CHECKBOX question ... needs some tweaking to allow multiple choices. */}
      { ( currentQuestionIndex > 0 && questions[currentQuestionIndex-1].qtype == 'checkboxes' ) &&
          <>
            <Card>
              <Card.Body>
                <Card.Title>Survey</Card.Title>
                <Card.Text>
                <p>Question {currentQuestionIndex} of {questions.length}</p>
                <SurveyQuestionCheckboxes
                  question={questions[currentQuestionIndex-1].question}
                  options={questions[currentQuestionIndex-1].options}
                  onSelect={handleAnswerSelect}
                  onNext={handleNextQuestion}
                  isLastQuestion={currentQuestionIndex === questions.length}
                />
                </Card.Text>
              </Card.Body>
            </Card>
          </>
      }

      {/* IF it's a ONE-LINE TEXT question ... */}
      { ( currentQuestionIndex > 0 && questions[currentQuestionIndex-1].qtype == 'text' ) &&
          <>
            <Card>
              <Card.Body>
                <Card.Title>Survey</Card.Title>
                <Card.Text>
                <p>Question {currentQuestionIndex} of {questions.length}</p>
                <SurveyQuestionText
                  question={questions[currentQuestionIndex-1].question}
                  options={questions[currentQuestionIndex-1].options}
                  onSelect={handleAnswerSelect}
                  onNext={handleNextQuestion}
                  isLastQuestion={currentQuestionIndex === questions.length}
                />
                </Card.Text>
              </Card.Body>
            </Card>
          </>
      }

    </div>
    <Footer />
    </>
  );
};

export default Survey;