import React from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Button, Card, Form } from 'react-bootstrap';

// to do later -- use server.js
// import axios from 'axios';

const FileUpload = () => {

  // const [file, setFile] = useState(null);

  // const handleFileChange = (e) => {
  //   setFile(e.target.files[0]);
  // };

  const handleUploadFiles = () => {

    const storage = getStorage();
    let fileList = document.getElementById("formFileMultiple").files;
    let fileIndex = 0;
    let newFileName;
    const acceptableMimeTypes = ['image/jpeg','image/png','image/gif'];

    for(const file of fileList) {

      if ( acceptableMimeTypes.includes(file.type) ) {

        fileIndex++;
        newFileName = Date.now() + '-' + fileIndex;
        const storageRef = ref(storage, `images/${newFileName}`);
        console.log("Uploading " + file.name + "...");
        uploadBytes(storageRef, file).then((snapshot) => {
          console.log(file.name + ' uploaded');
          var imgURL = getDownloadURL(storageRef);
          imgURL.then(console.log);
          // and we would then write the imgURL to the usertable somewhere...
        });

      } else {

        console.log('FILE REJECTED: You cannot upload ' + file.type +  'files. Kthx.')

      }

    }

  }

  return (
    <>
      <Card className="claimProfileCard">
      <Card.Body>
        <Card.Title>Multi-Photo Upload</Card.Title>
        <Form.Group controlId="formFileMultiple" className="mb-3 CFgrayBackground">
          <Form.Label>Select images to upload (JPG, GIF, PNG only)</Form.Label>
          <Form.Control type="file" accept="image/*" multiple />
        </Form.Group>
        <Button onClick={handleUploadFiles}>Upload Files</Button>
        </Card.Body>
      </Card>

    </>
  );

};

export default FileUpload;
