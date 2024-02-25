import React, { useState } from 'react';

const SurveyQuestionText = ({ question, options, onNext, isLastQuestion }) => {

  const handleNext = () => {
    onNext();
  };

  console.log('TEXT HANDLING!');

  return (
    <>
      <h2>{question}</h2>
      <p><input type="text" /></p>
      <button className="btn" onClick={handleNext}>{isLastQuestion ? 'Submit' : 'Next'}</button>
    </>
  );
};

export default SurveyQuestionText;
