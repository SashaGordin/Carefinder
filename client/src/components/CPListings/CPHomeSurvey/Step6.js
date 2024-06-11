import React, { useState } from 'react';
import { Button, Card, Form, Image} from 'react-bootstrap';
import { getStorage, ref, uploadBytes } from "firebase/storage";
import FileUpload from '../FileUpload';

export default function Step6({ listingInfo, setListingInfo }) {
  const folderPath = `users/${listingInfo.LicenseNumber}`;
	const handleNewPics = (arrNewFiles) => {
		let petPics = listingInfo?.petPics ?? [];
    petPics.push(...arrNewFiles); 
    setListingInfo({...listingInfo, petPics: petPics});
	}

  return (
    <>
      <Card className="claimProfileCard">

        <Card.Body>

          <Card.Title>Upload photo of house pet</Card.Title>
          <FileUpload controlId="petPhotos" handleNewFiles={handleNewPics} folderPath={folderPath} uploadType="Photo" allowMultipleFiles={true} />    
          {listingInfo?.petPics && listingInfo.petPics.map((pic) => (
                 <Image height="50px"src={pic.path}/>
              ))}
        </Card.Body>

      </Card>

    </>

  );
};