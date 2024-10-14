import React, { useState, useEffect } from 'react';
import { getStorage, ref, deleteObject } from "firebase/storage";
import { Card, Image, Alert, Row, Col, Button } from 'react-bootstrap';
import FileUpload from './FileUpload';
import EditableField from '../menu/EditableField';
import { useNavigate, useLocation } from "react-router-dom";




const PersonalInfoPage = ({ userData, handleUpdate }) => {
  // const { currentUser } = useAuth()
  const [error, setError] = useState('');
  const folderPath = `users/${userData.LicenseNumber}`;
  const storage = getStorage();
  const navigate = useNavigate();

  const handleNewProfilePic = (newFile) => {
    const oldFilePath = userData.profilePicPath;
    handleUpdate({ profilePicPath: newFile[0]?.path }).then(() => {
      deleteFile(oldFilePath);
    });
  }
  const handleNewProfileVid = (newFile) => {
    const oldFilePath = userData.profileVidPath;
    handleUpdate({ profileVidPath: newFile[0]?.path }).then(() => {
      deleteFile(oldFilePath);
    });
  }

  const deleteFile = (filePath) => {
    if (!filePath)
      return;
    console.log('deleting file...');
    const storageRef = ref(storage, filePath);
    deleteObject(storageRef).then(() => {
      console.log("file deleted");
    }).catch((error) => {
      console.log(error);
    });
  }

  const validateLink = (newValue) => {
    if (!newValue || isValidUrl(newValue)) {
      handleUpdate({ CalendlyLink: newValue })
      setError('');
    }
    else
      setError('Please enter a valid URL')
  }
  const isValidUrl = urlString => {
    var urlPattern = new RegExp('^(https?:\\/\\/)?' + // validate protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // validate domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // validate OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // validate port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // validate query string
      '(\\#[-a-z\\d_]*)?$', 'i'); // validate fragment locator
    return !!urlPattern.test(urlString);
  }

  const selectGreeting = () => {
    navigate('/provider-greeting', { state: { userData } });
  }

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
            <Row>
              <Col>
                <EditableField title="Provider Name (As is on license)" value={userData.FacilityPOC || ''} onChange={(newValue) => handleUpdate({ FacilityPOC: newValue })} />
                <FileUpload controlId="profilePhotoUpload" handleNewFiles={handleNewProfilePic} folderPath={folderPath} uploadLabel="Profile photo (Headshot)" uploadType="Photo" />
                <FileUpload controlId="profileVidUpload" handleNewFiles={handleNewProfileVid} uploadLabel="Video introduction" uploadType="Video" />
                <EditableField title="Email Address" value={userData.email || ''} onChange={(newValue) => handleUpdate({ email: newValue })} />
                <EditableField title="Phone Number" value={userData.TelephoneNmbr || ''} onChange={(newValue) => handleUpdate({ TelephoneNmbr: newValue })} />
                <EditableField title="Calendly Link" value={userData.CalendlyLink || ''} onChange={(newValue) => validateLink(newValue)} />
              </Col>
              <Col>
                {userData.profilePicPath && <Image style={{ height: '150px' }} src={userData.profilePicPath} />}
                {userData.profileVidPath &&
                  <video style={{ height: '150px' }} src={userData.profileVidPath} controls></video>}
              </Col>
            </Row>
            <div>
              <div>Select greeting</div>
              <Button onClick={selectGreeting}>Select</Button>
            </div>
          </Card.Body>
        </Card>
      </div >

      {/*}
      <Footer />
    {*/}

    </>
  );
};

export default PersonalInfoPage;