import React, { useState } from 'react';
import { firestore } from '../firebase'; // Assuming you have firebase.js setup
import { getDoc, doc, setDoc } from 'firebase/firestore';

import Step1 from '../components/CPListings/CPHomeSurvey/Step1';
import Step2 from '../components/CPListings/CPHomeSurvey/Step2';
import Step3 from '../components/CPListings/CPHomeSurvey/Step3';
import Step4 from '../components/CPListings/CPHomeSurvey/Step4';
import Step5 from '../components/CPListings/CPHomeSurvey/Step5';
import Step6 from '../components/CPListings/CPHomeSurvey/Step6';
import Step7 from '../components/CPListings/CPHomeSurvey/Step7';
import Step8 from '../components/CPListings/CPHomeSurvey/Step8';
import Step9 from '../components/CPListings/CPHomeSurvey/Step9';
import Step10 from '../components/CPListings/CPHomeSurvey/Step10';
import Step11 from '../components/CPListings/CPHomeSurvey/Step11';
import Step12 from '../components/CPListings/CPHomeSurvey/Step12';
import Step13 from '../components/CPListings/CPHomeSurvey/Step13';
import Step14 from '../components/CPListings/CPHomeSurvey/Step14';





import { useNavigate, useLocation } from "react-router-dom";
import { Button, Alert } from 'react-bootstrap';


import TopNav from "../components/TopNav";
import Footer from "../components/Footer";


export default function CPHomeSurvey() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const { listingData, facilityPath} = state || {};
  const [currentStep, setCurrentStep] = useState(1);
  const [listingInfo, setListingInfo] = useState(listingData);
  const [error, setError] = useState('');

  const handleNext = () => {
    if (validateInputs())
      setCurrentStep(currentStep + 1);
  };

  const validateInputs = () => {
    let inputElements = document.querySelectorAll("input, textarea");
    let allValid = true;
    for (let el of inputElements)
      allValid &= el.reportValidity();
    return allValid;
  }

  const handleBack = () => {
    if (currentStep === 1) //go back to listings page
		navigate("/my-afh");
	else
		setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    handleUpdate(listingInfo).then(() => {
       navigate("/my-afh");
    });
  }


  const handleUpdate = async (updatedListingInfo) => {
    try {
      const listingDocRef = doc(firestore, facilityPath);
      await setDoc(listingDocRef, updatedListingInfo);
      console.log('User data updated successfully');

      // Re-fetch user data after update
      const updatedListingDocSnapshot = await getDoc(listingDocRef);
      if (updatedListingDocSnapshot.exists()) {
        const updatedUserData = updatedListingDocSnapshot.data();
        setListingInfo(updatedUserData);
      } else {
        setError('User document not found after update');
      }
    } catch (error) {
      setError('Error updating user data: ' + error.message);
    }
  };


  return(
    <>
    <TopNav />
  <div className="contentContainer utilityPage">
    {error && <Alert variant="danger">{error}</Alert>}

      {currentStep === 1 && <Step1 />}
      {currentStep === 2 && <Step2 setError={setError} setListingInfo={setListingInfo} listingInfo={listingInfo}/>}
      {currentStep === 3 && <Step3 setListingInfo={setListingInfo} listingInfo={listingInfo}/>}
      {currentStep === 4 && <Step4 setListingInfo={setListingInfo} listingInfo={listingInfo}/>}
      {currentStep === 5 && <Step5 setListingInfo={setListingInfo} listingInfo={listingInfo}/>}
      {currentStep === 6 && <Step6 setListingInfo={setListingInfo} listingInfo={listingInfo}/>}
      {currentStep === 7 && <Step7 setListingInfo={setListingInfo} listingInfo={listingInfo}/>}

      {currentStep === 8 && <Step8 setListingInfo={setListingInfo} listingInfo={listingInfo}/>}
      {currentStep === 9 && <Step9 setListingInfo={setListingInfo} listingInfo={listingInfo}/>}
      {currentStep === 10 && <Step10 setListingInfo={setListingInfo} listingInfo={listingInfo}/>}
      {currentStep === 11 && <Step11 setListingInfo={setListingInfo} listingInfo={listingInfo}/>}
      {currentStep === 12 && <Step12 setListingInfo={setListingInfo} listingInfo={listingInfo}/>}
      {currentStep === 13 && <Step13 setListingInfo={setListingInfo} listingInfo={listingInfo}/>}
      {currentStep === 14 && <Step14 setListingInfo={setListingInfo} listingInfo={listingInfo}/>}


		  <div className="SurveyBtnGroup d-flex justify-content-between">
			  <Button onClick={handleBack}>Back</Button>
			  {currentStep < 14 &&<Button onClick={handleNext}>Next</Button>}
        {currentStep === 14 && <Button onClick={handleSubmit}>Submit</Button>}
      </div>
    </div>
    <Footer />
    </>
  )
};