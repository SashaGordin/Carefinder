import React, { useState } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Button, Card, Form } from 'react-bootstrap';

// to do later -- use server.js
// import axios from 'axios';

const FileUpload = ({controlId, handleNewFilePath, folderPath, uploadLabel, uploadType, allowMultipleFiles}) => {

  const [file, setFile] = useState(null);
  let acceptedFileTypes = uploadType == "Photo" ? "image/*" : uploadType == "Video" ? "video/*" : "";

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUploadFiles = () => {

    const storage = getStorage();
    let fileList = document.getElementById(controlId).files;
    let fileIndex = 0;
    let newFileName;

    for (const file of fileList) {

      if (!acceptedFileTypes || file.type.startsWith(acceptedFileTypes.replace("*", ""))) {

        fileIndex++;
        newFileName = Date.now() + '-' + fileIndex;
        let newFilePath = `${folderPath}/${newFileName}`
        const storageRef = ref(storage, newFilePath);
        console.log("Uploading " + file.name + "...");
        uploadBytes(storageRef, file).then((snapshot) => {
          console.log(file.name + ' uploaded');
          var imgURL = getDownloadURL(storageRef);
          imgURL.then((url) => {
            console.log(url);
            handleNewFilePath(url);
          });
        });
      } else {
        console.log('FILE REJECTED: You cannot upload ' + file.type + 'files. Kthx.')
      }
    }
  }

  return (
    <>
      <Card className="claimProfileCard">
        <Card.Body>
          <Card.Title>{uploadLabel}</Card.Title>
          <Form.Group controlId={controlId} className="mb-3 CFgrayBackground">
            <Form.Control type="file" accept={acceptedFileTypes} multiple={allowMultipleFiles} onChange={handleFileChange}/>
          </Form.Group>
          <Button onClick={handleUploadFiles}>Upload</Button>
        </Card.Body>
      </Card>

    </>
  );

};

export default FileUpload;
