import React, { useState } from 'react';
import { Button, Container, Row, Col, Form } from 'react-bootstrap';

const SurveyAddress = ({
  question,
  onNext,
  onBack,
  currentQuestionIndex,
  totalQuestions,
  onSelect,
}) => {
  const [address, setAddress] = useState('');
  const [address2, setAddress2] = useState('');
  const [address3, setAddress3] = useState('');
  const [error, setError] = useState('');
  const progressPercentage =
    ((currentQuestionIndex + 1) / totalQuestions) * 100;

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
    setError('');
  };

  const handleAddress2Change = (e) => {
    setAddress2(e.target.value);
    setError('');
  };

  const handleAddress3Change = (e) => {
    setAddress3(e.target.value);
    setError('');
  };

  const handleNext = () => {
    if (address) {
      onSelect({
        address1: address,
        ...(address2 && { address2 }),
        ...(address3 && { address3 }),
      });
      onNext();
    } else {
      setError('Please enter at least one address');
    }
  };

  return (
    <>
      <div className="text-center max-w-[50rem] mx-auto items-center h-[calc(100vh-15rem)] flex flex-col justify-center">
        <h2 className="mb-4">{question}</h2>
        <p className="text-left">
          This allows us to calculate the travel distance from visitors homes to
          care options. Only input visitors who are local to the state who will
          be visiting. (One is required)
        </p>
        <div className="flex flex-col justify-center p-2 rounded-md max-w-[30rem] mx-auto text-black gap-3">
          {error && <div className="text-danger">{error}</div>}
          <input
            type="text"
            placeholder="Enter address"
            value={address}
            onChange={handleAddressChange}
            autoComplete="street-address"
          />
          <input
            type="text"
            placeholder="Enter address"
            value={address2}
            onChange={handleAddress2Change}
            autoComplete="street-address"
          />
          <input
            type="text"
            placeholder="Enter address"
            value={address3}
            onChange={handleAddress3Change}
            autoComplete="street-address"
          />
        </div>
        <div className="w-full h-2 bg-gray-200 fixed bottom-0 left-0 rounded mb-20">
          <div
            className="h-full bg-pink-500 transition-all duration-300 rounded"
            style={{
              width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%`,
            }}
          ></div>
          <div className="d-flex justify-content-between mx-20 my-4">
            <Button variant="secondary" className="px-2" onClick={onBack}>
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

export default SurveyAddress;
