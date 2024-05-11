import React, { useState , useEffect} from 'react';
import { Button, Card, Image} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import EditableField from '../menu/EditableField';
import RoomCard from './RoomCard';
import FileUpload from './FileUpload';

import { firestore } from '../../firebase'; // Assuming you have firebase.js setup
import { getDoc, getDocs, collection, doc, setDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from "../../contexts/AuthContext";

export default function ListingCard({userData, initialListingData}) {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [roomsArr, setRoomsArr] = useState([]);
  const [listingData, setListingData] = useState(initialListingData);

  const { currentUser } = useAuth();
  const facilityPath = `users/${currentUser.uid}/listings/${listingData.licenseNumber}`;
  
  useEffect(() => {
    fetchRoomData();
  }, []);

  const fetchRoomData = async () => {
    const roomsSnapshot = await getDocs(collection(firestore, facilityPath, 'rooms'));
      //get data for all rooms for this listing
      const rooms = [];
      roomsSnapshot.forEach((room) => {
        const data = room.data();
        console.log(data);
        rooms.push(data);
     });
      console.log("roomsLength=" + rooms.length);
      setRoomsArr([...rooms]);
  };

  const folderPath = `users/${currentUser.uid}`;
	const handleNewPics = (arrNewFilePaths) => {
		let homePhotos = listingData?.homePhotos ?? [];
    homePhotos.push(...arrNewFilePaths); 
    handleUpdate({...listingData, homePhotos: homePhotos});
	}

  const gotoHomeSurvey = () => {
	navigate('/home-survey', {state: {listingData, facilityPath}});
  }

  const addRoom = () => {
    const roomNumber =roomsArr.length + 1;
    const roomData = {roomName: "Room # " + roomNumber, roomId: "Room" + roomNumber};
	  navigate('/room-survey', {state: {userData, roomData, listingData, facilityPath }});
  }

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
      } else {
        setError('Listing document not found after update');
      }
    } catch (error) {
      setError('Error updating listing data: ' + error.message);
    }
  };

  const handleRoomUpdate = async (updatedRoomInfo, roomId) => {
    try {
      const roomDocRef = doc(firestore, facilityPath, 'rooms', roomId);
      await updateDoc(roomDocRef, updatedRoomInfo);
      console.log('Room data updated successfully');

      await fetchRoomData();
    } catch (error) {
      setError('Error updating user data: ' + error.message);
    }
  };


  
  return (

    <>
      
      <Card>
      <Card.Body>
        <Card.Title><h1>My AFH</h1></Card.Title>
		<div className="myAFHname">
			<h4>{listingData.facilityName}</h4>
			<EditableField title="Adult Family Home Name" value={listingData.facilityName || ''} onChange={(newValue) => handleUpdate({...listingData, facilityName: newValue })} />
		</div>
		<hr/>
		<div>
			<h4>Upload home photos</h4>
			<p>Upload in the following order<br/>
				1.Exterior front of house. 2. Interior common area. 3. Interior common area.<br/>
				Upload up to 20 photos. DO NOT POST ROOM PHOTOS here. :)
			</p>
			<FileUpload controlId="homePhotos" handleNewFilePaths={handleNewPics} folderPath={folderPath} uploadType="Photo" allowMultipleFiles={true} />    
          {listingData?.homePhotos && listingData.homePhotos.map((path, i) => (
                 <Image height="50px"src={path} key={i}/>
              ))}
		</div>
		<hr/>
		<div>
			<h4>Complete home survey</h4>
			<Button onClick={gotoHomeSurvey}>Take survey</Button>
		</div>
		<hr/>
		<div>
			<h1>{listingData.facilityName}</h1>
			<div className="ml-auto" role="button" onClick={addRoom}>
				<img src="circleplus.png"/>
				<p>Add room</p>
			</div>
			{roomsArr.map((roomData, i) => <RoomCard userData={userData} roomData={roomData}  listingData={listingData} facilityPath={facilityPath} handleRoomUpdate={handleRoomUpdate} key={i}/>)}
		</div>
        
      </Card.Body>
      </Card>
    </>

  );
}