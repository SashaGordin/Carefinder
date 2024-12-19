import React from 'react';
import { Button, Container, Row, Col, Form } from 'react-bootstrap';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import forge from 'node-forge';
import { getDoc, doc } from 'firebase/firestore';
import { firestore } from '../../firebase';

// *NOTE TO DEVS: Need to install node forge... npm i node-forge

/**
 *  NOTE: This is a backup version, not used, just in case we need to provide additional encryption.
 *  This version ALMOST works, but if you look below near 'await uploadBytes' you will
 *  see that, if you upload the 'notEncrypted' data, the file saves just fine, but if you
 *  upload 'encryptedDataBase64' it only records about 9 bytes, and the file contents
 *  will be simply 'undefined'. I'm not sure why -- and indeed this is the reason I have
 *  base64encoded the file in the first place -- was trying to possibly fix this by base64encoding it.
 *  In any case, it looks like we do not need encryption as Firestore alreay encrypts data
 *  stored there, so I am going to refactor without node-forge and simply upload the raw PDFs
 *  and rely on Firestore for the encryption part.
 */

/**
 * HIPAA COMPLIANCE NOTES: This script takes in the PDF file and encrypts it.
 * To encrypt the PDF, it generates a key and an IV var.
 * We then encrypto the key and IV using master key and master IV environment vars.
 * Then we store the PDF download link (link to the encrypted PDF), as well as
 * the encrypted key and encrypted iv, in the user record.
 * Thus, to retrieve the PDF, we will need to write a script to decrypt the key and iv
 * and then use those decrypted vars (key and iv) to decrypt the PDF.
 * In this way, we are (1) only storing encrypted data in the database, (2) only storing
 * encrypted keys in the database, specific to each file, and (3) requiring that
 * access to the master keys (stored safely out of the file structure, out of github, etc.)
 * is required for decrypting. Thus if we had a data breach, (1) the storage system could only yield
 * encrypted data, (2) the database could only yield encrypted data, (3) deep access to the environment vars
 * would be required to access data, and (4) the entire process of how to decrypt would be difficult.
 * This represents a good-faith effort on the part of CareFinder to develop a secure system.
 * Ultimate respnsibility for HIPAA compliance falls on CareFinder.com, not the devs.
 */

const SurveyUpload = ({ assessment, description, onNext, onBack }) => {
  const handleNext = () => {
    onNext();
  };

  const handleBack = () => {
    onBack();
  };

  console.log('RADIO HANDLING!');
  console.log('assessment: ' + assessment);

  const handlePDFupload = async () => {
    const storage = getStorage();
    const fileList = document.getElementById('formPDFupload').files;
    const acceptableMimeTypes = ['application/pdf'];

    for (const file of fileList) {
      if (acceptableMimeTypes.includes(file.type)) {
        try {
          // Generate key and IV
          const singleKey = forge.random.getBytesSync(32);
          const singleIV = forge.random.getBytesSync(16);
          console.log('singleKey-hex:', singleKey.toString('hex'));
          console.log('singleIV-hex:', singleIV.toString('hex'));

          const fileData = await readFileAsync(file);

          if (fileData) {
            const encryptedDataBase64 = await encryptFile(
              fileData,
              singleKey,
              singleIV
            );
            console.log('returnedbase64:', encryptedDataBase64);
            // testing...
            const notEncrypted = fileData;

            const base64StringName = Date.now().toString() + '.txt';
            const storageRef = ref(storage, `assessments/${base64StringName}`);
            console.log('Uploading ' + file.name + '...');

            try {
              await uploadBytes(storageRef, notEncrypted);
              console.log(file.name + ' uploaded');
              console.log('...as: ' + base64StringName);

              // Get NODE_FORGE_MASTERKEY and NODE_FORGE_MASTERIV from env.local
              const NODE_FORGE_MASTERKEY =
                process.env.REACT_APP_NODE_FORGE_MASTERKEY;
              const NODE_FORGE_MASTERIV =
                process.env.REACT_APP_NODE_FORGE_MASTERIV;
              console.log(NODE_FORGE_MASTERKEY);
              console.log(NODE_FORGE_MASTERIV);

              // cast to hex...
              let NODE_FORGE_MASTERKEY_HEX =
                forge.util.hexToBytes(NODE_FORGE_MASTERKEY);
              let NODE_FORGE_MASTERIV_HEX =
                forge.util.hexToBytes(NODE_FORGE_MASTERIV);
              console.log('hexkey: ', NODE_FORGE_MASTERKEY_HEX);
              console.log('hexiv: ', NODE_FORGE_MASTERIV_HEX);

              // Encrypt singleKey and singleIV using NODE_FORGE_MASTERKEY and NODE_FORGE_MASTERIV
              const cipherKey = forge.cipher.createCipher(
                'AES-CBC',
                NODE_FORGE_MASTERKEY_HEX
              );
              cipherKey.start({ iv: NODE_FORGE_MASTERIV_HEX });
              cipherKey.update(forge.util.createBuffer(singleKey));
              cipherKey.finish();
              const singleEncryptedKey = cipherKey.output.getBytes();
              console.log('singleEncryptedKey:', singleEncryptedKey);

              const cipherIV = forge.cipher.createCipher(
                'AES-CBC',
                NODE_FORGE_MASTERKEY_HEX
              );
              cipherIV.start({ iv: NODE_FORGE_MASTERIV_HEX });
              cipherIV.update(forge.util.createBuffer(singleIV));
              cipherIV.finish();
              const singleEncryptedIV = cipherIV.output.getBytes();
              console.log('singleEncryptedIV:', singleEncryptedIV);

              // get userID from localstorage
              const localStorageCurrentUserID = localStorage.getItem(
                'localStorageCurrentUserID'
              );
              console.log('Update user record:' + localStorageCurrentUserID);

              // Update the user document with the new data
              const userRef = firestore
                .collection('users')
                .doc(localStorageCurrentUserID);

              try {
                await userRef.update({
                  assessmentPDFfileName: base64StringName,
                  singleEncryptedKey: singleEncryptedKey,
                  singleEncryptedIV: singleEncryptedIV,
                });

                console.log('User record updated successfully.');

                alert(
                  'AWESOME! We received the file and have saved it securely (and encrypted) for our review. You may click `Next` and go to the next screen. Thanks!'
                );
              } catch (error) {
                console.error('Error updating user record:', error);
              }
            } catch (error) {
              console.error('Error uploading file:', error);
            }
          }
        } catch (error) {
          console.error('Error reading file:', error);
        }
      } else {
        alert(
          'FILE REJECTED: You cannot upload ' +
            file.type +
            ' files. Must be .PDF files for this. Kthx.'
        );
      }
    }
  };

  const readFileAsync = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = () => {
        const data = new Uint8Array(reader.result);
        resolve(data);
        console.log('async-check...', data);
      };
      reader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const encryptFile = async (data, theSingleKey, theSingleIV) => {
    // Encrypt the file
    const cipher = forge.cipher.createCipher('AES-CBC', theSingleKey);
    cipher.start({ iv: theSingleIV });
    cipher.update(forge.util.createBuffer(data));
    cipher.finish();
    // Get the encrypted data as a binary string
    const encryptedBinary = cipher.output.getBytes();

    // Encode the binary data as base64
    const encryptedBase64 = forge.util.encode64(encryptedBinary);
    console.log('encryptedBase64 (base64)', encryptedBase64);
    return encryptedBase64;
  };

  return (
    <>
      {assessment ? (
        <Container
          className="p-5"
          style={{ backgroundColor: '#333', color: '#fff' }}
        >
          <Row className="justify-content-center text-center">
            <h2 className="mb-4">Great! Upload it now</h2>
            {description && <div className="mb-4">{description}</div>}
            <Col xs={12} md={12} lg={12}>
              <Form.Group
                controlId="formPDFupload"
                className="CFgrayBackground"
              >
                <Form.Label>Select images to upload (PDF only)</Form.Label>
                <Form.Control type="file" accept="application/pdf" />
              </Form.Group>
              <Button onClick={handlePDFupload}>Upload File</Button>
              <div className="d-flex justify-content-between mt-4">
                <Button variant="secondary" onClick={handleBack}>
                  Back
                </Button>
                <Button variant="primary" onClick={handleNext}>
                  Next
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      ) : (
        <Container
          className="p-5"
          style={{ backgroundColor: '#333', color: '#fff' }}
        >
          <Row className="justify-content-center">
            <h2 className="mb-4">Schedule virtual assessment</h2>
            <div className="mb-4">
              Please select a day and time that you and your senior are able to
              be in the same room and conduct a 45 minute assessment via google
              meets.
            </div>

            {/* input calendly here */}
            <iframe
              title="Calendly Scheduler"
              src="https://calendly.com/carefinderwa/30min"
              style={{ width: '100%', height: '800px', border: '0' }}
              scrolling="no"
            ></iframe>
            <div className="d-flex justify-content-between mt-4">
              <Button variant="secondary" onClick={handleBack}>
                Back
              </Button>
              <Button variant="primary" onClick={handleNext}>
                Next
              </Button>
            </div>
          </Row>
        </Container>
      )}
    </>
  );
};

export default SurveyUpload;
