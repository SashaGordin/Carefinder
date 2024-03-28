import React, { useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import EditableField from '../menu/EditableField';
import RoomCard from './RoomCard';

export default function ListingCard({ userData, handleUpdate}) {
  const navigate = useNavigate();
  const rooms = [{RoomName:"Room #1"},{RoomName: "Room #2"}];

  const gotoHomeSurvey = () => {
    //TODO: change name from edit-listing to homesurvey or something like that
	navigate('/edit-listing', {state: {userData}});
  }

  const addRoom = () => {
	alert("TBD");
	return;
	//TODO
  }

  const previewListing = () => {
	alert("TBD");
	return;
	//TODO
  }

  const postListing = () => {
	alert("TBD");
	return;
	//TODO
  }
  
  return (

    <>
      
      <Card>
      <Card.Body>
        <Card.Title><h1>My AFH</h1></Card.Title>
		<div>
			<h4>{userData.FacilityName}</h4>
			<EditableField title="Business Name" value={userData.FacilityName || ''} onChange={(newValue) => handleUpdate({ FacilityName: newValue })} />
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
			<h1>{userData.FacilityName}</h1>
			<div className="ml-auto" onClick={addRoom}>
				<img src="circleplus.png"/>
				<p>Add room</p>
			</div>
			{rooms.map((roomData, i) => <RoomCard roomData={roomData} key={i}/>)}
		</div>
		<div>
		<Button onClick={previewListing}>Preview Listing</Button>
		<Button onClick={postListing}>Post listing</Button>
		</div>
        
      </Card.Body>
      </Card>
    </>

  );
}