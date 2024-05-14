import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase'; 
import { Timestamp } from 'firebase/firestore';
import { useLocation } from 'react-router-dom'; 
import TopNav from "../components/TopNav";
import Footer from "../components/Footer";
import { Alert } from 'react-bootstrap';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';

// TODOs:
// Not sure if we're doing any Calendly integration on the Provider or User side, 
// but we may need to do some adjustments here if so.

/**
 *  SCRIPT NOTES:
 *  Access to this page s/b done as follows:
 *         [root]/msg-outbox?ref=[userID]&type=[type]
 *  'type' is optional, but can be:
 *      [blank] == message is a standard message (text message)
 *      'quote' == message is a request for a quote (typically sent to providers)
 *      'meet' == message is a request for a meeting
 *      'tour' == message is a request to schedule a home tour
 *  'type' will be saved in DB as `msgType` for possible formatting in inbox later.
 *  Kthx.
 */

const MsgOutbox = () => {

  const [messageToID, setMessageToID] = useState(null);
  const [messageToDisplayName, setMessageToDisplayName] = useState('a CF User');
  const [messageSent, setMessageSent] = useState(false);
  const location = useLocation();

  const [currentUserID, setCurrentUserID] = useState(localStorage.getItem('localStorageCurrentUserID') || '');

  const [messageType, setMessageType] = useState('');
  const [messagePrepend, setMessagePrepend] = useState('');
  const [messageAppend, setMessageAppend] = useState('');
  const [messageExplanation, setMessageExplanation] = useState('');
  const [messageTypeDisplay, setMessageTypeDisplay] = useState('Message');

  const [userAssessmentFile, setUserAssessmentFile] = useState('');

  // define possible/supported message types
  const possibleMessageTypes = ['quote','meet','text','tour'];
  // while "text" is valid here, it's really just for default behavior.
  // I just left it in, in case I want it later.

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
            console.log('User is:' + userData.displayName );
          }
          setMessageToID(ref);

          // set the assessment filename...
          if (userData.hasOwnProperty('assessmentPDFfileName')) {
            setUserAssessmentFile(userData.assessmentPDFfileName);
            console.log('User HAS an assessment on file.');
          } else {
            console.log('User does NOT have an assessment on file.');
          }

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

    const type = params.get('type');

    if (type && possibleMessageTypes.includes(type)) {
      
      setMessageType(type);

      switch(type) {

        case 'quote':
          setMessageTypeDisplay('Quote Request');
          setMessageExplanation('🧿 You are <b>requesting a quote</b> from this provider. ⚠️<b>PLEASE NOTE:</b> In order for a provider to issue a quote, you will need an ASSESSMENT. If you have one on file here at CareFinder, we will send along a copy of your assessment to this provider. If you do NOT have one on file, please first head over to our <a href="/survey">Senior Survey</a> where you can upload or schedule an assessment. ');
          setMessagePrepend('🚨QUOTE REQUESTED: THIS USER IS REQUESTING A PRICE QUOTE FROM YOU! -- ');
          // Check if userAssessmentFile exists in Firebase Storage
          if (userAssessmentFile) {
            const fileRef = firebase.storage().ref().child(`assessments/${userAssessmentFile}`);
            fileRef.getDownloadURL()
              .then(url => {
                console.log('Download URL:', url);
                setMessageAppend('🔗DOWNLOAD URL FOR THE USER ASSESSMENT IS: ' + url);
                console.log('messageAppend:', messageAppend);
              })
              .catch(error => {
                console.error('Error getting download URL:', error);
              });
          } else {
            console.log('No assessment on file');
          }         
          break;

        case 'meet':
          setMessageTypeDisplay('Meeting Request');
          setMessageExplanation('🧿 You are <b>requesting a meeting</b> with this user. ');
          setMessagePrepend('🚨MEETING REQUESTED: THIS USER IS REQUESTING A MEETING WITH YOU! -- ');
          break;

        case 'tour':
          setMessageTypeDisplay('Tour Request');
          setMessageExplanation('🧿 You are <b>requesting a home tour</b> with this provider. ');
          setMessagePrepend('🚨TOUR REQUESTED: THIS USER IS REQUESTING A HOME TOUR! -- ');
          break;

        default:
          setMessageExplanation('🧿 You are sending a normal text message to this user.');
      }

    } else {
      console.log('Invalid request for *type*. Kthx.');
      setMessageType(null); 
    }    

  }, [location.search, userAssessmentFile, messageAppend]);

  const sendMessage = async () => {
    if (messageToID === currentUserID) {
      alert('You cannot send yourself a message. Kthx. :-)');
      return; 
    }

// TO: LXxo4pjrsSYgb3xmOfC4Loco8L03
//  FR: 0000ExampleClient

    let messageText = document.getElementById('messageTextArea').value;
    // add on any prepends, depending on TYPE:
    if (messagePrepend) { messageText = messagePrepend + messageText; }
    if (messageAppend)  { messageText += messageAppend; }

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
      msgResponseSent: 0,
      msgType: messageType
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
        <h1>Send a {messageTypeDisplay} to <span className="CForange">{messageToDisplayName}</span>:</h1>

        {/* NOTE: Using dangerouslySetInnerHTML here b/c I'm setting the text above & it needs links. There's probably some better JSX way to do this, but it works. -JD */}
        <p> <span dangerouslySetInnerHTML={{ __html: messageExplanation }} /> <span>After sending, replies to this {messageTypeDisplay} will show up in your inbox.</span></p>

        <textarea id="messageTextArea" className="outboxTextarea"></textarea><br></br>
            <button onClick={sendMessage} style={{padding:10}}>SEND</button>
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
