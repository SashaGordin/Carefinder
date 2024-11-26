import React, { useState, useEffect } from 'react';
import { Row, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import RoomCard from './RoomCard';
import { firestore } from '../../firebase'; // Assuming you have firebase.js setup
import { getDoc, getDocs, collection, doc, setDoc, updateDoc } from 'firebase/firestore';

export default function RoomListings({ userData, listingData, facilityPath }) {
	const [roomsArr, setRoomsArr] = useState([]);
	const navigate = useNavigate();
	const [error, setError] = useState('');
	useEffect(() => {
		fetchRoomData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
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

	const addRoom = () => {
		const roomNumber = roomsArr.length + 1;
		const roomData = { roomName: "Room # " + roomNumber, roomId: "Room" + roomNumber };
		navigate('/edit-room', { state: { userData, roomData, listingData, facilityPath } });
	}
	return (

		<>
			<div>
				<div className="d-flex justify-content-between">
					<h4>{listingData.facilityName}</h4>
					<Button className="ml-auto" onClick={addRoom}>
						<div className="d-flex align-items-center">
							<img alt="" src="circleplus.png" /><div>Add room</div>
						</div>
					</Button>
				</div>
				{roomsArr.map((roomData, i) => <RoomCard userData={userData} roomData={roomData} listingData={listingData} facilityPath={facilityPath} handleRoomUpdate={handleRoomUpdate} key={i} />)}
			</div >
		</>

	);
}
