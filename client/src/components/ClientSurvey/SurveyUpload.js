import React from 'react';
import { Button, Container, Row, Col, Form } from 'react-bootstrap';
import { getStorage, ref, uploadBytes, deleteObject } from 'firebase/storage';
import { firestore } from '../../firebase';
import FileUpload from '../CPListings/FileUpload';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
/**
 * HIPAA COMPLIANCE NOTES: We originally were encrypting when taking in PDF assessments.
 * However, as Firestore is automatically encryting all data uploaded to its server,
 * per their policy here: https://cloud.google.com/firestore/docs/server-side-encryption ,
 * there is no need to redundantly encrypt that data, as our existing auth / access controls
 * provide security around who can access any personal health information -- which in this
 * case would be only the uploader and/or the CareFinder admin who is empowered to do so.
 * Ultimately, HIPAA compliance falls on CareFinder. If we need to expand this policy and/or
 * offer additional levels of encryption, see SurveyUpload-withEncryption.JS, which has
 * a good starting point leveraging node-forge. -JD
 */

const SurveyUpload = ({
  assessment,
  description,
  description2,
  onNext,
  onBack,
  currentQuestionIndex,
  totalQuestions,
  isVideo,
  question,
}) => {
  const { currentUser } = useAuth();
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState({});
  const [assessmentName, setAssessmentName] = useState('');
  useEffect(() => {
    const fetchData = async () => {
      const userDocRef = doc(firestore, 'users', currentUser.uid);
      const userDocSnapshot = await getDoc(userDocRef);
      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        console.log(userData);
        setUserData(userData);
      } else {
        console.error('User document not found');
      }
    };
    fetchData();
    // eslint-disable-next-line
  }, []);
  const handleNext = () => {
    onNext();
  };

  const handleBack = () => {
    onBack();
  };

  const storage = getStorage();

  const handleUpdate = async (updatedUserData) => {
    try {
      await axios.post(`${process.env.REACT_APP_ENDPOINT}/updateUserData`, {
        updatedUserData,
        currentUser,
      });
      console.log('User data updated successfully');
      // Re-fetch user data after update
    } catch (error) {
      console.error('Error updating user data:', error);
      setError(
        'There was an error uploading your assessment. Please try again.'
      );
    }
  };

  const handleNewProfilePic = (newFile) => {
    const oldFilePath = userData.AssessmentPath;
    setAssessmentName(newFile[0]?.name);
    handleUpdate({ AssessmentPath: newFile[0]?.path }).then(() => {
      deleteFile(oldFilePath);
    });
  };

  const handleNewVideo = (newFile) => {
    const oldFilePath = userData.VideoPath;
    setAssessmentName(newFile[0]?.name);
    handleUpdate({ VideoPath: newFile[0]?.path }).then(() => {
      deleteFile(oldFilePath);
    });
  };

  const folderPath = `users/${userData.userId}`;

  const deleteFile = (filePath) => {
    if (!filePath) return;
    console.log('deleting file...');
    const storageRef = ref(storage, filePath);
    deleteObject(storageRef)
      .then(() => {
        console.log('file deleted');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  console.log('RADIO HANDLING!');
  console.log('assessment: ' + assessment);
  const progressPercentage =
    ((currentQuestionIndex + 1) / totalQuestions) * 100;

  return (
    <>
      {assessment === 'Yes' || isVideo ? (
        <div className="text-center items-center h-full max-w-[50rem] mx-auto flex flex-col justify-center">
          <h2>{question}</h2>
          <p className="max-w-[45rem] mx-auto text-left">{description}</p>
          <p className="max-w-[45rem] mx-auto text-left mb-10">
            {description2}
          </p>
          <FileUpload
            controlId={isVideo ? 'videoUpload' : 'profilePhotoUpload'}
            handleNewFiles={isVideo ? handleNewVideo : handleNewProfilePic}
            folderPath={folderPath}
            uploadType={isVideo ? 'Video' : 'Document'}
          />
          {error && <p className="text-red-500">{error}</p>}
          {assessmentName && (
            <p className=" mt-4 text-left text-white">
              {assessmentName} uploaded successfully!
            </p>
          )}
        </div>
      ) : (
        <div className="text-center items-center h-[100vh] max-w-[50rem] mx-auto flex flex-col justify-center">
          <h2 className="mt-4">Schedule virtual assessment</h2>
          <p className="max-w-[45rem] mx-auto text-left mb-10">
            Please select a day and time that you and your senior are able to be
            in the same room and conduct a 45 minute assessment via google
            meets. Assessments are conducted by a washington state registered
            nurse.
          </p>
          <iframe
            title="Calendly Scheduler"
            src="https://calendly.com/carefinderwa/30min"
            style={{ width: '50%', height: '50rem', border: '0' }}
            scrolling="no"
          ></iframe>
        </div>
      )}
      <div className="w-full h-2 bg-gray-200 fixed bottom-0 left-0 rounded mb-20">
        <div
          className="h-full bg-pink-500 transition-all duration-300 rounded"
          style={{ width: `${progressPercentage}%` }}
        ></div>
        <div className="d-flex justify-content-between mx-20 my-4">
          <Button variant="secondary" className="px-2" onClick={handleBack}>
            Back
          </Button>
          <Button variant="primary" className="px-2" onClick={handleNext}>
            Next
          </Button>
        </div>
      </div>
    </>
  );
};

export default SurveyUpload;
