import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from "../contexts/AuthContext";
import { firestore } from '../firebase'; 


// NOTE: UPON LAUNCH, UPDATE 'validLinkSubstring' with something that will
// prove that a link to an assessment is authentic.

/**
 * 
 * Script is similar to MsgThread-bak.js, only 
 * this one (the live one) uses the onSnapshot method 
 * to listen to changes to the database, thus offering 
 * realtime messaging. See:
 * https://firebase.google.com/docs/firestore/query-data/listen
 * 
 * 
 * 
 *  */ 

function MsgThread({threadID, pageIteration}) {

    console.log('NOW IN... MsgThread');
    console.log('MsgThread Iteration: '+pageIteration);

    const [entireThread, setEntireThread] = useState([]); 
    const { currentUser } = useAuth();
    const msgThreadRef = useRef(null);

    useEffect(() => {

        // I want to ensure that all links that we present as links to users in the chat are
        // authentic. So, I will check to see that they contain the following substring:
        const validLinkSubstring = 'https://firebasestorage.googleapis.com/v0/b/carefinder-development.appspot.com';

        const dbCollection = firestore.collection('messages')
            .orderBy('msgDate', 'asc')
            .where('msgThreadID', '==', threadID);

        const unsubscribe = dbCollection.onSnapshot(snapshot => {
            if (!snapshot.empty) {
                let localThreadArray = [];
                snapshot.forEach(thisThreadItem => {

                    // Process each document in the snapshot
                    let threadItemData = thisThreadItem.data();

                    // process for special new types...
                    // meet, quote, tour -- mainly process links in text here...
                    if (threadItemData.msgType == 'quote') {

                        console.log('MessageThread Iteration: Quote request')

                        const linkRegex = new RegExp(validLinkSubstring, 'i');
                        const validLinkPresent = linkRegex.test(threadItemData.msgText);
                        
                        if (validLinkPresent){
                            const urlRegex = /(https?:\/\/[^\s]+)/g;
                            const tempURL = threadItemData.msgText.match(urlRegex)[0];
                            threadItemData.msgText = threadItemData.msgText.replace(urlRegex, `<a href="${tempURL}" target="_blank">💾 <b>DOWNLOAD ASSESSMENT LINK</b></a>`);
                        }

                    }
                    
                    localThreadArray.push({
                        mt_ID: thisThreadItem.id,
                        mt_FR: threadItemData.msgFrom,
                        mt_TX: threadItemData.msgText,
                        mt_TH: threadItemData.msgThreadID,
                        mt_TO: threadItemData.msgTo,
                        mt_DS: threadItemData.msgDate.seconds,
                        mt_DA: threadItemData.msgDate.toDate().toLocaleString(),
                        mt_TY: threadItemData.msgType
                    });
                    
                });
                setEntireThread(localThreadArray);
            } else {
                setEntireThread([]); // No messages found, clear the thread
            }
        });

        return () => unsubscribe(); // Unsubscribe from snapshot listener when component unmounts or changes
    }, [threadID]);

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
                        <div className="msgThreadBox msgThreadRecipient">
                            <span dangerouslySetInnerHTML={{ __html: item.mt_TX }}></span>
                        </div>
                        <div className="clear"></div>    
                        </>                    
                    ) : (
                        <>
                        <div className="msgThreadDate msgThreadDateLeft">{item.mt_DA}</div>
                        <div className="msgThreadBox msgThreadSender">
                            <span dangerouslySetInnerHTML={{ __html: item.mt_TX }}></span>
                        </div>
                        <div className="clear"></div>
                        </>
                    )}
                </div>
            ))}
        </div>
    );
}

export default MsgThread;
