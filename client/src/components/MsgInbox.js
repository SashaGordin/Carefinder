import React, { useState, useEffect } from 'react';
import TopNav from "./TopNav";
import Footer from "./Footer";

import { useAuth } from "../contexts/AuthContext";
import { getDoc, doc } from 'firebase/firestore';
import { firestore } from '../firebase'; 

//import MsgTemplate from "./MsgTemplate";
import MsgTemplateMVP from "./MsgTemplateMVP";

//v20240430.837pm
export default function MsgInbox() {

    const [error, setError] = useState('');
    const {login, currentUser } = useAuth()
    const [userMessages, setUserMessages] = useState([]); 
    const [loading, setLoading] = useState(false);
    const [containsArchives, setContainsArchives] = useState(0);
    useEffect(() => { return; }, [containsArchives]);

    useEffect(() => { fetchMessages(); }, []);

    const fetchMessages = async () => {
        let configs_msgTruncateLimit = 100;
    
        const dbCollection = firestore.collection('messages');
        const response = await dbCollection
            .where('msgTo', '==', currentUser.uid)
            .orderBy('msgStatus', 'asc')
            .orderBy('msgDate', 'desc')
            .get();
    
        let messageAreaHTML = '';
    
        if (!response.empty) {
            // Create a Map to store unique messages based on msgThreadID
            let uniqueMessagesMap = new Map();
    
            response.forEach(thisMsg => {
                const msgThreadID = thisMsg.data()['msgThreadID'];
                if (!uniqueMessagesMap.has(msgThreadID)) {
                    uniqueMessagesMap.set(msgThreadID, {
                        m_ID: thisMsg.id,
                        m_TO: thisMsg.data()['msgTo'],
                        m_FR: thisMsg.data()['msgFrom'],
                        m_TX: thisMsg.data()['msgText'],
                        m_TY: thisMsg.data()['msgType'],
                        m_TXbExists: thisMsg.data()['msgText'].length > configs_msgTruncateLimit ? 1 : 0,
                        m_TXb: thisMsg.data()['msgText'].length > configs_msgTruncateLimit ? thisMsg.data()['msgText'].substring(0, configs_msgTruncateLimit) + '...' : '',
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
    
                    if (thisMsg.data()['msgStatus'] == 2 && containsArchives == 0) {
                        setContainsArchives(1);
                        console.log('SET ARCHIVE TO 1');
                    }
                }
            });
    
            let localResponseArray = Array.from(uniqueMessagesMap.values());
    
            for (let i = 0; i < localResponseArray.length; i++) {
                // Fetch additional details for each message
                const lookupUserTable = firestore.collection('users').doc(localResponseArray[i]["m_FR"]);
                const response2 = await lookupUserTable.get();
    
                if (response2.exists) {
                    const role = response2.data()['role'];
                    localResponseArray[i]["m_RO"] = role === 'client' ? 'a CF user' :
                                                    role === 'provider' ? 'a CF provider' :
                                                    role === 'admin' ? 'a CF admin' :
                                                    'a CF User';
    
                    if (response2.data()['displayName']) {
                        localResponseArray[i]["m_DN"] = ' (' + response2.data()['displayName'] + ')';
                    }
                } else {
                    localResponseArray[i]["m_DN"] = 'a CF User';
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

                <MsgTemplateMVP passData={userMessages} hasArchives={containsArchives} />

                <div className="clear"></div>

        </div>
        <Footer />
        </>
    )

};

