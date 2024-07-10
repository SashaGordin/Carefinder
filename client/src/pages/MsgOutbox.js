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
 *         [root]/msg-outbox?ref=[userID]&type=[type]&property=[propertyID]
 *  'ref' is the userID of the message recipient
 *  'propertyID' -- not required, but if it is there it s/b the "LicenseNumber"
 *      on record for the recipient (provider). If present, we can lookup the
 *      'FacilityName' tp pass along to the provider in the message
 *  'type' is optional, but can be:
 *      [blank] == message is a standard message (text message)
 *      'quote' == message is a request for a quote (typically sent to providers)
 *      'meet' == message is a request for a meeting
 *      'tour' == message is a request to schedule a home tour
 *  'type' will be saved in DB as `msgType` for possible formatting in inbox later.
 *  Kthx.
 */

const MsgOutbox = () => {

  const [recipientID, setRecipientID] = useState(null);
  const [recipientDisplayName, setRecipientDisplayName] = useState('a CF User');
  const [messageSent, setMessageSent] = useState(false);
  const location = useLocation();

  const currentUserID = localStorage.getItem('localStorageCurrentUserID') || '';

  const [messageType, setMessageType] = useState('');
  const [messagePrepend, setMessagePrepend] = useState('');
  const [messageAppend, setMessageAppend] = useState('');
  const [messageExplanation, setMessageExplanation] = useState('');
  const [messageTypeDisplay, setMessageTypeDisplay] = useState('Message');

  const [senderAssessmentFile, setSenderAssessmentFile] = useState('');

  // define possible/supported message types
  const possibleMessageTypes = ['quote','meet','text','tour'];
  // while "text" is valid here, it's really just for default behavior.
  // I just left it in, in case I want it later.

  useEffect(() => {

    const params = new URLSearchParams(location.search);
    const ref = params.get('ref');

    const checkRecipientExists = async () => {

      try {

        const recipientDoc = await firestore.collection('users').doc(ref).get();

        if (recipientDoc.exists) {

          const recipientDocData = recipientDoc.data();

          if (recipientDocData.hasOwnProperty('displayName') && recipientDocData.displayName.trim() !== '') {
            setRecipientDisplayName(recipientDocData.displayName);
            console.log('Recipient is:' + recipientDocData.displayName );
          }
          setRecipientID(ref);
          console.log('Recipient ID:' + ref );

              // NEW lookup to see if the sender has 'assessmentPDFfileName'
              try {
                const senderDoc = await firestore.collection('users').doc(currentUserID).get();
                if (senderDoc.exists) {
                  const senderDocData = senderDoc.data();
                  if (senderDocData.hasOwnProperty('assessmentPDFfileName')) {
                    setSenderAssessmentFile(senderDocData.assessmentPDFfileName);
                    console.log('Sender HAS an assessment on file.');
                  } else {
                    console.log('Sender does NOT have an assessment on file.');
                  }
                } else {
                  console.log(`Sender with ID ${currentUserID} does not exist.`);
                }
              } catch (error) {
                console.error('Error fetching Sender user document:', error);
                alert('An error occurred while fetching Sender user document.');
              }

        } else {
          alert(`Recipient with ID ${ref} does not exist.`);
        }
      } catch (error) {
        console.error('Error checking recipient existence:', error);
        alert('An error occurred while checking recipient existence.');
      }
    };

    if (ref) {
      checkRecipientExists();
    }

    const type = params.get('type');

    if (type && possibleMessageTypes.includes(type)) {

      setMessageType(type);

      switch(type) {

        case 'quote':
          setMessageTypeDisplay('Quote Request');
          setMessageExplanation('🧿 You are <b>requesting a quote</b> from this provider. ⚠️<b>PLEASE NOTE:</b> In order for a provider to issue a quote, you will need an ASSESSMENT. If you have one on file here at CareFinder, we will send along a copy of your assessment to this provider. If you do NOT have one on file, please first head over to our <a href="/survey">Senior Survey</a> where you can upload or schedule an assessment. ');
          setMessagePrepend('🚨<b>QUOTE REQUEST</b><br/>');
          break;

        case 'meet':
          setMessageTypeDisplay('Meeting Request');
          setMessageExplanation('🧿 You are <b>requesting a meeting</b> with this user. ');
          setMessagePrepend('🚨<b>MEETING REQUEST</b><br/>');
          break;

        case 'tour':
          setMessageTypeDisplay('Tour Request');
          setMessageExplanation('🧿 You are <b>requesting a home tour</b> with this provider. ');
          setMessagePrepend('🚨<b>TOUR REQUEST</b><br/>');
          break;

        default:
          setMessageExplanation('🧿 You are sending a normal text message to this user.');
      }

    } else {
      console.log('Invalid request for *type*. Kthx.');
      setMessageType(null);
    }

      // Check if senderAssessmentFile exists in Firebase Storage
      if (senderAssessmentFile) {
        const fileRef = firebase.storage().ref().child(`assessments/${senderAssessmentFile}`);
        fileRef.getDownloadURL()
          .then(url => {
            console.log('Assessment URL:', url);
            let thisAppend='<br />🔗 Download my current assessment <a href="'+url+'" target="_blank">HERE</a>.';
            setMessageAppend(thisAppend);
            console.log('messageAppend:', messageAppend);
          })
          .catch(error => {
            console.error('Error getting download URL:', error);
          });
      } else {
        console.log('No assessment on file');
      }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search, senderAssessmentFile, messageAppend]);

  const sendMessage = async () => {
    if (recipientID === currentUserID) {
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

    console.log('SENDING MESSAGE TO:', recipientID, 'FROM:', currentUserID, 'TXT:', messageText, 'THREAD:', messageThreadID);

    const dbCollection = firestore.collection('messages');

    const currentTimestamp = Timestamp.now();

    await dbCollection.add({
      msgDate: currentTimestamp,
      msgTo: recipientID,
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

    /*
      Drop a note that this convo is initiated... OKAY,so WHY do we leave this message from the system?  Yes, good question, lol...
      It's actually a long, convuluted tale. Basically, it's because we can't really do complex queries in Firebase (multiple WHERE/OR clauses, which is what I'd planned for b/c you can do that fairly readily in MySQL). Anyway, the inbox script does an initial query of all messages sent TO a user (the current user). However, in some cases like this, the initial request is technically an OUTGOING one -- i.e. user X sends a message out TO provider Y. This makes for a problem because the request would not be shown in the User X Inbox, as there is no incoming message to User X. The refactoring required to fix this seemed even more convoluted than this simple solution which is to force a reply, thus allowing the MsgThread component to automatically pick up the fact that a conversation is ongoing.

      UPDATE: I decided to expand on this solution a bit... will HIDE this message by passing a value of 1 to msgHide in the DB.
    */
    let followUpMessage = '(System note: Your '+messageTypeDisplay+' was sent. Check back here for replies. This message will be hidden in the inbox.)';

    const futureTimestamp = new Timestamp(currentTimestamp.seconds + 5, currentTimestamp.nanoseconds);

    await dbCollection.add({
      msgDate: futureTimestamp,
      msgTo: currentUserID,
      msgFrom: recipientID,
      msgText: followUpMessage,
      msgThreadID: messageThreadID,
      msgNotified: 0,
      msgStatus: 0,
      msgResponseSent: 0,
      msgType: messageType,
      msgHide: 1
    });


    // Hide message sent alert after 10 seconds
    setTimeout(() => setMessageSent(false), 10000);
  };

  return (
    <>
      <TopNav />
      <div className="contentContainer utilityPage">

        {!recipientID &&
          <Alert variant="warning">⚠️WARNING:  To use this page, you must access it with a valid userID in the URL, such as "?ref=12345"! If you are seeing this, you should navigate elsewhere and follow a link here. Thanks. </Alert>
        }

        {!messageSent &&
        <>
        <h1>Send a {messageTypeDisplay} to <span className="CForange">{recipientDisplayName}</span>:</h1>

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
          <Alert variant="success">👍<strong>MESSAGE SENT</strong>. Check your inbox later for replies from <strong>{recipientDisplayName}</strong>.</Alert>
        }

      </div>
      <Footer />
    </>
  );
};

export default MsgOutbox;
