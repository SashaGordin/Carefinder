import React, { useState, useEffect } from 'react';
import { getStorage, ref, deleteObject } from 'firebase/storage';
import { Card, Image, Alert, Row, Col, Button } from 'react-bootstrap';
import FileUpload from './FileUpload';
import { useNavigate, useLocation } from 'react-router-dom';
import EditableField from '../menu/EditableField';

const PersonalInfoPage = ({ userData, handleUpdate }) => {
  const [error, setError] = useState('');
  const folderPath = `users/${userData.userId}`;
  const storage = getStorage();
  const navigate = useNavigate();

  const handleNewProfilePic = (newFile) => {
    const oldFilePath = userData.profilePicPath;
    handleUpdate({ profilePicPath: newFile[0]?.path }).then(() => {
      deleteFile(oldFilePath);
    });
  };
  const handleNewProfileVid = (newFile) => {
    const oldFilePath = userData.profileVidPath;
    handleUpdate({ profileVidPath: newFile[0]?.path }).then(() => {
      deleteFile(oldFilePath);
    });
  };

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

  const selectGreeting = () => {
    navigate('/provider-greeting', { state: { userData } });
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
            <Row>
              <Col>
                <EditableField
                  title="Provider Name (as is on license)"
                  value={userData.FacilityPOC || ''}
                  onChange={(newValue) =>
                    handleUpdate({ FacilityPOC: newValue })
                  }
                />
                <FileUpload
                  controlId="profilePhotoUpload"
                  handleNewFiles={handleNewProfilePic}
                  folderPath={folderPath}
                  uploadLabel="Profile photo (Headshot)"
                  uploadType="Photo"
                />
                <FileUpload
                  controlId="profileVidUpload"
                  handleNewFiles={handleNewProfileVid}
                  uploadLabel="Video introduction"
                  uploadType="Video"
                />
                <EditableField
                  title="Email Address"
                  value={userData.email || ''}
                  onChange={(newValue) => handleUpdate({ email: newValue })}
                />
                <EditableField
                  title="Phone Number"
                  value={userData.TelephoneNmbr || ''}
                  onChange={(newValue) =>
                    handleUpdate({ TelephoneNmbr: newValue })
                  }
                />
              </Col>
              <Col>
                {userData.profilePicPath && (
                  <Image
                    style={{ height: '150px' }}
                    src={userData.profilePicPath}
                  />
                )}
                {userData.profileVidPath && (
                  <video
                    style={{ height: '150px' }}
                    src={userData.profileVidPath}
                    controls
                  ></video>
                )}
              </Col>
            </Row>
            <div>
              <div>Select greeting</div>
              <Button onClick={selectGreeting}>Select</Button>
            </div>
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
