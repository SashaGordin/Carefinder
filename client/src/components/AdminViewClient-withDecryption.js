import React, { useState } from 'react';
import { firestore } from '../firebase'; 
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';

import TopNav from "./TopNav";
import Footer from "./Footer";
import forge from 'node-forge';
//import axios from 'axios';

/**
 * NOTE: This is simply a backup copy of a viewer I was writing that had decryption, 
 * which would pair with the 'SurveyUpload-withEncryption.js' file. It was not finished,
 * but I am retaining this, just in case we want to bring back encryption/decryption
 * to client-uploaded files. We do not need this currently because Firestore already
 * encrypts all data stored on its server. So, this code would be redundant and
 * unnecessarily complicated. This code was never completed, but may provide a
 * good starting direction if ever needed.  Thx. -JD
 */

export default function AdminViewClient() {

    const [userId, setUserId] = useState('');
    const [userRecord, setUserRecord] = useState(null);
    const [createdAt, setCreatedAt] = useState(null);

    const NODE_FORGE_MASTERKEY = process.env.REACT_APP_NODE_FORGE_MASTERKEY;
    const NODE_FORGE_MASTERIV = process.env.REACT_APP_NODE_FORGE_MASTERIV;
    console.log(NODE_FORGE_MASTERKEY);
    console.log(NODE_FORGE_MASTERIV);

    // cast to hex...
    let NODE_FORGE_MASTERKEY_HEX = forge.util.hexToBytes(NODE_FORGE_MASTERKEY);
    let NODE_FORGE_MASTERIV_HEX = forge.util.hexToBytes(NODE_FORGE_MASTERIV);
    console.log('hexkey: ', NODE_FORGE_MASTERKEY_HEX);
    console.log('hexiv: ', NODE_FORGE_MASTERIV_HEX);

    const handleUserIdChange = (event) => {
        setUserId(event.target.value);
    };

    const getUserRecord = async () => {
        try {
            const userDoc = await firestore.collection('users').doc(userId).get();
            if (userDoc.exists) {
                setUserRecord(userDoc.data());
                const createdAtData = userDoc.data().createdAt;
                const createdDate = new Date(createdAtData.seconds * 1000);
                setCreatedAt(createdDate);
            } else {
                console.log('User not found');
                setUserRecord(null);
                setCreatedAt(null);
            }
        } catch (error) {
            console.error('Error fetching user record:', error);
        }
    };

    const decryptPDF = async () => {
        try {
            const encryptedIV = userRecord.singleEncryptedIV;
            const encryptedKey = userRecord.singleEncryptedKey;
            const encryptedFile = userRecord.assessmentPDFfileName;
            console.log('encryptedIV', encryptedIV) 
            console.log('encryptedKey', encryptedKey) 
            console.log('encryptedFile', encryptedFile) 

            const decipherKey = forge.cipher.createDecipher('AES-CBC', NODE_FORGE_MASTERKEY_HEX);
            decipherKey.start({ iv: NODE_FORGE_MASTERIV_HEX });
            decipherKey.update(forge.util.createBuffer(encryptedKey));
            decipherKey.finish();
            const decryptedKey = decipherKey.output.getBytes();
            console.log('decryptedKey', decryptedKey);

            const decipherIV = forge.cipher.createDecipher('AES-CBC', NODE_FORGE_MASTERKEY_HEX);
            decipherIV.start({ iv: NODE_FORGE_MASTERIV_HEX });
            decipherIV.update(forge.util.createBuffer(encryptedIV));
            decipherIV.finish();
            const decryptedIV = decipherIV.output.getBytes();
            console.log('decryptedIV', decryptedIV);

            // Fetch the encrypted file from Firestore
            const fileRef = firebase.storage().ref().child(encryptedFile);
            const encryptedFileSnapshot = await fileRef.getDownloadURL();
            const encryptedFileUrl = encryptedFileSnapshot.toString();

            // Decrypt the file
            const decipherFile = forge.cipher.createDecipher('AES-CBC', decryptedKey);
            decipherFile.start({ iv: decryptedIV });
            decipherFile.update(forge.util.createBuffer(encryptedFileUrl, 'binary'));
            decipherFile.finish();
            const decryptedContentBuffer = Buffer.from(decipherFile.output.getBytes(), 'binary');

            // Convert decrypted content to a Blob
            const blob = new Blob([decryptedContentBuffer], { type: 'application/pdf' });

            // Create URL for the Blob
            const url = URL.createObjectURL(blob);

            // Open the URL in a new window
            window.open(url, '_blank');

        } catch (error) {
            console.error('Error decrypting PDF:', error);
        }
    };

    return (
        <>
            <TopNav />
            <div className="contentContainer utilityPage">
                <h2>Admin Client Viewer</h2>
                <p>Here you (an Admin) can view a client profile privately, including downloading an assessment if available.</p>

                <input 
                    type="text" 
                    value={userId}
                    onChange={handleUserIdChange} 
                    placeholder="Input userID here." 
                    style={{ width: 500 }}
                />
                <button onClick={getUserRecord}>Get User Record</button>

                {userRecord && (
                    <div>
                        <hr></hr>
                        <p>NOTE: We can tie this into the outgoing message system so that admins can use this screen to send messages to the viewed user.</p>                    

                        {userRecord.profilePicPath && 
                            <img src={userRecord.profilePicPath} style={{width:300}} />
                        }
                        <h3>User Record for <span className="CForange">{userRecord.displayName}</span>:</h3>

                        {createdAt && (
                            <><p><b>Creation Date</b>: {createdAt.toLocaleString()}</p></>
                        )}

                        {userRecord.email && (
                            <><p><b>Email</b>: {userRecord.email}</p></>
                        )}

                        {userRecord.TelephoneNmbr && (
                            <><p><b>Phone</b>: {userRecord.TelephoneNmbr}</p></>
                        )}

                        {userRecord.role && (
                            <><p><b>Role</b>: {userRecord.role}</p></>
                        )}

                        {userRecord.assessmentPDFfileName && (
                            <>
                                <button onClick={decryptPDF}>View PDF</button>
                            </>
                        )}

                        <pre>{JSON.stringify(userRecord, null, 2)}</pre>
                    </div>
                )}

            </div>
            <Footer />
        </>
    );
}
