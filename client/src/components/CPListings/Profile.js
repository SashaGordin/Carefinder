import React, { useState } from 'react';
import { Button, Card, Image } from 'react-bootstrap';
import FileUpload from './FileUpload';

export default function Profile({ userData, handleUpdate}) {
	const folderPath = `users/${userData.LicenseNumber}`;
	const handleNewProfilePic = (newFilePath) => {
		handleUpdate({profilePicPath: newFilePath});
	}
	const handleNewProfileVid = (newFilePath) => {
		handleUpdate({profileVidPath: newFilePath});
	}

  return (

    <>
       
      <Card	>
      <Card.Body>
        <Card.Title><h2>Profile</h2></Card.Title>
        <FileUpload controlId="profilePhotoUpload" handleNewFilePath={handleNewProfilePic} folderPath={folderPath} uploadLabel="Upload profile photo (Headshot)" uploadType="Photo" />
		{userData.profilePicPath && <Image height="150px"src={userData.profilePicPath}/>}
		<hr/>
		<FileUpload controlId="profileVidUpload" handleNewFilePath={handleNewProfileVid} uploadLabel="Upload introduction video" uploadType="Video"/>
		{userData.profileVidPath && 
			<video height="150px" controls>
				<source src={userData.profileVidPath}/>
			</video>}
      </Card.Body>
      </Card>
    </>

  );
}