import React, { useState } from 'react';
import Step1 from './EditListing/Step1';
import Step2 from './EditListing/Step2';
import Step3 from './EditListing/Step3';
import Step4 from './EditListing/Step4';
import Step5 from './EditListing/Step5';
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button, Card } from 'react-bootstrap';


import TopNav from "./TopNav";
import Footer from "./Footer";


export default function EditListing() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const { licenseNumber} = state || {};

  const [currentStep, setCurrentStep] = useState(1);
  const [listingInfo, setListingInfo] = useState({licenseNumber: licenseNumber});

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
	console.log(listingInfo);
  };

  const handleBack = () => {
    if (currentStep == 1) //go back to listings page
		navigate("/your-listings");
	else
		setCurrentStep(currentStep - 1);
  };

  const handleFinish = () => {
    navigate('/signup', {state: {listingInfo}});
  }

  return(
    <>
    <TopNav />
    <div className="contentContainer utilityPage">

      {currentStep === 1 && <Step1 />}
      {currentStep === 2 && <Step2 setListingInfo={setListingInfo} listingInfo={listingInfo}/>}
      {currentStep === 3 && <Step3 setListingInfo={setListingInfo} listingInfo={listingInfo}/>}
      {currentStep === 4 && <Step4 setListingInfo={setListingInfo} listingInfo={listingInfo}/>}
      {currentStep === 5 && <Step5 setListingInfo={setListingInfo} listingInfo={listingInfo}/>}
		<div className="SurveyBtnGroup d-flex justify-content-between">          
			<Button onClick={handleBack}>Back</Button>
			{currentStep < 5 &&<Button onClick={handleNext}>Next</Button>}
        </div>
    </div>
    <Footer />
    </>
  )
};