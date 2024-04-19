import React, { useState } from 'react';
import { firestore } from '../../firebase'; // Assuming you have firebase.js setup
import { getDoc, doc, setDoc } from 'firebase/firestore';
import { useAuth } from "../../contexts/AuthContext";

import Step1 from './CPRoomSurvey/Step1';
import Step2 from './CPRoomSurvey/Step2';
import Step3 from './CPRoomSurvey/Step3';
import Step4 from './CPRoomSurvey/Step4';
import Step5 from './CPRoomSurvey/Step5';
import Step6 from './CPRoomSurvey/Step6';
import Step7 from './CPRoomSurvey/Step7';
import Step8 from './CPRoomSurvey/Step8';
import Step9 from './CPRoomSurvey/Step9';
import Step10 from './CPRoomSurvey/Step10';
import Step11 from './CPRoomSurvey/Step11';
import Step12 from './CPRoomSurvey/Step12';
import Step13 from './CPRoomSurvey/Step13';
import Step14 from './CPRoomSurvey/Step14';





import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button, Card, Alert} from 'react-bootstrap';


import TopNav from "../TopNav";
import Footer from "../Footer";


export default function CPRoomSurvey() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const { roomData, facilityName} = state || {};
  const [currentStep, setCurrentStep] = useState(1);
  const [roomInfo, setRoomInfo] = useState(roomData);
  const [error, setError] = useState('');

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
	console.log(roomInfo);
  };

  const handleBack = () => {
    if (currentStep == 1) //go back to listings page
		navigate("/your-listings");
	else
		setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    handleUpdate(roomInfo).then(() => {       
       navigate("/your-listings");
    });
  }

  const { currentUser } = useAuth();

  const handleUpdate = async (updatedroomInfo) => {
    try {
      const listingDocRef = doc(firestore, 'users', currentUser.uid, 'listings', roomInfo.facilityName);
      await setDoc(listingDocRef, updatedroomInfo);
      console.log('User data updated successfully');

      // Re-fetch user data after update
      const updatedListingDocSnapshot = await getDoc(listingDocRef);
      if (updatedListingDocSnapshot.exists()) {
        const updatedUserData = updatedListingDocSnapshot.data();
        setRoomInfo(updatedUserData);
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
      {currentStep === 2 && <Step2  setRoomInfo={setRoomInfo} roomInfo={roomInfo}/>}
      {currentStep === 3 && <Step3 setRoomInfo={setRoomInfo} roomInfo={roomInfo}/>}
      {currentStep === 4 && <Step4 setRoomInfo={setRoomInfo} roomInfo={roomInfo}/>}
      {currentStep === 5 && <Step5 setRoomInfo={setRoomInfo} roomInfo={roomInfo}/>}
      {currentStep === 6 && <Step6 setRoomInfo={setRoomInfo} roomInfo={roomInfo}/>}
      {currentStep === 7 && <Step7 setRoomInfo={setRoomInfo} roomInfo={roomInfo}/>}

      {currentStep === 8 && <Step8 setRoomInfo={setRoomInfo} roomInfo={roomInfo}/>}
      {currentStep === 9 && <Step9 setRoomInfo={setRoomInfo} roomInfo={roomInfo}/>}
      {currentStep === 10 && <Step10 setRoomInfo={setRoomInfo} roomInfo={roomInfo}/>}
      {currentStep === 11 && <Step11 setRoomInfo={setRoomInfo} roomInfo={roomInfo}/>}
      {currentStep === 12 && <Step12 setRoomInfo={setRoomInfo} roomInfo={roomInfo}/>}
      {currentStep === 13 && <Step13 setRoomInfo={setRoomInfo} roomInfo={roomInfo}/>}
      {currentStep === 14 && <Step14 setRoomInfo={setRoomInfo} roomInfo={roomInfo}/>}


		  <div className="SurveyBtnGroup d-flex justify-content-between">          
			  <Button onClick={handleBack}>Back</Button>
			  {currentStep < 14 &&<Button onClick={handleNext}>Next</Button>}
        {currentStep == 14 && <Button onClick={handleSubmit}>Submit</Button>}
      </div>
    </div>
    <Footer />
    </>
  )
};