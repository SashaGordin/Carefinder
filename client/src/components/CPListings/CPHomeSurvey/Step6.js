import React, { useState } from 'react';
import { Button, Card, Form, Image} from 'react-bootstrap';
import { getStorage, ref, uploadBytes } from "firebase/storage";
import FileUpload from '../FileUpload';

export default function Step6({ listingInfo, setListingInfo }) {
  const folderPath = `users/${listingInfo.LicenseNumber}`;
	const handleNewPics = (arrNewFilePaths) => {
		let petPics = listingInfo?.petPics ?? [];
    petPics.push(...arrNewFilePaths); 
    setListingInfo({...listingInfo, petPics: petPics});
	}

  return (
    <>
      <Card className="claimProfileCard">

        <Card.Body>

          <Card.Title>Upload photo of house pet</Card.Title>
          <FileUpload controlId="petPhotos" handleNewFilePaths={handleNewPics} folderPath={folderPath} uploadType="Photo" allowMultipleFiles={true} />    
          {listingInfo?.petPics && listingInfo.petPics.map((path) => (
                 <Image height="50px"src={path}/>
              ))}
        </Card.Body>

      </Card>

    </>

  );
};