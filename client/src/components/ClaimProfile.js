import React, { useState } from 'react';
import Step1 from './ClaimProfile/Step1';
import Step2 from './ClaimProfile/Step2';

export default function ClaimProfile() {
  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  return(
    <>
      {currentStep === 1 && <Step1 onNext={handleNext} />}
      {currentStep === 2 && <Step2 onNext={handleNext} onBack={handleBack} />}
    </>
  )
};