import React, { useState } from 'react';
import { Button, Card, Image } from 'react-bootstrap';
import FileUpload from './FileUpload';
import EditableField from '../menu/EditableField';

export default function Profile({ userData, handleUpdate}) {
	const folderPath = `users/${userData.LicenseNumber}`;
	const handleNewProfilePic = (newFilePath) => {
		handleUpdate({profilePicPath: newFilePath[0]});
	}
	const handleNewProfileVid = (newFilePath) => {
		handleUpdate({profileVidPath: newFilePath[0]});
	}

  return (

    <>
       
      <Card	>
      <Card.Body>
        <Card.Title><h2>Profile</h2></Card.Title>
        <FileUpload controlId="profilePhotoUpload" handleNewFilePaths={handleNewProfilePic} folderPath={folderPath} uploadLabel="Upload profile photo (Headshot)" uploadType="Photo" />
		{userData.profilePicPath && <Image height="150px"src={userData.profilePicPath}/>}
		<hr/>
		<FileUpload controlId="profileVidUpload" handleNewFilePaths={handleNewProfileVid} uploadLabel="Upload introduction video" uploadType="Video"/>
		{userData.profileVidPath && 
			<video height="150px" controls>
				<source src={userData.profileVidPath}/>
			</video>}
		<EditableField title="Calendly Link" value={userData.CalendlyLink || ''} onChange={(newValue) => handleUpdate({ CalendlyLink: newValue })} />

      </Card.Body>
      </Card>
    </>

  );
}