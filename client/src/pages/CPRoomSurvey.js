//DEPRECATED
import React, { useState } from 'react';
import { firestore } from '../firebase'; // Assuming you have firebase.js setup
import { getDoc, doc, setDoc } from 'firebase/firestore';

import Step1 from '../components/CPListings/CPRoomSurvey/Step1';
import Step2 from '../components/CPListings/CPRoomSurvey/Step2';
import Step3 from '../components/CPListings/CPRoomSurvey/Step3';
import Step4 from '../components/CPListings/CPRoomSurvey/Step4';
import Step5 from '../components/CPListings/CPRoomSurvey/Step5';
import Step6 from '../components/CPListings/CPRoomSurvey/Step6';
import Step7 from '../components/CPListings/CPRoomSurvey/Step7';
import Step8 from '../components/CPListings/CPRoomSurvey/Step8';
import Step9 from '../components/CPListings/CPRoomSurvey/Step9';

import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Alert } from 'react-bootstrap';

import TopNav from '../components/TopNav';
import Footer from '../components/Footer';

export default function CPRoomSurvey() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const { userData, roomData, listingData, facilityPath } = state || {};
  const startStep = 1; //for debugging.. should be 1 normally
  const [currentStep, setCurrentStep] = useState(startStep);
  const [roomInfo, setRoomInfo] = useState(roomData);
  const [error, setError] = useState('');

  const handleNext = () => {
    if (validateInputs()) setCurrentStep(currentStep + 1);
  };
  const validateInputs = () => {
    let inputElements = document.querySelectorAll('input, textarea');
    let allValid = true;
    for (let el of inputElements) allValid &= el.reportValidity();
    return allValid;
  };

  const handleBack = () => {
    if (currentStep === 1)
      //go back to listings page
      navigate('/my-afh');
    else setCurrentStep(currentStep - 1);
  };

  const handleApprove = () => {
    handleUpdate({ ...roomInfo, isAvailable: true }).then(() => {
      setCurrentStep(currentStep + 1);
    });
  };

  const handleDone = () => {
    navigate('/my-afh');
  };

  const handleUpdate = async (updatedRoomInfo) => {
    try {
      const roomDocRef = doc(firestore, facilityPath, 'rooms', roomInfo.roomId);
      await setDoc(roomDocRef, updatedRoomInfo);
      console.log('Room data updated successfully');

      // Re-fetch user data after update
      const updatedRoomDocSnapshot = await getDoc(roomDocRef);
      if (updatedRoomDocSnapshot.exists()) {
        const updatedRoomData = updatedRoomDocSnapshot.data();
        setRoomInfo(updatedRoomData);
      } else {
        setError('Room document not found after update');
      }
    } catch (error) {
      setError('Error updating room data: ' + error.message);
    }
  };

  return (
    <>
      <TopNav />
      <div className="contentContainer utilityPage">
        {error && <Alert variant="danger">{error}</Alert>}

        {currentStep === 1 && <Step1 />}
        {currentStep === 2 && (
          <Step2 setRoomInfo={setRoomInfo} roomInfo={roomInfo} />
        )}
        {currentStep === 3 && (
          <Step3 setRoomInfo={setRoomInfo} roomInfo={roomInfo} />
        )}
        {currentStep === 4 && (
          <Step4 setRoomInfo={setRoomInfo} roomInfo={roomInfo} />
        )}
        {currentStep === 5 && (
          <Step5 setRoomInfo={setRoomInfo} roomInfo={roomInfo} />
        )}
        {currentStep === 6 && (
          <Step6 setRoomInfo={setRoomInfo} roomInfo={roomInfo} />
        )}
        {currentStep === 7 && (
          <Step7 setRoomInfo={setRoomInfo} roomInfo={roomInfo} />
        )}

        {currentStep === 8 && (
          <Step8
            userData={userData}
            listingData={listingData}
            setRoomInfo={setRoomInfo}
            roomInfo={roomInfo}
          />
        )}
        {currentStep === 9 && (
          <Step9 setRoomInfo={setRoomInfo} roomInfo={roomInfo} />
        )}

        <div className="SurveyBtnGroup d-flex justify-content-between">
          <Button onClick={handleBack}>Back</Button>
          {currentStep < 8 && <Button onClick={handleNext}>Next</Button>}
          {currentStep === 8 && (
            <Button onClick={handleApprove}>Approve</Button>
          )}
          {currentStep === 9 && <Button onClick={handleDone}>Done</Button>}
        </div>
      </div>
      <Footer />
    </>
  );
}
