import React, { useState, useEffect } from 'react';
import { firestore } from '../../firebase'; // Assuming you have firebase.js setup
import EditableField from './EditableField';
import { useAuth } from "../../contexts/AuthContext"
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { Alert } from 'react-bootstrap';


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
        console.log(currentUser.role);
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
    <div>
      <h2>Personal Information</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      <EditableField title="Provider Name" value={userData.FacilityPOC || ''} onChange={(newValue) => handleUpdate({ FacilityPOC: newValue })} />
      <EditableField title="Email Address" value={userData.email || ''} onChange={(newValue) => handleUpdate({ email: newValue })} />
      <EditableField title="Phone Number" value={userData.TelephoneNmbr || ''} onChange={(newValue) => handleUpdate({ TelephoneNmbr: newValue })} />
    </div>
  );
};

export default PersonalInfoPage;