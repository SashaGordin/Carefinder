import React, { useRef } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Button, Form } from 'react-bootstrap';

// to do later -- use server.js
// import axios from 'axios';

const FileUpload = ({ controlId, handleNewFiles, folderPath, uploadLabel, uploadType, allowMultipleFiles }) => {

  // eslint-disable-next-line no-unused-vars
  let acceptedFileTypes =
    uploadType === "Photo" ? "image/*" :
      uploadType === "Video" ? "video/*" :
        uploadType === "Document" ? "application/pdf" : "";

  const hiddenFileInput = useRef(null);

  // Programatically click the hidden file input element
  // when the Button component is clicked
  const handleClick = event => {
    hiddenFileInput.current.click();
  };
  const handleUploadFiles = () => {

    const storage = getStorage();
    let fileList = document.getElementById(controlId).files;
    let fileIndex = 0;
    let newFileName;
    let promises = [];
    for (const file of fileList) {

      let isAcceptedFileType = false;
      if (!acceptedFileTypes)
        isAcceptedFileType = true;
      else if (acceptedFileTypes.endsWith("*"))
        isAcceptedFileType = file.type.startsWith(acceptedFileTypes.replace("*", ""));
      else {
        let arr = acceptedFileTypes.split(",");
        for (let type of arr) {
          if (type.startsWith(".")) //extension
            isAcceptedFileType |= file.name.endsWith(type);
          else //mime type
            isAcceptedFileType |= file.type === type;
        }
      }

      if (isAcceptedFileType) {

        fileIndex++;
        newFileName = Date.now() + '-' + fileIndex; //this needs to have the correct extension at the end of the name
        let newFilePath = `${folderPath}/${newFileName}`
        const storageRef = ref(storage, newFilePath);
        console.log("Uploading " + file.name + "...");
        var uploadPromise = uploadBytes(storageRef, file).then(() => {
          console.log("getting download url");
          return getDownloadURL(storageRef).then((url) => {
            let thisFileName = file.name;
            return { name: thisFileName, path: url };
          })
        });
        console.log(uploadPromise);
        promises.push(uploadPromise);
      } else {
        console.log('FILE REJECTED: You cannot upload ' + file.type + ' files. Kthx.')
      }
    }
    Promise.all(promises).then((files) => {
      console.log("All uploads completed. URLs:");
      console.log(files);
      handleNewFiles(files);
    })
  }

  return (
    <>

      <div>{uploadLabel}</div>
      
      <Form.Group controlId={controlId} className="d-none">
        <Form.Control type="file" accept={acceptedFileTypes} multiple={allowMultipleFiles} ref={hiddenFileInput}
          onChange={handleUploadFiles} />
      </Form.Group>
      <Button onClick={handleClick}>Upload</Button>
    </>
  );

};

export default FileUpload;
