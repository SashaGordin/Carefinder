import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase'; // Assuming you have firebase.js setup
import { useAuth } from '../contexts/AuthContext';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import TopNav from '../components/TopNav';
import Footer from '../components/Footer';
import EditableField from '../components/menu/EditableField';
import { isValidUrl } from '../utils';
import { Card, Alert } from 'react-bootstrap';

export default function CPSettings() {
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

  const validateLink = (newValue) => {
    if (!newValue || isValidUrl(newValue)) {
      handleUpdate({ CalendlyLink: newValue });
      setError('');
    } else setError('Please enter a valid URL');
  };

  return (
    <>
      <div className="CPSettings">
        <TopNav userRole="provider" />

        <p>&nbsp;</p>

        {error && <div>{error}</div>}

        <div className="contentContainer utilityPage personalInfo">
          <Card>
            <Card.Body>
              <Card.Title>Settings</Card.Title>
              {error && <Alert variant="danger">{error}</Alert>}

              <EditableField
                title="Calendly Link"
                value={userData.CalendlyLink || ''}
                onChange={(newValue) => validateLink(newValue)}
              />
              <EditableField
                title="Google Reviews Link"
                value={userData.GoogleReviewsLink || ''}
                onChange={(newValue) => validateLink({ email: newValue })}
              />
              <div>Discord Integration (TBD)</div>
            </Card.Body>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
}
