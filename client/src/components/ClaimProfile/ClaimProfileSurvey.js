import React, { useState } from 'react';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';
import Step5 from './Step5';
import Step6 from './Step6';
import Step7 from './Step7';
import Step8 from './Step8';
import PaymentInformation from './PaymentInformation';
import { useNavigate, useLocation } from 'react-router-dom';
import { firestore } from '../../firebase';
import { getDoc, doc, setDoc } from 'firebase/firestore';

export default function ClaimProfileSurvey({
  userId,
  addAFH,
  handleNewProperty,
}) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [providerInfo, setProviderInfo] = useState(null);
  const [error, setError] = useState('');

  const handleNext = () => {
    if (addAFH && currentStep === 3)
      //existing users don't need to finish all the steps
      handleFinish();
    else setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleFinish = () => {
    if (addAFH) {
      addAFHToExistingUser().then(
        (initialListingData) => {
          handleNewProperty(initialListingData);
        },
        (error) => {
          setError(error.message);
        }
      );
    } else {
      console.log('providerInfo: ', providerInfo);
      navigate('/signup', { state: { providerInfo, fromClaimProfile: true } });
    }
  };

  const addAFHToExistingUser = async () => {
    const initialListingData = {
      facilityName: providerInfo.FacilityName,
      licenseNumber: providerInfo.LicenseNumber,
      listingAddress: `${providerInfo.LocationAddress}, ${providerInfo.LocationCity}, ${providerInfo.LocationState} ${providerInfo.LocationZipCode} `,
    };
    const facilityPath = `users/${userId}/listings/${providerInfo.LicenseNumber}`;
    const listingDocRef = doc(firestore, facilityPath);
    await setDoc(listingDocRef, initialListingData);
    console.log('User data updated successfully');

    // Re-fetch user data after update
    const updatedListingDocSnapshot = await getDoc(listingDocRef);
    if (!updatedListingDocSnapshot.exists()) {
      throw new Error('Listing document not found after update');
    }
    return initialListingData;
  };

  return (
    <>
      <div className="overflow-auto" style={{ maxHeight: 25 + 'rem' }}>
        {error && <div>{error}</div>}
        {currentStep === 1 && (
          <Step1 onNext={handleNext} setProviderInfo={setProviderInfo} />
        )}
        {/* {currentStep === 2 && (
          <Step2
            onNext={handleNext}
            onBack={handleBack}
            providerInfo={providerInfo}
          />
        )} */}
        {currentStep === 2 && (
          <Step3
            onNext={handleNext}
            onBack={handleBack}
            providerInfo={providerInfo}
          />
        )}
        {currentStep === 3 && <Step4 onNext={handleNext} onBack={handleBack} />}
        {currentStep === 4 && <Step5 onNext={handleNext} onBack={handleBack} />}
        {currentStep === 5 && <Step6 onNext={handleNext} onBack={handleBack} />}
        {currentStep === 6 && <Step7 onNext={handleNext} onBack={handleBack} />}
        {currentStep === 7 && <Step8 onNext={handleNext} onBack={handleBack} />}
        {currentStep === 8 && (
          <PaymentInformation
            onFinish={handleFinish}
            onBack={handleBack}
            provider={providerInfo}
            setProviderInfo={setProviderInfo}
          />
        )}
      </div>
    </>
  );
}
