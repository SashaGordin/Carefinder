import React, { useState } from 'react';
import { firestore } from '../../firebase'; // Assuming you have firebase.js setup
import { getDoc, doc, setDoc } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';

import Step1 from './CPHomeSurvey/Step1';
import Step2 from './CPHomeSurvey/Step2';
import Step3 from './CPHomeSurvey/Step3';
import Step4 from './CPHomeSurvey/Step4';
import Step5 from './CPHomeSurvey/Step5';
import Step6 from './CPHomeSurvey/Step6';
import Step7 from './CPHomeSurvey/Step7';
import Step8 from './CPHomeSurvey/Step8';
import Step9 from './CPHomeSurvey/Step9';
import Step10 from './CPHomeSurvey/Step10';
import Step11 from './CPHomeSurvey/Step11';
import Step12 from './CPHomeSurvey/Step12';
import Step13 from './CPHomeSurvey/Step13';
import Step14 from './CPHomeSurvey/Step14';

import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button, Card, Alert } from 'react-bootstrap';

import TopNav from '../TopNav';
import Footer from '../Footer';

export default function CPHomeSurvey() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const { userData } = state || {};

  const [currentStep, setCurrentStep] = useState(1);
  const [listingInfo, setListingInfo] = useState({
    facilityName: userData.FacilityName,
    licenseNumber: userData.LicenseNumber,
    listingAddress: `${userData.LocationAddress}, ${userData.LocationCity}, ${userData.LocationState} ${userData.LocationZipCode} `,
  });
  const [error, setError] = useState('');

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
    console.log(listingInfo);
  };

  const handleBack = () => {
    if (currentStep == 1)
      //go back to listings page
      navigate('/my-afh');
    else setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    handleUpdate(listingInfo);
  };

  const { currentUser } = useAuth();

  const handleUpdate = async (updatedListingInfo) => {
    try {
      const listingDocRef = doc(
        firestore,
        'users',
        currentUser.uid,
        'listings',
        listingInfo.facilityName
      );
      await setDoc(listingDocRef, updatedListingInfo);
      console.log('User data updated successfully');

      // Re-fetch user data after update
      const updatedListingDocSnapshot = await getDoc(listingDocRef);
      if (updatedListingDocSnapshot.exists()) {
        const updatedUserData = updatedListingDocSnapshot.data();
        setListingInfo(updatedUserData);
        navigate('/my-afh');
      } else {
        setError('User document not found after update');
      }
    } catch (error) {
      setError('Error updating user data: ' + error.message);
    }
  };

  return (
    <>
      <TopNav />
      <div className="contentContainer utilityPage">
        {error && <Alert variant="danger">{error}</Alert>}

        {currentStep === 1 && <Step1 />}
        {currentStep === 2 && (
          <Step2 setListingInfo={setListingInfo} listingInfo={listingInfo} />
        )}
        {currentStep === 3 && (
          <Step3 setListingInfo={setListingInfo} listingInfo={listingInfo} />
        )}
        {currentStep === 4 && (
          <Step4 setListingInfo={setListingInfo} listingInfo={listingInfo} />
        )}
        {currentStep === 5 && (
          <Step5 setListingInfo={setListingInfo} listingInfo={listingInfo} />
        )}
        {currentStep === 6 && (
          <Step6 setListingInfo={setListingInfo} listingInfo={listingInfo} />
        )}
        {currentStep === 7 && (
          <Step7 setListingInfo={setListingInfo} listingInfo={listingInfo} />
        )}

        {currentStep === 8 && (
          <Step8 setListingInfo={setListingInfo} listingInfo={listingInfo} />
        )}
        {currentStep === 9 && (
          <Step9 setListingInfo={setListingInfo} listingInfo={listingInfo} />
        )}
        {currentStep === 10 && (
          <Step10 setListingInfo={setListingInfo} listingInfo={listingInfo} />
        )}
        {currentStep === 11 && (
          <Step11 setListingInfo={setListingInfo} listingInfo={listingInfo} />
        )}
        {currentStep === 12 && (
          <Step12 setListingInfo={setListingInfo} listingInfo={listingInfo} />
        )}
        {currentStep === 13 && (
          <Step13 setListingInfo={setListingInfo} listingInfo={listingInfo} />
        )}
        {currentStep === 14 && (
          <Step14 setListingInfo={setListingInfo} listingInfo={listingInfo} />
        )}

        <div className="SurveyBtnGroup d-flex justify-content-between">
          <Button onClick={handleBack}>Back</Button>
          {currentStep < 14 && <Button onClick={handleNext}>Next</Button>}
          {currentStep == 14 && <Button onClick={handleSubmit}>Submit</Button>}
        </div>
      </div>
      <Footer />
    </>
  );
}
