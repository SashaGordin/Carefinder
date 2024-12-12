import React, { useState } from 'react';
import { firestore } from '../firebase'; // Assuming you have firebase.js setup
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Card, Form, Alert } from 'react-bootstrap';


import TopNav from "../components/TopNav";
import Footer from "../components/Footer";


export default function CPSelectGreeting() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const { userData } = state || {};
  const [userInfo, setUserInfo] = useState(userData);
  const [error, setError] = useState('');
 
  const defaultGreetings = ["Hi, Appreciate you reaching out. Happy to provide details about our home and services.",
     "Hi, Glad you're interested in our care home. I'm available to answer any questions you may have.", 
     "Hi, Thanks for reaching out! I'm happy to provide details about our home and services.",
    "Hi, Thanks for connecting, if you have any questions let me know! Feel free to send a message or schedule a meet."];
 
  const validateInputs = () => {
    let inputElements = document.querySelectorAll("input, textarea");
    let allValid = true;
    for (let el of inputElements)
      allValid &= el.reportValidity();
    return allValid;
  }

  const handleBack = () => {
    navigate("/your-listings");
  };

  const handleSubmit = () => {
    if (validateInputs()) {
      handleUpdate(userInfo).then(() => {
        navigate("/your-listings");
      });
    }
  }
  const handleChange = (e) => {
    setUserInfo({
      ...userInfo,
      greeting: e.target.value});
  }

  const handleUpdate = async (updatedUserData) => {
    try {
      const userDocRef = doc(firestore, 'users', userInfo.userId);
      await updateDoc(userDocRef, updatedUserData);
      console.log('User data updated successfully');

      // Re-fetch user data after update
      const updatedUserDocSnapshot = await getDoc(userDocRef);
      if (updatedUserDocSnapshot.exists()) {
        const updatedUserData = updatedUserDocSnapshot.data();
        setUserInfo(updatedUserData);
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
      <div className="contentContainer utilityPage text-center">
        {error && <Alert variant="danger">{error}</Alert>}

        <div>
          <h3>Select welcoming greeting message</h3>
          <Form.Select value={userInfo.greeting ?? ""} onChange={handleChange}>
              {
                defaultGreetings.map((option, i) => {
                  return <option key={i} className="small" value={option} >{option}</option>
                })
              }
          </Form.Select>

        </div>

        <Card>
          TODO: Preview of greeting message
          <br></br>
          <br></br>
          <div>{userInfo.greeting ?? ""}</div>
        </Card>
        <div className="SurveyBtnGroup d-flex justify-content-between">
          <Button onClick={handleBack}>Back</Button>
          <Button onClick={handleSubmit}>Save</Button>
        </div>
      </div>
      <Footer />
    </>
  )
};