import React, { useState } from "react";
import { Button } from "react-bootstrap";

const SurveyQuestionText = ({ question, options, onSelect, onNext, onBack }) => {
  const [inputValue, setInputValue] = useState("");

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
      <h2>{question}</h2>
      <p>
        <input
          type="text"
          placeholder="Type a message"
          value={inputValue}
          onChange={handleInputChange}
        />
      </p>
      <div className="d-flex justify-content-between mt-4">
        <Button variant="secondary" onClick={handleBack}>
          Back
        </Button>
        <Button variant="primary" onClick={handleNext}>
          Next
        </Button>
      </div>
    </>
  );
};

export default SurveyQuestionText;
