import React, { useState } from 'react';
import { firestore } from '../firebase'; 
import { Timestamp } from 'firebase/firestore';
import TopNav from "../components/TopNav";
import Footer from "../components/Footer";


// TESTING VALS..
// JIM:  LXxo4pjrsSYgb3xmOfC4Loco8L03
// other:  0000ExampleClient
// threadID:  1715390825702

const MessageAdminSpoof = () => {

  const [messageSent, setMessageSent] = useState(false);

  const sendMessage = async () => {

    const messageSenderID = document.getElementById('senderID').value;
    const messageReceiverID = document.getElementById('receiverID').value;
    if (messageSenderID === messageReceiverID) { alert('Sender and recipient must differ. Kthx. :-)'); return; }

    const messageText = document.getElementById('theMessage').value;
    const messageParentID = document.getElementById('parentID').value;
    const messageType = document.getElementById('messageType').value;

    let messageThreadID = document.getElementById('threadID').value;
    if (!messageThreadID) {  
      messageThreadID = new Date().getTime(); 
    } else {
       // Parse the string to an integer
      messageThreadID = parseInt(messageThreadID, 10); 
    }
    
    console.log('SENDING MESSAGE: TO:', messageReceiverID, 'FROM:', messageSenderID, 'TXT:', messageText, 'THREAD:', messageThreadID);

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
      msgType: messageType
    });

    setMessageSent(true);
    document.getElementById('theMessage').value = '';
  };

  const flipflopSenderReceiver = () => {
    const senderInput = document.getElementById('senderID');
    const receiverInput = document.getElementById('receiverID');

    const temp = senderInput.value;
    senderInput.value = receiverInput.value;
    receiverInput.value = temp;
  };

  return (
    <>
      <TopNav />
      <div className="contentContainer utilityPage">

        <h1>ADMINS ONLY -- MESSAGE SPOOFER</h1>
        <p>This utility allows you to send a message from any ID to any other ID. Good for testing, as you can change up the sender and receiver at will. The FLIP button allows you to quickly flipflop the sender/receiver, which allows you to quickly simulate actual "conversations" in the messaging system. If you know the threadID, pop it in and you can work within a single conversation. If not, a new thread will be started. For now, the "type" is there to simply mark it as such in the DB... it does not do any formatting like real quote/meeting requests do.</p>

        <p>SENDER ID:</p>
        <input id="senderID" style={{display:'block', width:500}} />

        <p>RECEIVER ID:</p>
        <input id="receiverID" style={{display:'block', width:500}} />

        <p>THREAD ID (optional):</p>
        <input id="threadID" type="number" style={{display:'block', width:500}} />

        <p>PARENT ID (optional):</p>
        <input id="parentID" style={{display:'block', width:500}} />

        <p>MESSAGE TYPE:</p>
        <select id="messageType" style={{display:'block', width:500, color:'black', borderRadius:7, padding:6, marginBottom:15}}>
          <option value="default">Default / Text</option>
          <option value="quote">Quote (request a quote)</option>
          <option value="meet">Meet (request a meeting)</option>
          <option value="tour">Tour (request a tour)</option>
        </select>

        <p>MESSAGE:</p>
        <textarea id="theMessage" style={{display:'block', width:500, height:200}}></textarea>

        <button onClick={sendMessage} style={{ padding:20, marginTop:20, marginRight:20 }}>SEND</button>
        <button onClick={flipflopSenderReceiver} style={{ padding:20, marginTop:20 }}>FLIP SENDER / RECEIVER</button>

        {messageSent && (
          <div className="alert alert-success" role="alert">
            Message sent successfully!
          </div>
        )}

      </div>
      <Footer />
    </>
  );
};

export default MessageAdminSpoof;
