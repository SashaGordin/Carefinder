import React, { useState } from 'react';

const SurveyQuestion = ({ question, options, onSelect, onNext, isLastQuestion }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    onSelect(option);
  };

  const handleNext = () => {
    onNext();
    setSelectedOption(null);
  };

  return (
    <div>
      <h2>{question}</h2>
      <ul>
        {options.map((option) => (
          <li key={option}>
            <label>
              <input
                type="radio"
                value={option}
                checked={selectedOption === option}
                onChange={() => handleOptionSelect(option)}
              />
              {option}
            </label>
          </li>
        ))}
      </ul>
      <button onClick={handleNext}>{isLastQuestion ? 'Submit' : 'Next'}</button>
    </div>
  );
};

export default SurveyQuestion;