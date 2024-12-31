import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import React from 'react';
const SurveyFinal = ({ currentQuestionIndex, totalQuestions }) => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen -mt-20">
      <img className="w-1/6" src="thumb.gif" alt="thumb" />
      <h1>Congratulations! You have matches!</h1>
      <p>Thank you for your patience. You can now reveiw your matches.</p>
      <Button variant="primary" onClick={() => navigate('/client-dashboard')}>
        View Matches
      </Button>
      <div className="w-full h-2 bg-gray-200 fixed bottom-0 left-0 rounded mb-20">
        <div
          className="h-full bg-pink-500 transition-all duration-300 rounded"
          style={{
            width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%`,
          }}
        ></div>
      </div>
    </div>
  );
};

export default SurveyFinal;
