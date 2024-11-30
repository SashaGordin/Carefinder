import React, { useState } from 'react';
import { firestore } from '../firebase'; // Assuming you have firebase.js setup
import { getDoc, doc, setDoc } from 'firebase/firestore';
import FileUpload from '../components/CPListings/FileUpload';
import { getStorage, ref, deleteObject } from "firebase/storage";

import { useNavigate, useLocation } from "react-router-dom";
import { Button, Alert, Card, Row, Col, Form, Image } from 'react-bootstrap';


import TopNav from "../components/TopNav";
import Footer from "../components/Footer";


export default function CPRoomEdit() {
  const navigate = useNavigate();
  const location = useLocation();
  const storage = getStorage();

  const { state } = location;
  const { userData, roomData, listingData, facilityPath } = state || {};
  const startStep = 1; //for debugging.. should be 1 normally
  const [currentStep, setCurrentStep] = useState(startStep);
  const [roomInfo, setRoomInfo] = useState(roomData);
  const [error, setError] = useState('');
  const roomTypes = ["", "Private room", "Private room, private half bathroom", "Private room, private full bathroom",
    "Private room, shared community bathroom", "Private room, shared full bathroom", "Shared room, community bathroom",
    "Shared room, shared half bathroom", "Shared room, shared full bathroom"];
  const roomFeatures = ["Room on secondary floor", "Room near night staff", "Room has pleasant view", "Room has door to outside",
    "Room has regular doors", "Room has larger doors"];
  const roomSizes = [
    { name: "Standard", attr: ["10x10 ft", "110 sq ft", "Fits standard bed and essential personal items"] },
    { name: "Medium", attr: ["10x12 ft", "120-140 sq ft", "Allows comfortable movement and additional furniture"] },
    { name: "Large", attr: ["11x13 ft", "140-160 sq ft", "Provides ample space for personalization"] },
    { name: "Premium/Master", attr: ["12x14 ft", "160-200 sq ft", "Luxury living "] }
  ];

  const folderPath = `${facilityPath}/${userData.userId}`;
  const handleNewPics = (arrNewFiles) => {
    let roomPhotos = roomInfo?.roomPhotos ?? [];
    //FileUpload component returns an object with a path and name property. The line below converts the array of objects to an array of paths
    let arrNewFilePaths = arrNewFiles.map(file => file.path);
    roomPhotos.push(...arrNewFilePaths);
    setRoomInfo({ ...roomInfo, roomPhotos: roomPhotos });
  }

  const handleChange = (e) => {
    let val;
    let name = e.target.name;
    if (e.target.type == "checkbox") {
      val = [];
      document.querySelectorAll(`[name='${name}']:checked`).forEach((t) => {
        val.push(parseInt(t.value)); //index into the array of options (i.e. licenseOptions)
      });
    }
    else
      val = e.target.value;

    setRoomInfo({
      ...roomInfo,
      [name]: val
    });
  }

  const validateInputs = () => {
    let inputElements = document.querySelectorAll("input, textarea");
    let allValid = true;
    for (let el of inputElements)
      allValid &= el.reportValidity();
    return allValid;
  }

  const handleSubmit = () => {
    if (validateInputs()) {
      handleUpdate({ ...roomInfo}).then(() => {
        goToListings();
      });
    }
  }
  const handleUpdate = async (updatedRoomInfo) => {
    try {
      const roomDocRef = doc(firestore, facilityPath, 'rooms', roomInfo.roomId);
      await setDoc(roomDocRef, updatedRoomInfo);
      console.log('Room data updated successfully');

      // Re-fetch user data after update
      const updatedRoomDocSnapshot = await getDoc(roomDocRef);
      if (updatedRoomDocSnapshot.exists()) {
        const updatedRoomData = updatedRoomDocSnapshot.data();
        setRoomInfo(updatedRoomData);
      } else {
        setError('Room document not found after update');
      }
    } catch (error) {
      setError('Error updating room data: ' + error.message);
    }
  };
  const deletePhoto = (filePath, propertyName) => {
    console.log('deleting photo...' + filePath);
    const storageRef = ref(storage, filePath);
    deleteObject(storageRef).then(() => {
      console.log("file deleted");
      updateRoom(filePath, propertyName);
    }).catch((error) => {
      console.log(error);
      if (error.toString().includes("(storage/object-not-found)"))
        updateRoom(filePath, propertyName);
    });
  }

  const updateRoom = (filePath, propertyName) => {
    let originalArr = roomInfo?.[propertyName] ?? [];
    let newArr = originalArr.filter((fPath) => fPath !== filePath);
    if (originalArr.length > newArr.length) //no need to update if nothing changed
      setRoomInfo({ ...roomInfo, [propertyName]: newArr });
  }



  const goToListings = () => {
    navigate("/your-listings");
  }





  return (
    <>
      <TopNav />
      <div className="contentContainer utilityPage">
        {error && <Alert variant="danger">{error}</Alert>}
        <Card	>
          <Card.Body>
            <Card.Title><h2>Room listing</h2></Card.Title>
            <Row>
              <Col>
                <FileUpload controlId="roomPhotoUpload" handleNewFiles={handleNewPics} folderPath={folderPath} allowMultipleFiles={true} uploadLabel="Upload photos of room" uploadType="Photo" />
                <div>
                  <label >What is the cost of rent? (Not care)</label>
                  <input type="text" required placeholder="Enter price" name="rentCost" value={roomInfo.rentCost ?? ""} onChange={handleChange} />
                </div>
                <div>
                  <label>Which of these apply to this room?</label>
                  <Form.Select name='roomType' value={roomInfo.roomType ?? ""} onChange={handleChange}>
                    {
                      roomTypes.map((option, i) => {
                        return <option key={i} value={option} >{option}</option>
                      })
                    }
                  </Form.Select>
                </div>
                <div>
                  <label>Do any of these apply?</label>
                  {roomFeatures.map((option, i) => (
                    <Form.Check
                      name='features'
                      key={i}
                      type='checkbox'
                      value={i}
                      label={option}
                      checked={roomInfo.features?.includes(i) ?? false}
                      onChange={handleChange}
                    />
                  ))}
                </div>
                <div>
                  <label>Size of room</label>
                  <Form.Select name="sizeId" value={roomInfo.sizeId ?? 0} onChange={handleChange} >
                    {
                      roomSizes.map((size, i) => {
                        return <option key={i} className="small" value={i} >{size.name}</option>
                      })
                    }
                  </Form.Select></div>
                <ul>
                  {roomSizes[roomInfo.sizeId ?? 0].attr.map((attr, i) => { return <li key={i}>{attr}</li> })}
                </ul>
                <div>
                  <label>Would you accept medicaid for this room?</label>
                  <Form.Select name="medicaidAccepted" value={roomInfo.medicaidAccepted ?? "N"} onChange={handleChange} >
                    <option value="Y">Yes</option>
                    <option value="C">Yes, but with co-pay agreement</option>
                    <option value="M">Maybe</option>
                    <option value="N">No</option>
                  </Form.Select></div>
              </Col>
              <Col>
                {roomInfo?.roomPhotos && roomInfo.roomPhotos.map((path, i) => (
                  <div key={i}><Image src={path} />
                    <Button onClick={() => { deletePhoto(path, 'homePhotos') }} className="text-danger">X</Button>
                  </div>
                ))}
              </Col>
            </Row>

            <div className="text-danger">{error}</div>

            
          </Card.Body>
          <div className="d-flex justify-content-between">
              <Button onClick={goToListings}>Cancel</Button>
              <Button onClick={handleSubmit}>Save</Button>
            </div>
        </Card>
      </div>
      <Footer />
    </>
  )
};