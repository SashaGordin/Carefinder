import React, { useState } from 'react';
import { firestore } from '../firebase'; 
import { Timestamp } from 'firebase/firestore';
import TopNav from "../components/TopNav";
import Footer from "../components/Footer";

const UserSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [messageToID, setMessageToID] = useState(null);
  const [messageSent, setMessageSent] = useState(false);

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(null, args);
      }, delay);
    };
  };

  const handleSearch = debounce(async (searchTerm) => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      return;
    }

    try {
      const querySnapshot = await firestore.collection('users')
        .where('email', '>=', searchTerm)
        .where('email', '<=', searchTerm + '\uf8ff')
        .get();

      const results = [];
      querySnapshot.forEach(doc => {
        results.push({ id: doc.id, email: doc.data().email });
      });
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  }, 300);

  const handleChange = (e) => {
    const value = e.target.value;
    setMessageToID(null);
    setSearchTerm(value);
    handleSearch(value);
  };

  const handleSelectUser = (userId) => {
    const currentUserID = localStorage.getItem('localStorageCurrentUserID');
    if (userId==currentUserID){
        alert('You cannot send yourself a message. Kthx. :-)');
        return;
    }
    setMessageToID(userId);
    setSearchTerm('');
    setSearchResults([]);
  };

  const sendMessage = async () => {
    const currentUserID = localStorage.getItem('localStorageCurrentUserID');

    if (messageToID === currentUserID) {
      alert('You cannot send yourself a message. Kthx. :-)');
      return; 
    }

    const messageText = document.getElementById('messageTextArea').value;
    const messageThreadID = new Date().getTime();

    console.log('SENDING REPLY: TO:', messageToID, 'FROM:', currentUserID, 'TXT:', messageText, 'THREAD:', messageThreadID);

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
    setMessageToID(null);
    document.getElementById('messageTextArea').value = '';
    setTimeout(() => setMessageSent(false), 5000); // Hide message sent alert after 5 seconds
  };

  return (
    <>
      <TopNav />
      <div className="contentContainer utilityPage">

        <h1>ADMINS ONLY:</h1>
        <h2>Find a User to Send a Message To:</h2>

        <input 
          type="text" 
          value={searchTerm} 
          onChange={handleChange} 
          placeholder="Search by email address, and then select user below:" 
          style={{ width: 500 }}
        />
        {searchResults.map(user => (
          <div key={user.id}>
            <input 
              type="radio" 
              id={user.id} 
              name="userRadio" 
              onChange={() => handleSelectUser(user.id)} 
              checked={messageToID === user.id}
            /> &nbsp; 
            <label htmlFor={user.id}>{user.email}</label>
          </div>
        ))}
        {messageToID && !messageSent && (
          <>
            <p>Cool let's send a message to CareFinder User ID: <b>{messageToID}</b></p>
            <textarea id="messageTextArea" style={{ width: 500, height: 300 }}></textarea><br></br>
            <button onClick={sendMessage}>SEND</button>
          </>
        )}
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

export default UserSearch;
