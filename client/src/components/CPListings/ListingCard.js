import React, { useState , useEffect} from 'react';
import { Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import EditableField from '../menu/EditableField';
import RoomCard from './RoomCard';
import { firestore } from '../../firebase'; // Assuming you have firebase.js setup
import { getDoc, getDocs, collection, doc, setDoc } from 'firebase/firestore';
import { useAuth } from "../../contexts/AuthContext";

export default function ListingCard({ initialListingData}) {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [roomsArr, setRoomsArr] = useState([]);
  const [listingData, setListingData] = useState(initialListingData);

  const { currentUser } = useAuth();
  const facilityPath = `users/${currentUser.uid}/listings/${listingData.facilityName}`;
  
  useEffect(() => {
    const fetchData = async () => {
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
    fetchData();
  }, []);




  const gotoHomeSurvey = () => {
	navigate('/home-survey', {state: {listingData}});
  }

  const addRoom = () => {
    const roomData = {roomName: "Room # " + roomsArr.length};
	  navigate('/room-survey', {state: {roomData, facilityPath }});
  }

  const handleUpdate = async (updatedListingData) => {
    try {
      const listingDocRef = doc(firestore, facilityPath);
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

  
  return (

    <>
      
      <Card>
      <Card.Body>
        <Card.Title><h1>My AFH</h1></Card.Title>
		<div className="myAFHname">
			<h4>{listingData.facilityName}</h4>
			<EditableField title="Adult Family Home Name" value={listingData.facilityName || ''} onChange={(newValue) => handleUpdate({ facilityName: newValue })} />
		</div>
		<hr/>
		<div>
			<h4>Upload home photos</h4>
			<p>Upload in the following order<br/>
				1.Exterior front of house. 2. Interior common area. 3. Interior common area.<br/>
				Upload up to 20 photos. DO NOT POST ROOM PHOTOS here. :)
			</p>
			{/* insert photo gallery component here*/}
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
			{roomsArr.map((roomData, i) => <RoomCard roomData={roomData} key={i}/>)}
		</div>
        
      </Card.Body>
      </Card>
    </>

  );
}