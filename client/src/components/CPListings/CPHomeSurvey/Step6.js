import React from 'react';
import { Button, Card, Image } from 'react-bootstrap';
import { getStorage, ref, deleteObject } from "firebase/storage";
import FileUpload from '../FileUpload';

export default function Step6({ listingInfo, setListingInfo }) {
  const storage = getStorage();
  //folder path should be userid not license number. This file is deprecated so ignore for now
  const folderPath = `users/${listingInfo.LicenseNumber}`; 
	const handleNewPics = (arrNewFiles) => {
		let petPics = listingInfo?.petPics ?? [];
    petPics.push(...arrNewFiles);
    setListingInfo({...listingInfo, petPics: petPics});
	}

  const deleteFile = (file, propertyName) => {
    console.log('deleting file...' + file.name);
    const storageRef = ref(storage, file.path);
    deleteObject(storageRef).then(() => {
      console.log("file deleted");
      removeFileFromListing(file, propertyName);
    }).catch((error) => {
      console.log(error);
      if (error.toString().includes("(storage/object-not-found)"))
        removeFileFromListing(file, propertyName);
    });
  }
//where file is an object like {name: 'name', path: 'path'}
  const removeFileFromListing = (file, propertyName) => {
    let originalArr = listingInfo?.[propertyName] ?? [];
    let newArr = originalArr.filter((f) => f.path !== file.path);
    if (originalArr.length > newArr.length) //no need to update if nothing changed
      setListingInfo({ ...listingInfo, [propertyName]: newArr });
  }

  return (
    <>
      <Card className="claimProfileCard">

        <Card.Body>

          <Card.Title>Upload photo of house pet</Card.Title>
          <FileUpload controlId="petPhotos" handleNewFiles={handleNewPics} folderPath={folderPath} uploadType="Photo" allowMultipleFiles={true} />
          {listingInfo?.petPics && listingInfo.petPics.map((pic, i) => (
                 <div  key={i}><Image height="50px" src={pic.path} />
                 <Button onClick={() => { deleteFile(pic, "petPics") }} className="text-danger">X</Button>
                 </div>
              ))}
        </Card.Body>

      </Card>

    </>

  );
};