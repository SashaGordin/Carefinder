import React, { useState } from 'react';
import SurveyQuestion from './SurveyQuestion';
import { useNavigate } from 'react-router-dom'
import { useAuth } from "../contexts/AuthContext"
import { firestore } from '../firebase'
import { serverTimestamp } from 'firebase/firestore';
import axios from 'axios';

import TopNav from "./TopNav";
import Footer from "./Footer";

const Survey = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const navigate = useNavigate();  // Initialize useHistory
  const { currentUser } = useAuth();
  const questions = [
    { question: 'Question 1', options: ['Option A', 'Option B', 'Option C'] },
    { question: 'Question 2', options: ['Option X', 'Option Y', 'Option Z'] },
    // Add more questions...
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

  return (
    <>
    <TopNav />
    <div className="contentContainer utilityPage">
      <div>
        <h1>Survey</h1>
        <div>
          <p>Question {currentQuestionIndex + 1} of {questions.length}</p>
          <SurveyQuestion
            question={questions[currentQuestionIndex].question}
            options={questions[currentQuestionIndex].options}
            onSelect={handleAnswerSelect}
            onNext={handleNextQuestion}
            isLastQuestion={currentQuestionIndex === questions.length - 1}
          />
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default Survey;