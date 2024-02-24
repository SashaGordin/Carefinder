import React, { useState } from 'react';

const SurveyQuestionCheckboxes = ({ question, options, onSelect, onNext, isLastQuestion }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    onSelect(option);
  };

  const handleNext = () => {
    onNext();
    setSelectedOption(null);
  };

  console.log('CHECKBOX HANDLING!');

  return (
    <>
      <h2>{question}</h2>
      <ul className="surveyUL">
        {options.map((option) => (
          <li key={option}>
            <label>
              <input
                type="checkbox"
                value={option}
                checked={selectedOption === option}
                onChange={() => handleOptionSelect(option)}
              />
              {option}
            </label>
          </li>
        ))}
      </ul>
      <button className="btn" onClick={handleNext}>{isLastQuestion ? 'Submit' : 'Next'}</button>
    </>
  );
};

export default SurveyQuestionCheckboxes;
