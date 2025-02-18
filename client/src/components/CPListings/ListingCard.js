import React, { useState, useEffect } from 'react';
import { Button, Card, Image, Accordion } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import FileUpload from './FileUpload';
import ProviderQuestionaire from './ProviderQuestionaire';
import CostOfCare from './CostOfCare';
import HighlightedFeatures from './HighlightedFeatures';
import AssociatedCoCNotIncluded from './AssociatedCoCNotIncluded.js';

import MedicalQuestionaire from './MedicalQuestionaire';
import EnrollmentAdmissions from './EnrollmentAdmissions';
import RoomListings from './RoomListings';

import { firestore } from '../../firebase'; // Assuming you have firebase.js setup
import { getDoc, getDocs, collection, doc, setDoc } from 'firebase/firestore';
import { getStorage, ref, deleteObject } from 'firebase/storage';

import { useAuth } from '../../contexts/AuthContext';
import DynamicModal from '../DynamicModal';
import ViewProfile from '../ClientDashboard/ViewProfile.js';

export default function ListingCard({ userData, initialListingData }) {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [listingData, setListingData] = useState(initialListingData);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalBody, setModalBody] = useState('');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [roomsArr, setRoomsArr] = useState([]);

  const handleViewProfile = () => setShowProfileModal(true);
  const storage = getStorage();
  const providerForViewProfile = {
    FacilityName: listingData.facilityName,
    listingsData: listingData,
    roomsData: roomsArr,
    Speciality: listingData.speciality?.join(','),
    LicenseNumber: listingData.licenseNumber,
  };

  const { currentUser } = useAuth();
  const facilityPath = `users/${currentUser.uid}/listings/${listingData.licenseNumber}`;

  const folderPath = `users/${currentUser.uid}`;

  const handleNewPics = (arrNewFiles) => {
    let homePhotos = listingData?.homePhotos ?? [];
    //FileUpload component returns an object with a path and name property. The line below converts the array of objects to an array of paths
    let arrNewFilePaths = arrNewFiles.map((file) => file.path);
    homePhotos.push(...arrNewFilePaths);
    handleUpdate({ ...listingData, homePhotos: homePhotos });
  };

  const handleNewDocs = (arrNewFiles) => {
    let homeDocs = listingData?.homeDocs ?? [];
    homeDocs.push(...arrNewFiles);
    handleUpdate({ ...listingData, homeDocs: homeDocs });
  };

  const gotoHomeSurvey = () => {
    navigate('/home-survey', { state: { listingData, facilityPath } });
  };

  const handleUpdate = async (updatedListingData) => {
    try {
      const listingDocRef = doc(firestore, facilityPath);
      //since we aren't guaranteed to have an existing listingDocRef, we use setdoc to create/overwrite it
      //setdoc creates/overwrites any existing doc, so we need to pass in the entire update doc. updatedoc can be used to update just one field without modifying the rest of the doc
      await setDoc(listingDocRef, updatedListingData);
      console.log('Listing data updated successfully');

      // Re-fetch user data after update
      const updatedListingDocSnapshot = await getDoc(listingDocRef);
      if (updatedListingDocSnapshot.exists()) {
        const updatedUserData = updatedListingDocSnapshot.data();
        setListingData(updatedUserData);
        flashSavedMsg();
      } else {
        setError('Listing document not found after update');
      }
    } catch (error) {
      setError('Error updating listing data: ' + error.message);
    }
  };
  const alert = document.getElementById('savedMsg');
  const flashSavedMsg = () => {
    alert.classList.add('fade-out');
  };

  const showDocModal = (file) => {
    console.log('showing modal for file: ');
    console.log(file);

    setModalTitle(file.name);
    const body = (
      <>
        <iframe
          title={file.name}
          style={{ height: '70vh', width: '100%' }}
          src={file.path}
        ></iframe>
      </>
    );
    setModalBody(body);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const deleteDoc = (file) => {
    console.log('deleting file...' + file.name);
    const storageRef = ref(storage, file.path);
    deleteObject(storageRef)
      .then(() => {
        console.log('file deleted');
        let homeDocs = listingData?.homeDocs ?? [];
        let newHomeDocs = homeDocs.filter((f) => f.path !== file.path);
        handleUpdate({ ...listingData, homeDocs: newHomeDocs });
      })
      .catch((error) => {
        console.log('error deleting file: ');
        console.log(error);
      });
  };

  const deletePhoto = (filePath, propertyName) => {
    console.log('deleting photo...' + filePath);
    const storageRef = ref(storage, filePath);
    deleteObject(storageRef)
      .then(() => {
        console.log('file deleted');
        updateListing(filePath, propertyName);
      })
      .catch((error) => {
        console.log(error);
        if (error.toString().includes('(storage/object-not-found)'))
          updateListing(filePath, propertyName);
      });
  };

  const updateListing = (filePath, propertyName) => {
    let originalArr = listingData?.[propertyName] ?? [];
    let newArr = originalArr.filter((fPath) => fPath !== filePath);
    if (originalArr.length > newArr.length)
      //no need to update if nothing changed
      handleUpdate({ ...listingData, [propertyName]: newArr }).then(
        console.log('db reference deleted')
      );
  };

  useEffect(() => {
    fetchRoomData();
    // eslint-disable-next-line
  }, []);

  const fetchRoomData = async () => {
    const roomsSnapshot = await getDocs(
      collection(firestore, facilityPath, 'rooms')
    );
    //get data for all rooms for this listing
    const rooms = [];
    roomsSnapshot.forEach((room) => {
      const data = room.data();
      console.log(data);
      rooms.push(data);
    });
    console.log('roomsLength=' + rooms.length);
    setRoomsArr([...rooms]);
  };

  return (
    <>
      <div className="myAFHcard">
        <Card>
          <Card.Body>
            <Card.Title>
              <h2>My AFH:</h2>
            </Card.Title>
            <h2>{listingData.facilityName}</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="myAFHname">
              <div>License Number: {listingData.licenseNumber}</div>
              <div className="row">
                <div className="col-8">
                  AFH name: {listingData.facilityName}
                </div>
                <div className="col-4">
                  Year licensed: {listingData.licenseYear}
                </div>
              </div>
              <div>Home Location: {listingData.listingAddress}</div>
            </div>
            <hr />
            <div>
              <div className="mb-3">
                <h4>Upload home photos</h4>
                <FileUpload
                  controlId="homePhotos"
                  handleNewFiles={handleNewPics}
                  folderPath={folderPath}
                  uploadType="Photo"
                  allowMultipleFiles={true}
                />
              </div>
              <div className="row">
                {listingData?.homePhotos &&
                  listingData.homePhotos.map((path, i) => (
                    <div key={i} className="col-4">
                      <Image src={path} />
                      <Button
                        onClick={() => {
                          deletePhoto(path, 'homePhotos');
                        }}
                        className="text-danger"
                      >
                        X
                      </Button>
                    </div>
                  ))}
              </div>
            </div>
            <hr />
            <div className="mb-3">
              <Accordion>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Provider Questionaire</Accordion.Header>
                  <Accordion.Body>
                    <ProviderQuestionaire
                      listingInfo={listingData}
                      setListingInfo={setListingData}
                      handleUpdate={handleUpdate}
                    />
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                  <Accordion.Header>Estimated cost of care</Accordion.Header>
                  <Accordion.Body>
                    <CostOfCare
                      listingInfo={listingData}
                      setListingInfo={setListingData}
                      handleUpdate={handleUpdate}
                    />
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                  <Accordion.Header>Highlighted features</Accordion.Header>
                  <Accordion.Body>
                    <HighlightedFeatures
                      listingInfo={listingData}
                      setListingInfo={setListingData}
                      handleUpdate={handleUpdate}
                    />
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="3">
                  <Accordion.Header>
                    Associated cost of care not included
                  </Accordion.Header>
                  <Accordion.Body>
                    <AssociatedCoCNotIncluded
                      listingInfo={listingData}
                      setListingInfo={setListingData}
                      handleUpdate={handleUpdate}
                    />
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="4">
                  <Accordion.Header>Medical questionaire</Accordion.Header>
                  <Accordion.Body>
                    <MedicalQuestionaire
                      listingInfo={listingData}
                      setListingInfo={setListingData}
                      handleUpdate={handleUpdate}
                    />
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="5">
                  <Accordion.Header>Enrollment & admissions</Accordion.Header>
                  <Accordion.Body>
                    <EnrollmentAdmissions
                      listingInfo={listingData}
                      setListingInfo={setListingData}
                      handleUpdate={handleUpdate}
                    />
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="6">
                  <Accordion.Header>My listings</Accordion.Header>
                  <Accordion.Body>
                    <RoomListings
                      userData={userData}
                      listingData={listingData}
                      setListingInfo={setListingData}
                      facilityPath={facilityPath}
                    />
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </div>
            <div className="d-none">
              <h4>
                Upload facility contract, house rules, and other client facing
                documents
              </h4>
              <FileUpload
                controlId="homeDocs"
                handleNewFiles={handleNewDocs}
                folderPath={folderPath}
                uploadType="Document"
                allowMultipleFiles={true}
              />
              {listingData?.homeDocs &&
                listingData.homeDocs.map((file, i) => (
                  <div key={i}>
                    {/* eslint-disable-next-line*/}
                    <a
                      role="button"
                      onClick={() => {
                        showDocModal(file);
                      }}
                    >
                      {file.name}
                    </a>
                    <Button
                      onClick={() => {
                        deleteDoc(file);
                      }}
                      className="text-danger"
                    >
                      X
                    </Button>
                    <br></br>
                  </div>
                ))}
              <DynamicModal
                showModal={showModal}
                modalTitle={modalTitle}
                modalBody={modalBody}
                handleCloseModal={handleCloseModal}
              />
            </div>

            <Button className="text-xs" onClick={handleViewProfile}>
              View profile
            </Button>
          </Card.Body>
        </Card>

        {showProfileModal && (
          <ViewProfile
            provider={providerForViewProfile}
            showModal={showProfileModal}
            setShowModal={setShowProfileModal}
          />
        )}
      </div>
    </>
  );
}
