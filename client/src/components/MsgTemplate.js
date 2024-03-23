import React, {useState} from 'react';
import { useAuth } from "../contexts/AuthContext";
import { getDoc, setDoc, doc, Timestamp } from 'firebase/firestore';
import { firestore } from '../firebase'; 


/**
 * FIREBASE 'messages' collection FIELDS:
 * ================================================================================
 * msgDate          Timestamp of message - import Timestamp from firebase/firestore
 *                  -- use Timestamp.now()
 * msgTo            userID of the recipient
 * msgFrom          userID of the sender
 * msgText          text of the message (cannot be empty)
 * msgNotified      0 (default) == user has NOT been notified (via text/whatever)
 *                  1 == user HAS been notified -- note, this is fo future development.
 * msgStatus        0 (default) == UNREAD message
 *                  1 == message marked as READ
 *                  2 == message marked as ARCHIVED
 * msgThreadID      initial value == millisecond timestamp via "new Date().getTime();"
 *                  then send this on all responses in the thread
 * msgParentID      default is blank
 *                  on responses, make this the ID of the msg being responded to
 * msgResponseSent  0 (default) == message was NOT responded to
 *                  1 == message WAS responded to
 */

// TESTING NOTES:
// JIM USER:      LXxo4pjrsSYgb3xmOfC4Loco8L03
// OTHER USERS:   LV6IbCIwMdbs5rMAp5Hb, EEQWegKrxbVQDZ4Ns0qEHDBar8J2, 0CFJRjjE8IcFmyJ11tT9cFq3UIV2
// M1: new Date('March 6, 2024 05:05:31').getTime() -- 1709730331000.
// M2: new Date('March 5, 2024 07:31:22').getTime() -- 1709652682000.
// M3: new Date('March 4, 2024 09:37:11').getTime() -- 1709573831000.
// M4: new Date('March 3, 2024 12:23:08').getTime() -- 1709497388000.
// M5: new Date('March 2, 2024 10:32:44').getTime() -- 1709404364000.

export default function MsgTemplate({passData, hasArchives}) {  
    
    console.log(passData);
    console.log('Archives?: '+hasArchives);

    function toggleHideByID(targetID) {
        var toggleTarget = document.getElementById(targetID); 
        if (toggleTarget.style.display === "none") {
            toggleTarget.style.display = "block"; 
        } else {
            toggleTarget.style.display = "none"; 
        }
        //return;
    }

    function toggleHideByClass(targetClass) {
        var elementArray = document.getElementsByClassName(targetClass); 
        // returns array, so...
        for (let i=0; i<elementArray.length; i++) {
            if (elementArray[i].style.display === "none") {
                elementArray[i].style.display = "block"; 
            } else {
                elementArray[i].style.display = "none"; 
            }
        }
    }

    function toggleMessages(targetID){
        //console.log( "TARGET: " + targetID ); 
        var bID = 'briefMsg' + targetID;
        //console.log( "BRIEF: " + bID ); 
        var toggleTarget = document.getElementById(bID);
        
        if ( toggleTarget.style.display == "block" ) {
            toggleTarget.style.display = "none";
        } else {
            toggleTarget.style.display = "block";
        }
        

        var fID = 'fullMsg' + targetID;
        //console.log( "FULL: " + fID ); 
        var toggleTarget = document.getElementById(fID);
        if (toggleTarget.style.display === "none") {
            toggleTarget.style.display = "block";
        } else {
            toggleTarget.style.display = "none";
        }
        
         return;
    }  

    function getMessageWrapperClass (theStatus){
        // replaces <div className="messageWrapper"> below
        if (theStatus === 1) {
            return 'messageWrapper messageRead';
        }
        if (theStatus === 2) {
            return 'messageWrapper messageArchived';
        }
        return 'messageWrapper';
    }

    const changeMessageStatus = async(targetMessageID, targetFieldValue) => {

        console.log('Set `messages` (id '+ targetMessageID + ') `msgStatus` to: ' + targetFieldValue ); 

        const dbCollection = firestore.collection('messages').doc(targetMessageID);
        
        const response = await dbCollection.update( {'msgStatus':targetFieldValue} );
        
        console.log(response);
        
        window.location.reload();
    }

    const changeMessageResponseSentStatus = async(targetMessageID, targetFieldValue) => {

        console.log('Set `messages` (id '+ targetMessageID + ') `msgResponseSent` to: ' + targetFieldValue ); 

        const dbCollection = firestore.collection('messages').doc(targetMessageID);
        
        const response = await dbCollection.update( {'msgResponseSent':targetFieldValue} );
        
        console.log(response);
        
    }

    const sendReply = async(sendingTo, sendingFrom, originalMessageID, messageThreadID) => {

        // text field is marked w/ a reply ID using "reply" and the Msg ID...
        let replyID = 'reply' + originalMessageID;
        let replyText = document.getElementById(replyID).value;
        if (!replyText) {
            alert('We cannot send this message, as no text was present. Please make sure to write a message. Thanks! :-)');
            return;
        }

        console.log('SENDING REPLY:  TO: ' + sendingTo + ', FROM: ' + sendingFrom + ', TXT: ' + replyText + ', THREAD: ' + messageThreadID + ')'); 

        const dbCollection = firestore.collection('messages');
        const response = await dbCollection.add({ 
            msgDate : Timestamp.now(),
            msgTo : sendingTo,
            msgFrom : sendingFrom,
            msgText : replyText,
            msgThreadID : messageThreadID,
            msgNotified : 0,
            msgStatus : 0,
            msgParentID : originalMessageID,
            msgResponseSent : 0
        });
        
        console.log(response);

        // mark on the original message that it was responded to:
        changeMessageResponseSentStatus(originalMessageID, 1);

        // also mark this original message as read:
        changeMessageStatus(originalMessageID, 1);
        console.log('MARKED message as READ, also. Kthx.'); 

        // I guess just refresh. Can we do this w/out a reload? No biggie if not...
        window.location.reload();
    }


    
    return (

      <>
        
        { hasArchives ?
            <>
            <div className='msgTopControls'><span onClick={()=> toggleHideByClass('messageArchived')}>👀 Show/Hide Archived</span></div>
            </> : <></>
        }

        {passData.map( thisMsg => (
                
                <div className={ getMessageWrapperClass(thisMsg['m_ST']) } style={{display:"block"}}>

                <p className="msgFrom">
                    <b>FROM:</b> 
                    <span className="CForange"> 
                        { thisMsg['m_RO'] + ' ' + thisMsg['m_DN'] }
                    </span>
                </p>

                <p className="msgDate">
                    <b>DATE:</b> <span className="CForange"> {thisMsg['m_DA']} </span>
                </p>

                <div className="clear"></div>

                { ( thisMsg['m_TXbExists'] == 1 ) ?
                    <> 
                        <div id={'briefMsg'+thisMsg['m_ID']} style={{display:"block"}}>
                            <p className="msgText msgBrief"><b>MESSAGE:</b> {thisMsg['m_TXb']}</p>
                        </div>
                        <div id={'fullMsg'+thisMsg['m_ID']} style={{display:"none"}}>
                            <p className="msgText msgFull"><b>MESSAGE:</b> {thisMsg['m_TX']}</p>
                        </div>
                    </>
                    :
                    <> 
                        <div id={'briefMsg'+thisMsg['m_ID']} style={{display:"none"}}>
                            <p className="msgText msgBrief"><b>MESSAGE:</b> {thisMsg['m_TXb']}</p>
                        </div>
                        <div id={'fullMsg'+thisMsg['m_ID']} style={{display:"block"}}>
                            <p className="msgText msgFull"><b>MESSAGE:</b> {thisMsg['m_TX']}</p>
                        </div>
                    </>
                }

                { ( thisMsg['m_RS'] == 1 ) ?
                    <> 
                        <p className="msgResponseInfo">(✅ You responded to this.)</p>
                    </> :
                    <>
                        <p className="msgResponseInfo">(⭕ You haven't yet responded to this).</p>
                    </>

                }


                <div className="msgReplyArea" id={thisMsg['m_ID']} style={{display:"none"}}>
                    <textarea autoFocus id={'reply'+thisMsg['m_ID']}></textarea>
                    <input value="SEND" onClick={() => sendReply(thisMsg['m_FR'], thisMsg['m_TO'], thisMsg['m_ID'], thisMsg['m_TH'])} name="B1" className="btn btn-primary"></input>
                    <button className="btn btn-info" onClick={()=> toggleHideByID(thisMsg['m_ID'])}>CANCEL</button>
                </div>

                <p className="msgActions">

                    { ( thisMsg['m_TXbExists'] == 1 ) &&
                        <> 
                            <a href="###" onClick={()=> toggleMessages(thisMsg['m_ID'])}>👀 Show/Hide Full Message</a>
                            &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
                        </>
                    }

                    { ( ( thisMsg['m_ST'] == 0 ) || ( thisMsg['m_ST'] == 1 ) ) &&
                        <>
                            <a href="###" onClick={()=> toggleHideByID(thisMsg['m_ID'])}>📝 Reply</a>
                            &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
                        </>
                    }

                    { (thisMsg['m_ST'] == 0) &&
                        <>
                            <a href="###" onClick={()=> changeMessageStatus(thisMsg['m_ID'], 1)}>✔️ Mark as read</a>
                            &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
                        </>
                    }
                    
                    { (thisMsg['m_ST'] == 1) &&
                        <>
                            <a href="###" onClick={()=> changeMessageStatus(thisMsg['m_ID'], 0)}>✅ Keep as new</a>
                            &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
                        </>
                    }

                    { ( ( thisMsg['m_ST'] == 0 ) || ( thisMsg['m_ST'] == 1 ) ) &&
                        <>
                            <a href="###"onClick={()=> changeMessageStatus(thisMsg['m_ID'], 2)}>🗑️ Archive</a>
                        </>
                    }

                    { (thisMsg['m_ST'] == 2) &&
                        <>
                            <a href="###"onClick={()=> changeMessageStatus(thisMsg['m_ID'], 1)}>🗑️ Unarchive</a>                        
                        </>
                    }
                    

                </p>

            </div>

        ))}

      </>

    );

}

