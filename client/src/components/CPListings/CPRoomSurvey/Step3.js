import React, { useState } from 'react';
import { Button, Card, Form, Image} from 'react-bootstrap';
import { getStorage, ref, uploadBytes } from "firebase/storage";
import FileUpload from '../FileUpload';

export default function Step3({ roomInfo, setRoomInfo }) {
  const folderPath = `users/${roomInfo.LicenseNumber}`;
	const handleNewPics = (arrNewFiles) => {
    let roomPhotos = roomInfo?.roomPhotos ?? [];
    //FileUpload component returns an object with a path and name property. The line below converts the array of objects to an array of paths
    let arrNewFilePaths = arrNewFiles.map(file => file.path);
    roomPhotos.push(...arrNewFilePaths); 
    setRoomInfo({...roomInfo, roomPhotos: roomPhotos});
	}

  return (
    <>
      <Card className="claimProfileCard">

        <Card.Body>

          <Card.Title>Upload photo of room</Card.Title>
          <FileUpload controlId="roomPhotos" handleNewFiles={handleNewPics} folderPath={folderPath} uploadType="Photo" allowMultipleFiles={true} />    
          {roomInfo?.roomPhotos && roomInfo.roomPhotos.map((path, i) => (
                 <Image height="50px"src={path} key={i}/>
              ))}
        </Card.Body>

      </Card>

    </>

  );
};