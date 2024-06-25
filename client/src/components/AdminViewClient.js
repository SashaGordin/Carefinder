import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { firestore } from '../firebase';
import { Timestamp } from 'firebase/firestore';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';

// possibleexpansion (see below)
//const { getSignedUrl } = require("firebase-admin/storage");

import TopNav from "./TopNav";
import Footer from "./Footer";

export default function AdminViewClient() {

    const [userId, setUserId] = useState('');
    const [userRecord, setUserRecord] = useState(null);
    const [createdAt, setCreatedAt] = useState(null);
    const [messageToID, setMessageToID] = useState(null);
    const [messageSent, setMessageSent] = useState(false);

    const location = useLocation();

    const handleUserIdChange = (event) => {
        setUserId(event.target.value);
    };

    const getUserRecord = async (userId) => {
        try {
            const userDoc = await firestore.collection('users').doc(userId).get();
            if (userDoc.exists) {
                setUserRecord(userDoc.data());
                const createdAtData = userDoc.data().createdAt;
                const createdDate = new Date(createdAtData.seconds * 1000);
                setCreatedAt(createdDate);
                setMessageToID(userId);
            } else {
                console.log('User not found');
                setUserRecord(null);
                setCreatedAt(null);
            }
        } catch (error) {
            console.error('Error fetching user record:', error);
        }
    };

    const viewPDF = async () => {
        try {
            const targetFile = userRecord.assessmentPDFfileName;

           // Fetch the file from Firebase Storage
           const fileRef = firebase.storage().ref().child(`assessments/${targetFile}`);
           const url = await fileRef.getDownloadURL();

            // Open the URL in a new window
            // Note: Was gonna do this...
            // window.open(url + "?&inline=true", '_blank');
            // But that might be too unsecure, as anyone w/ the link could read it,
            // AND we would have to make a Firestore rule to allow these to be viewable
            /// So, this just lets it be downloadable, and it works as-is.
            window.open(url, '_blank');

            // Perhaps on post-MVP, we could do a signed URL or something
            // could not get the following to work, but could be good for future...

            // Generate a signed URL for the file with expiration (e.g., 5 minutes)
            // const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
            // const signedUrl = await getSignedUrl(storage, `assessments/${targetFile}`, { action: 'read', expires: expiresAt });

            // Open the signed URL in a new window
            // window.open(signedUrl, '_blank');

        } catch (error) {

            console.error('Error finding file:', error);

        }

    };

    // Function to parse query string and automatically call getUserRecord() if 'ref' parameter is present
    const parseQueryString = () => {
        const searchParams = new URLSearchParams(location.search);
        const refParam = searchParams.get('ref');
        if (refParam) {
            getUserRecord(refParam);
        }
    };

    // hook to parse query string when the component mounts
    useEffect(() => {
        parseQueryString();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.search]); // Re-run when location.search changes

    const sendMessage = async () => {

        const currentUserID = localStorage.getItem('localStorageCurrentUserID');

        if (messageToID === currentUserID) {
          alert('You cannot send yourself a message. Kthx. :-)');
          return;
        }

        const messageText = document.getElementById('messageTextArea').value;
        const messageThreadID = new Date().getTime();

        console.log('SENDING MESSAGE: TO:', messageToID, 'FROM:', currentUserID, 'TXT:', messageText, 'THREAD:', messageThreadID);

        const dbCollection = firestore.collection('messages');
        await dbCollection.add({
          msgDate: Timestamp.now(),
          msgTo: messageToID,
          msgFrom: currentUserID,
          msgText: messageText,
          msgThreadID: messageThreadID,
          msgNotified: 0,
          msgStatus: 0,
          msgResponseSent: 0
        });

        setMessageSent(true);
        document.getElementById('messageTextArea').value = '';
        // Hide message sent alert after 5 seconds
        setTimeout(() => setMessageSent(false), 5000);

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
                    placeholder="Input userID here or append ?ref=[userID] to URL."
                    style={{ width: 500, marginRight: 20 }}
                />
                <button variant="primary" onClick={() => getUserRecord(userId)} style={{ padding: 9, position: 'relative', top: -3 }}>Get User Record</button>

                {userRecord && (
                    <div>
                        <hr></hr>
                        <p>NOTE: We can tie this into the outgoing message system so that admins can use this screen to send messages to the viewed user.</p>

                        {userRecord.profilePicPath &&
                            <img alt={""} src={userRecord.profilePicPath} style={{width:300}} />
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
                                <button onClick={viewPDF}>Download and View Assessment PDF</button>
                            </>
                        )}

                        <hr></hr>

                        <h3>Send this user a message via our messaging system (will show in your inbox):</h3>
                        <textarea id="messageTextArea" style={{ width: 500, height: 300 }}></textarea><br></br>
                        <button onClick={sendMessage}>SEND</button>
                        {messageSent && (
                        <div className="alert alert-success" role="alert">
                            Message sent successfully!
                        </div>
                        )}

                    </div>
                )}

            </div>
            <Footer />
        </>
    );
}
