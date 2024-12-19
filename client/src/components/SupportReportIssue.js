import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import TopNav from './TopNav';
import Footer from './Footer';
import { firestore } from '../firebase';
import { Timestamp } from 'firebase/firestore';

/**
 * TODO:  Determine sender and recipient.
 * SENDER s/b some permanent admin address that we will not use, but need for a sender address
 * RECIPIENT s/b MICAH's permanent account address so that he gets the messages, for now.
 *
 */

export default function SupportReportIssue() {
  const [messageSent, setMessageSent] = useState(false);

  const handleSubmit = async () => {
    const messageSenderID = '0000ExampleClient';
    const messageReceiverID = 'LXxo4pjrsSYgb3xmOfC4Loco8L03';
    const messagePrepend = 'MESSAGE FROM REPORT ISSUE PAGE: ';
    const messageText =
      messagePrepend + document.getElementById('theMessage').value;
    const messageParentID = '12345';
    const messageType = 'default';
    let messageThreadID = new Date().getTime();
    console.log(
      'SENDING MESSAGE: TO:',
      messageReceiverID,
      'FROM:',
      messageSenderID,
      'TXT:',
      messageText
    );

    const dbCollection = firestore.collection('messages');
    await dbCollection.add({
      msgDate: Timestamp.now(),
      msgTo: messageReceiverID,
      msgFrom: messageSenderID,
      msgText: messageText,
      msgThreadID: messageThreadID,
      msgNotified: 0,
      msgStatus: 0,
      msgResponseSent: 0,
      msgParentID: messageParentID,
      msgType: messageType,
    });

    setMessageSent(true);
    document.getElementById('theMessage').value = '';
  };

  return (
    <>
      <TopNav />
      <div className="contentContainer utilityPage">
        <Card>
          <Card.Body>
            <h2 style={{ textAlign: 'center' }}>Report an Issue</h2>
            <p>
              Please include as much detail as you can, as well as your contact
              info if you would like a response. Thanks! 🙏
            </p>
            <textarea
              id="theMessage"
              style={{
                display: 'block',
                width: '100%',
                height: 200,
                marginTop: 10,
                marginBottom: 20,
              }}
            ></textarea>
            <div classNme="clear"></div>
            <div style={{ textAlign: 'center' }}>
              <button className="btn center-button" onClick={handleSubmit}>
                Submit
              </button>
            </div>
          </Card.Body>
        </Card>

        {messageSent && (
          <div
            style={{ marginTop: 20, fontSize: '30px' }}
            className="alert alert-success"
            role="alert"
          >
            👍Message sent! A CareFinder admin will get back with you soon.
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
