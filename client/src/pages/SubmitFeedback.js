import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase'; // Assuming you have firebase.js setup
import { useAuth } from '../contexts/AuthContext';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import TopNav from '../components/TopNav';
import Footer from '../components/Footer';
import { Card, Alert, Button } from 'react-bootstrap';

export default function SubmitFeedback() {
  const [userData, setUserData] = useState({});
  const { currentUser } = useAuth();
  const [error, setError] = useState('');
  const [justSaved, setJustSaved] = useState(false);

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

  const handleSave = () => {
    handleUpdate().then(() => {
      setJustSaved(true);
      console.log('success');
    });
  };

  return (
    <>
      <div className="CPSettings">
        <TopNav userRole="provider" />

        <p>&nbsp;</p>

        {error && <div>{error}</div>}

        <div className="contentContainer utilityPage text-center">
          <Card>
            <Card.Body>
              <Card.Title>
                <b>Submit feedback</b>
              </Card.Title>
              {error && <Alert variant="danger">{error}</Alert>}
              <div>
                <label className={'mb-2'}>
                  Help us better our services by providing some feedback, we
                  appreciate your input!
                </label>

                <textarea
                  required
                  className="small"
                  rows="5"
                  cols="50"
                  name="feedback"
                />
              </div>
              <div className={'d-inline-block mt-2'}>
                <Button disabled onClick={handleSave}>
                  TBD
                </Button>
                <Alert
                  show={justSaved}
                  onClose={() => setJustSaved(false)}
                  dismissible
                  variant={'success'}
                >
                  Feedback submitted!
                </Alert>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
}
