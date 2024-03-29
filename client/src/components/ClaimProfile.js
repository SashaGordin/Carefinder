import React, { useState } from 'react';
import Step1 from './ClaimProfile/Step1';
import Step2 from './ClaimProfile/Step2';
import Step3 from './ClaimProfile/Step3';
import Step4 from './ClaimProfile/Step4';
import Step5 from './ClaimProfile/Step5';
import { useNavigate } from 'react-router-dom';


import TopNav from "./TopNav";
import Footer from "./Footer";


export default function ClaimProfile() {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [providerInfo, setProviderInfo] = useState(null);

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleFinish = () => {
    navigate('/signup', {state: {providerInfo, fromClaimProfile: true }});
  }

  return(
    <>
    <TopNav />
    <div className="contentContainer utilityPage">

      {currentStep === 1 && <Step1 onNext={handleNext} setProviderInfo={setProviderInfo} />}
      {currentStep === 2 && <Step2 onNext={handleNext} onBack={handleBack} providerInfo={providerInfo}/>}
      {currentStep === 3 && <Step3 onNext={handleNext} onBack={handleBack} providerInfo={providerInfo}/>}
      {currentStep === 4 && <Step4 onNext={handleNext} onBack={handleBack} providerInfo={providerInfo}/>}
      {currentStep === 5 && <Step5 onFinish={handleFinish} onBack={handleBack} providerInfo={providerInfo}/>}

    </div>
    <Footer />
    </>
  )
};