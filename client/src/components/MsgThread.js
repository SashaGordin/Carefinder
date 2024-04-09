import React, { useState, useEffect, useRef } from 'react';

import { useAuth } from "../contexts/AuthContext";
import { getDoc, doc } from 'firebase/firestore';
import { firestore } from '../firebase'; 

console.log('MsgThread component');

function MsgThread({threadID}) {

    const [entireThread, setEntireThread] = useState([]); 
    const { login, currentUser } = useAuth()

    useEffect(() => { fetchThread(); }, []);

    const fetchThread = async () => { 

        console.log('Fetching thread with ID '+ threadID);
        console.log('CurrentUser == ' + currentUser.uid);

        // grab messages in this thread starting with the earliest.
        const dbCollection = firestore.collection('messages');
        
        const threadMessages = await dbCollection.orderBy('msgDate', 'asc').where('msgThreadID', '==', threadID).get(); 

        if (!threadMessages.empty) {

            console.log(threadMessages);

            // FIRST, CONVERT ALL MESSAGES IN THIS THREAD INTO A LOCAL ARRAY
            // so that we can iterate via a normal for loop
            // (as foreach method will not allow awaits, which we will need)
            let localThreadArray = [];
            let localThreadIndex = 0;
            let  localThreadDateString,  localThreadDate;

            threadMessages.forEach ( thisThreadItem => { 

                if (!localThreadArray[localThreadIndex]) {localThreadArray[localThreadIndex]=[];}

                localThreadArray[localThreadIndex]["mt_ID"] = thisThreadItem.id;
                localThreadArray[localThreadIndex]["mt_FR"] = thisThreadItem.data()['msgFrom'];
                localThreadArray[localThreadIndex]["mt_TX"] = thisThreadItem.data()['msgText'];
                localThreadArray[localThreadIndex]["mt_TH"] = thisThreadItem.data()['msgThreadID'];
                localThreadArray[localThreadIndex]["mt_TO"] = thisThreadItem.data()['msgTo'];
                localThreadArray[localThreadIndex]["m_DS"] = thisThreadItem.data()['msgDate']['seconds'];
                localThreadDateString = thisThreadItem.data()['msgDate'];  // date string 
                localThreadDate = localThreadDateString.toDate().toLocaleString() 
                localThreadArray[localThreadIndex]["m_DA"] = localThreadDate;
                localThreadIndex++;

            });

            setEntireThread(localThreadArray);

            console.log(entireThread);

        } else {

            console.log('response empty');

        }

    }

    const msgThreadRef = useRef(null);

    useEffect(() => {
        // Scroll to the bottom of the container when the component mounts or updates
        if (msgThreadRef.current) {
          msgThreadRef.current.scrollTop = msgThreadRef.current.scrollHeight;
        }
      }, [entireThread]);

  return (

    <div className="msgThreadContainer" ref={msgThreadRef}>
        
        {entireThread.map((item, index) => (
            <div key={index}>
                {item.mt_FR === currentUser.uid ? (
                    <>
                    <div className="msgThreadDate msgThreadDateRight">{item.mt_DA}</div>
                    <div className="msgThreadBox msgThreadRecipient">{item.mt_TX}</div>
                    <div className="clear"></div>    
                    </>                    
                ) : (
                    <>
                    <div className="msgThreadDate msgThreadDateLeft">{item.mt_DA}</div>
                    <div className="msgThreadBox msgThreadSender">{item.mt_TX}</div>
                    <div className="clear"></div>
                    </>
                )}
            </div>
        ))}

    </div>

  );
}

export default MsgThread;
