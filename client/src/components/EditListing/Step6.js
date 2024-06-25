import React, { useState } from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import { getStorage, ref, uploadBytes } from "firebase/storage";

export default function Step6({ listingInfo, setListingInfo }) {
  const storage = getStorage();

  const handleUploadFiles = () => {
    let fileList = document.getElementById("formFileMultiple").files;
    for(const file of fileList) {
      const storageRef = ref(storage, `images/${file.name}`);
      console.log("Uploading " + file.name + "...");
      uploadBytes(storageRef, file).then((snapshot) => {
        console.log(file.name + ' uploaded');
      });
    }
  }

  return (
    <>
      <Card className="claimProfileCard">

        <Card.Body>

          <Card.Title>Add some photos of your home</Card.Title>

          <Card.Text>
            You will need at least five photos to get started, you will be able to add more and edit later. (exterior, interior, common areas) No room photos
          </Card.Text>
            <Form.Group controlId="formFileMultiple" className="mb-3 CFgrayBackground">
              <Form.Label>Select photos to upload</Form.Label>
              <Form.Control type="file" multiple />
            </Form.Group>
            <Button onClick={handleUploadFiles}>Upload Files</Button>
        </Card.Body>

      </Card>

    </>

  );
};