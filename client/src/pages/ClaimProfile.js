import React, { useState  } from 'react';
import Step1 from '../components/ClaimProfile/Step1';
import Step2 from '../components/ClaimProfile/Step2';
import Step3 from '../components/ClaimProfile/Step3';
import Step4 from '../components/ClaimProfile/Step4';
import Step5 from '../components/ClaimProfile/Step5';
import { useNavigate, useLocation } from 'react-router-dom';
import { firestore } from '../firebase'; // Assuming you have firebase.js setup
import { getDoc, doc, setDoc } from 'firebase/firestore';

import TopNav from "../components/TopNav";
import Footer from "../components/Footer";


export default function ClaimProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const { addAFH, uid } = state || {};
  const [currentStep, setCurrentStep] = useState(1);
  const [providerInfo, setProviderInfo] = useState(null);
  const [error, setError] = useState('');

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleFinish = () => {
    if (addAFH) {
      addAFHToExistingUser().then(() => {
        navigate("/your-listings");
      });
    }
    else
      navigate('/signup', { state: { providerInfo, fromClaimProfile: true } });
  };

  const addAFHToExistingUser = async () => {
    try {
      const initialListingData = {
        facilityName: providerInfo.FacilityName,
        licenseNumber: providerInfo.LicenseNumber,
        listingAddress: `${providerInfo.LocationAddress}, ${providerInfo.LocationCity}, ${providerInfo.LocationState} ${providerInfo.LocationZipCode} `
      };
      const facilityPath = `users/${uid}/listings/${providerInfo.LicenseNumber}`;
      const listingDocRef = doc(firestore, facilityPath);
      await setDoc(listingDocRef, initialListingData);
      console.log('User data updated successfully');

      // Re-fetch user data after update
      const updatedListingDocSnapshot = await getDoc(listingDocRef);
      if (!updatedListingDocSnapshot.exists()) {
        setError('Listing document not found after update');
      }
    } catch (error) {
      setError('Error updating user data: ' + error.message);
    }
  };

  return (
    <>
      <TopNav />
      <div className="contentContainer utilityPage">

        {currentStep === 1 && <Step1 onNext={handleNext} setProviderInfo={setProviderInfo} />}
        {currentStep === 2 && <Step2 onNext={handleNext} onBack={handleBack} providerInfo={providerInfo} />}
        {currentStep === 3 && <Step3 onNext={handleNext} onBack={handleBack} providerInfo={providerInfo} />}
        {currentStep === 4 && <Step4 onNext={handleNext} onBack={handleBack} providerInfo={providerInfo} />}
        {currentStep === 5 && <Step5 onFinish={handleFinish} onBack={handleBack} providerInfo={providerInfo} />}

      </div>
      <Footer />
    </>
  )
};