import React, { useState, useEffect } from 'react';
import { firestore } from '../../firebase'; // Assuming you have firebase.js setup
import EditableField from './EditableField';
import { useAuth } from "../../contexts/AuthContext"
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { Alert } from 'react-bootstrap';

import { Card } from 'react-bootstrap';

import TopNav from "../TopNav";
import Footer from '../Footer';


const PersonalInfoPage = () => {
  const [userData, setUserData] = useState({});
  const { currentUser } = useAuth()
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const userDocRef = doc(firestore, 'users', currentUser.uid);
      const userDocSnapshot = await getDoc(userDocRef);
      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        console.log(userData);
        setUserData(userData);
      } else {
        setError('User document not found');
      }
    };
    fetchData();
  }, []);

  const handleUpdate = async (updatedUserData) => {
    try {
      const userDocRef = doc(firestore, 'users', currentUser.uid);
      await updateDoc(userDocRef, updatedUserData);
      console.log('User data updated successfully');

      // Re-fetch user data after update
      const updatedUserDocSnapshot = await getDoc(userDocRef);
      if (updatedUserDocSnapshot.exists()) {
        const updatedUserData = updatedUserDocSnapshot.data();
        setUserData(updatedUserData);
      } else {
        setError('User document not found after update');
      }
    } catch (error) {
      setError('Error updating user data: ' + error.message);
    }
  };

  return (
    <>
      {/*}
      <TopNav />
      {*/}

      <div className="contentContainer utilityPage personalInfo">
      <Card>
            <Card.Body>
                <Card.Title>Personal Information</Card.Title>
                {error && <Alert variant="danger">{error}</Alert>}

                <Card.Text>

                  <EditableField title="Provider Name" value={userData.FacilityPOC || ''} onChange={(newValue) => handleUpdate({ FacilityPOC: newValue })} />
                  
                  <EditableField title="Email Address" value={userData.email || ''} onChange={(newValue) => handleUpdate({ email: newValue })} />
                  
                  <EditableField title="Phone Number" value={userData.TelephoneNmbr || ''} onChange={(newValue) => handleUpdate({ TelephoneNmbr: newValue })} />
                  
                </Card.Text>
            </Card.Body>
      </Card>
      </div>

      {/*}
      <Footer />
    {*/}

    </>
  );
};

export default PersonalInfoPage;