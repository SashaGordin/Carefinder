import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase'; 
import { Timestamp } from 'firebase/firestore';
import { useLocation } from 'react-router-dom'; 
import TopNav from "../components/TopNav";
import Footer from "../components/Footer";
import { Alert } from 'react-bootstrap';

const MsgOutbox = () => {

  const [messageToID, setMessageToID] = useState(null);
  const [messageToDisplayName, setMessageToDisplayName] = useState('a CF User');
  const [messageSent, setMessageSent] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const ref = params.get('ref');
    
    const checkUserExists = async () => {
      try {
        const userDoc = await firestore.collection('users').doc(ref).get();
        if (userDoc.exists) {
          const userData = userDoc.data();
          if (userData.hasOwnProperty('displayName') && userData.displayName.trim() !== '') {
            setMessageToDisplayName(userData.displayName);
          }
          setMessageToID(ref);
        } else {
          alert(`User with ID ${ref} does not exist.`);
        }
      } catch (error) {
        console.error('Error checking user existence:', error);
        alert('An error occurred while checking user existence.');
      }
    };

    if (ref) {
      checkUserExists();
    }
  }, [location.search]);

  const sendMessage = async () => {
    const currentUserID = localStorage.getItem('localStorageCurrentUserID');

    if (messageToID === currentUserID) {
      alert('You cannot send yourself a message. Kthx. :-)');
      return; 
    }

    const messageText = document.getElementById('messageTextArea').value;
    const messageThreadID = new Date().getTime();

    console.log('SENDING MESSAGE TO:', messageToID, 'FROM:', currentUserID, 'TXT:', messageText, 'THREAD:', messageThreadID);

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
    // setTimeout(() => setMessageSent(false), 5000); // Hide message sent alert after 5 seconds
  };

  return (
    <>
      <TopNav />
      <div className="contentContainer utilityPage">

        {!messageToID && 
          <Alert variant="warning">⚠️WARNING:  To use this page, you must access it with a valid userID in the URL, such as "?ref=12345"! If you are seeing this, you should navigate elsewhere and follow a link here. Thanks. </Alert>
        }

        {!messageSent &&
        <>
        <h1>Send a Message to <span className="CForange">{messageToDisplayName}</span>:</h1>
        <p>Send this user a note here. After sending, any replies will show up in your inbox.</p>

        <textarea id="messageTextArea" className="outboxTextarea"></textarea><br></br>
            <button onClick={sendMessage}>SEND</button>
            {messageSent && (
            <div className="alert alert-success" role="alert">
                Message sent successfully!
            </div>
        )}
        </>
        }

        {messageSent &&
          <Alert variant="success">👍<strong>MESSAGE SENT</strong>. Check your inbox later for replies from <strong>{messageToDisplayName}</strong>.</Alert>

        }

      </div>
      <Footer />
    </>
  );
};

export default MsgOutbox;
