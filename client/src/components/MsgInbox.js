import React, { useState, useEffect } from 'react';
import TopNav from "./TopNav";
import Footer from "./Footer";

import { useAuth } from "../contexts/AuthContext";
import { getDoc, doc } from 'firebase/firestore';
import { firestore } from '../firebase'; 
import MsgTemplate from "./MsgTemplate";


export default function MsgInbox() {

    const [error, setError] = useState('');
    const { login, currentUser } = useAuth()
    const [userMessages, setUserMessages] = useState([]); 
    const [loading, setLoading] = useState(false);

    useEffect(() => { fetchMessages(); }, []);

    const fetchMessages = async () => {
        
        let configs_msgTruncateLimit = 100;

        const dbCollection = firestore.collection('messages');
        const response = await dbCollection.where('msgTo', '==', currentUser.uid).get(); 
        // Note, I think we can order the queries, like so:
        // .orderBy('msgStatus').orderBy('msgDate', 'desc')
        // but it requires we do an index. We can add this later, as Google kicked me out when I tried.

        let messageAreaHTML ='';

        if (!response.empty) {

            // FIRST, CONVERT ALL MESSAGES TO A LOCAL ARRAY
            // so that we can iterate via a normal for loop
            // (as foreach method will not allow awaits, which we will need)

            let localResponseArray = [];
            let localResponseIndex = 0;
            let localMessageDateString, localMessageDate;

            response.forEach( thisMsg => { 

                if (!localResponseArray[localResponseIndex]) {localResponseArray[localResponseIndex]=[];}
                localResponseArray[localResponseIndex]["m_ID"] = thisMsg.id;
                localResponseArray[localResponseIndex]["m_TO"] = thisMsg.data()['msgTo'];
                localResponseArray[localResponseIndex]["m_FR"] = thisMsg.data()['msgFrom'];
                localResponseArray[localResponseIndex]["m_TX"] = thisMsg.data()['msgText'];

                // BRIEF VERSION?
                localResponseArray[localResponseIndex]["m_TXbExists"] = 0;
                if (thisMsg.data()['msgText'].length > configs_msgTruncateLimit) {
                    localResponseArray[localResponseIndex]["m_TXb"] = thisMsg.data()['msgText'].substring(0,configs_msgTruncateLimit) + '...';
                    localResponseArray[localResponseIndex]["m_TXbExists"] = 1;
                }

                // stroe date as timestamp (seconds only) and also as readable date
                localResponseArray[localResponseIndex]["m_DS"] = thisMsg.data()['msgDate']['seconds'];
                localMessageDateString = thisMsg.data()['msgDate'];  // date string 
                localMessageDate = localMessageDateString.toDate().toLocaleString() 
                localResponseArray[localResponseIndex]["m_DA"] = localMessageDate;

                localResponseArray[localResponseIndex]["m_NO"] = thisMsg.data()['msgNotified'];
                localResponseArray[localResponseIndex]["m_ST"] = thisMsg.data()['msgStatus'];
                localResponseArray[localResponseIndex]["m_TH"] = thisMsg.data()['msgThreadID'];
                localResponseIndex++;

            });
            
            
            for (let i=0; i<localResponseArray.length; i++) { 

                // ok let's add to this by getting the FROM user's name and role and whatnot...
                const lookupUserTable = firestore.collection('users').doc(localResponseArray[i]["m_FR"]);
                const response2 = await lookupUserTable.get();                 
                
                // ok we've got a response...
                if (!response2.empty) {

                    // if role is defined, let's use that first..
                    if (response2.data()['role']) {

                        if ( response2.data()['role'] =='client'   ) { localResponseArray[i]["m_RO"] = 'a CF user'; }
                        if ( response2.data()['role'] =='provider' ) { localResponseArray[i]["m_RO"] = 'a CF provider'; }
                        if ( response2.data()['role'] =='admin'    ) { localResponseArray[i]["m_RO"] = 'a CF admin'; }

                    } else {
                        console.log('User nonexistent or no role field!');
                        localResponseArray[i]["m_RO"] = 'a CF User';
                    }

                    // and let's look for a display name, too...
                    if (response2.data()['displayName']) {

                        localResponseArray[i]["m_DN"] = ' (' + response2.data()['displayName'] + ')';

                    }

                } else {

                    // no response, so just a generic from line...
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

            <h2>Messaging Center</h2>

            <p>for CareFinder Member with the email {currentUser.email}</p> 

            <hr></hr>

            <MsgTemplate passData={userMessages} />

            <div className="clear"></div>
            <hr></hr>

            {/* 
            {userMessages.map((thisMsg) => (
                <>
                <li>MSGID: {thisMsg['m_ID']}</li>
                <li>MSGTO: {thisMsg['m_TO']}</li>
                <li>MSGFR: {thisMsg['m_FR']}</li>
                <li>MSGTX: {thisMsg['m_TX']}</li>
                <li>MSGDS: {thisMsg['m_DS']}</li>
                <li>MSGDA: {thisMsg['m_DA']}</li>
                <li>MSGNO: {thisMsg['m_NO']}</li>
                <li>MSGST: {thisMsg['m_ST']}</li>
                <li>MSGTH: {thisMsg['m_TH']}</li>                
                </>
            ))}
            */}

        </div>
        <Footer />
        </>
    )

};

