import React from 'react';
import { Button, Card, Image } from 'react-bootstrap';
import { getStorage, ref, deleteObject } from 'firebase/storage';
import FileUpload from '../FileUpload';

export default function Step3({ roomInfo, setRoomInfo }) {
  const storage = getStorage();
  //folder path should be userid not license number. This file is deprecated so ignore for now
  const folderPath = `users/${roomInfo.LicenseNumber}`;
  const handleNewPics = (arrNewFiles) => {
    let roomPhotos = roomInfo?.roomPhotos ?? [];
    //FileUpload component returns an object with a path and name property. The line below converts the array of objects to an array of paths
    let arrNewFilePaths = arrNewFiles.map((file) => file.path);
    roomPhotos.push(...arrNewFilePaths);
    setRoomInfo({ ...roomInfo, roomPhotos: roomPhotos });
  };

  const deletePhoto = (filePath, propertyName) => {
    console.log('deleting photo...' + filePath);
    const storageRef = ref(storage, filePath);
    deleteObject(storageRef)
      .then(() => {
        console.log('file deleted');
        updateRoom(filePath, propertyName);
      })
      .catch((error) => {
        console.log(error);
        if (error.toString().includes('(storage/object-not-found)'))
          updateRoom(filePath, propertyName);
      });
  };

  const updateRoom = (filePath, propertyName) => {
    let originalArr = roomInfo?.[propertyName] ?? [];
    let newArr = originalArr.filter((fPath) => fPath !== filePath);
    if (originalArr.length > newArr.length)
      //no need to update if nothing changed
      setRoomInfo({ ...roomInfo, [propertyName]: newArr });
  };

  return (
    <>
      <Card className="claimProfileCard">
        <Card.Body>
          <Card.Title>Upload photo of room</Card.Title>
          <FileUpload
            controlId="roomPhotos"
            handleNewFiles={handleNewPics}
            folderPath={folderPath}
            uploadType="Photo"
            allowMultipleFiles={true}
          />
          {roomInfo?.roomPhotos &&
            roomInfo.roomPhotos.map((path, i) => (
              <div key={i}>
                <Image height="50px" src={path} />
                <Button
                  onClick={() => {
                    deletePhoto(path, 'roomPhotos');
                  }}
                  className="text-danger"
                >
                  X
                </Button>
              </div>
            ))}
        </Card.Body>
      </Card>
    </>
  );
}
