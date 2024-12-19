import React, { useState } from 'react';
import { firestore } from '../../firebase'; // Assuming you have firebase.js setup
import { getDoc, doc, setDoc } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';

import Step1 from './CPRoomSurvey/Step1';
import Step2 from './CPRoomSurvey/Step2';
import Step3 from './CPRoomSurvey/Step3';
import Step4 from './CPRoomSurvey/Step4';
import Step5 from './CPRoomSurvey/Step5';
import Step6 from './CPRoomSurvey/Step6';
import Step7 from './CPRoomSurvey/Step7';
import Step8 from './CPRoomSurvey/Step8';
import Step9 from './CPRoomSurvey/Step9';

import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button, Card, Alert } from 'react-bootstrap';

import TopNav from '../TopNav';
import Footer from '../Footer';

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
    setCurrentStep(currentStep + 1);
    console.log(roomInfo);
  };

  const handleBack = () => {
    if (currentStep == 1)
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

  const { currentUser } = useAuth();

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
          {currentStep == 8 && <Button onClick={handleApprove}>Approve</Button>}
          {currentStep == 9 && <Button onClick={handleDone}>Done</Button>}
        </div>
      </div>
      <Footer />
    </>
  );
}
