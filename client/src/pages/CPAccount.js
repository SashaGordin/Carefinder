import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase'; // Assuming you have firebase.js setup
import { useAuth } from '../contexts/AuthContext';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import TopNav from '../components/TopNav';
import Footer from '../components/Footer';
import PersonalInfo from '../components/CPListings/PersonalInfo';

export default function CPAccount() {
  const [userData, setUserData] = useState({});
  const { currentUser } = useAuth();
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
    // eslint-disable-next-line
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
      <div className="CPAccount">
        <TopNav userRole="provider" />

        <p>&nbsp;</p>

        {error && <div>{error}</div>}

        <PersonalInfo userData={userData} handleUpdate={handleUpdate} />
      </div>
      <Footer />
    </>
  );
}
