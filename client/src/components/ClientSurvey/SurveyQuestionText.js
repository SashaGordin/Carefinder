import React, { useState } from 'react';
import { Button } from 'react-bootstrap';

const SurveyQuestionText = ({
  question,
  options,
  onSelect,
  onNext,
  onBack,
  description,
  currentQuestionIndex,
  totalQuestions,
}) => {
  const [inputValue, setInputValue] = useState('');
  const progressPercentage =
    ((currentQuestionIndex + 1) / totalQuestions) * 100;

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleNext = () => {
    // Pass the input value to the parent component via the onSelect callback
    onSelect(inputValue);
    onNext();
  };

  const handleBack = () => {
    onBack();
  };

  return (
    <>
      <div className="text-center h-[calc(100vh-15rem)] flex flex-col justify-center">
        <h1>{question}</h1>
        <p className="max-w-[45rem] mx-auto mb-10">{description}</p>
        <p>
          <textarea
            placeholder="Type a message"
            value={inputValue}
            onChange={handleInputChange}
            className="max-w-[45rem] mx-auto min-h-[15rem] w-full border border-gray-300 rounded-md p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          ></textarea>
        </p>
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
      </div>
    </>
  );
};

export default SurveyQuestionText;
