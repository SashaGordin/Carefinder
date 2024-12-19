import React, { useState, useEffect } from 'react';
import TopNav from './TopNav';
import Footer from './Footer';

import { useAuth } from '../contexts/AuthContext';
import { firestore } from '../firebase';
import { Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

//import MsgTemplate from "./MsgTemplate";
import MsgTemplateMVP from './MsgTemplateMVP';

//v20240430.837pm
export default function MsgInbox() {
  const [userMessages, setUserMessages] = useState([]);
  const { currentUser } = useAuth();
  const [hasMessages, setHasMessages] = useState(0);

  const navigate = useNavigate();
  const handleButtonClick = () => {
    navigate('/');
  };

  const [containsArchives, setContainsArchives] = useState(0);
  useEffect(() => {
    return;
  }, [containsArchives]);

  // eslint-disable-next-line
  useEffect(() => {
    fetchMessages();
  }, []); // added that empty array, as it was causing issues without!

  const fetchMessages = async () => {
    let configs_msgTruncateLimit = 100;

    const dbCollection = firestore.collection('messages');
    const response = await dbCollection
      .where('msgTo', '==', currentUser.uid)
      .orderBy('msgStatus', 'asc')
      .orderBy('msgDate', 'desc')
      .get();

    //let messageAreaHTML = '';

    if (!response.empty) {
      setHasMessages(1);
      // Create a Map to store unique messages based on msgThreadID
      let uniqueMessagesMap = new Map();

      response.forEach((thisMsg) => {
        const msgThreadID = thisMsg.data()['msgThreadID'];
        if (!uniqueMessagesMap.has(msgThreadID)) {
          uniqueMessagesMap.set(msgThreadID, {
            m_ID: thisMsg.id,
            m_TO: thisMsg.data()['msgTo'],
            m_FR: thisMsg.data()['msgFrom'],
            m_TX: thisMsg.data()['msgText'],
            m_TY: thisMsg.data()['msgType'],
            m_TXbExists:
              thisMsg.data()['msgText'].length > configs_msgTruncateLimit
                ? 1
                : 0,
            m_TXb:
              thisMsg.data()['msgText'].length > configs_msgTruncateLimit
                ? thisMsg
                    .data()
                    ['msgText'].substring(0, configs_msgTruncateLimit) + '...'
                : '',
            m_DS: thisMsg.data()['msgDate']['seconds'],
            m_DA: thisMsg.data()['msgDate'].toDate().toLocaleString(),
            m_NO: thisMsg.data()['msgNotified'],
            m_ST: thisMsg.data()['msgStatus'],
            m_TH: thisMsg.data()['msgThreadID'],
            m_PI: thisMsg.data()['msgParentID'],
            m_RS: thisMsg.data()['msgResponseSent'],
            m_DN: '',
            m_RO: '',
          });

          if (thisMsg.data()['msgStatus'] === 2 && containsArchives === 0) {
            setContainsArchives(1);
            console.log('SET ARCHIVE TO 1');
          }
        }
      });

      let localResponseArray = Array.from(uniqueMessagesMap.values());

      for (let i = 0; i < localResponseArray.length; i++) {
        // Fetch additional details for each message
        const lookupUserTable = firestore
          .collection('users')
          .doc(localResponseArray[i]['m_FR']);
        const response2 = await lookupUserTable.get();

        if (response2.exists) {
          const role = response2.data()['role'];

          // SET m_RO to something generic
          localResponseArray[i]['m_RO'] =
            role === 'client'
              ? 'a CF user'
              : role === 'provider'
                ? 'a CF provider'
                : role === 'admin'
                  ? 'a CF admin'
                  : 'a CF User';

          // UPDATE: but now we actually want a name here... (using POC for Providers)
          if (response2.data()['FacilityPOC']) {
            localResponseArray[i]['m_RO'] = response2.data()['FacilityPOC'];
          }

          if (response2.data()['displayName']) {
            localResponseArray[i]['m_DN'] =
              ' (' + response2.data()['displayName'] + ')';
          }
        } else {
          localResponseArray[i]['m_DN'] = 'a CF User';
          console.log('No such document!');
        }
      }

      setUserMessages(localResponseArray);
    } else {
      console.log('No matching documents.');
    }
  };

  return (
    <>
      <TopNav />
      <div className="contentContainer utilityPage">
        {hasMessages === 1 && (
          <>
            <MsgTemplateMVP
              passData={userMessages}
              hasArchives={containsArchives}
            />
            <div className="clear"></div>
          </>
        )}
        {hasMessages === 0 && (
          <>
            <div className="contentContainer utilityPage">
              <Card>
                <Card.Body>
                  <Card.Title style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '40px' }}>
                      You don't have any messages.
                    </span>
                  </Card.Title>
                  <Card.Text style={{ textAlign: 'center' }}>
                    Try again later. 🙏
                  </Card.Text>
                  <div style={{ textAlign: 'center' }}>
                    <button
                      type="button"
                      className="center-button"
                      onClick={handleButtonClick}
                    >
                      Okay
                    </button>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  );
}
