import React, {useState} from 'react';
import { useAuth } from "../contexts/AuthContext";
import { getDoc, setDoc, doc, Timestamp } from 'firebase/firestore';
import { firestore } from '../firebase'; 

export default function MsgTemplate({passData}) {  
    
    console.log(passData);

    function toggleHide(targetID) {
        var toggleTarget = document.getElementById(targetID); 
        if (toggleTarget.style.display === "none") {
            toggleTarget.style.display = "block"; 
        } else {
            toggleTarget.style.display = "none"; 
        }
        //return;
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
        
        const response3 = await dbCollection.update( {'msgStatus':targetFieldValue} );
        
        console.log(response3);
        
        window.location.reload();
    }

    const sendReply = async(sendingTo, sendingFrom, originalMessageID, messageThreadID) => {

        // text field is marked w/ a reply ID using "reply" and the Msg ID...
        let replyID = 'reply' + originalMessageID;
        let replyText = document.getElementById(replyID).value;

        console.log('SENDING REPLY:  TO: ' + sendingTo + ', FROM: ' + sendingFrom + ', TXT: ' + replyText + ', THREAD: ' + messageThreadID + ')'); 

        const dbCollection = firestore.collection('messages');
        const response3 = await dbCollection.add({ 
            msgDate : Timestamp.now(),
            msgTo : sendingTo,
            msgFrom : sendingFrom,
            msgText : replyText,
            msgThreadID : messageThreadID,
            msgNotified : 0,
            msgStatus : 0
        });
        
        console.log(response3);

        // also mark this original message as read, too...
        changeMessageStatus(originalMessageID, 1);
        console.log('MARKED message as READ, also. Kthx.'); 

        // I guess just refresh. Can we do this w/out a reload? No biggie if not...
        window.location.reload();
    }



    return (

      <>
        
        {passData.map( thisMsg => (
                
                <div className={ getMessageWrapperClass(thisMsg['m_ST']) }>

                <p className="msgFrom">
                    <b>FROM:</b> <span className="CForange"> {thisMsg['m_FR']} </span>
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

                <div className="msgReplyArea" id={thisMsg['m_ID']} style={{display:"none"}}>
                    <textarea autoFocus id={'reply'+thisMsg['m_ID']}></textarea>
                    <input type="submit" value="SEND" onClick={() => sendReply(thisMsg['m_FR'], thisMsg['m_TO'], thisMsg['m_ID'], thisMsg['m_TH'])} name="B1" className="btn btn-info"></input>
                    <button className="btn btn-primary" onClick={()=> toggleHide(thisMsg['m_ID'])}>CANCEL</button>
                </div>

                <p className="msgActions">

                    { ( thisMsg['m_TXbExists'] == 1 ) &&
                        <> 
                            <a href="###" onClick={()=> toggleMessages(thisMsg['m_ID'])}>👀 Show/Hide Full Message</a>
                            &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
                        </>
                    }

                    <a href="###" onClick={()=> toggleHide(thisMsg['m_ID'])}>📝 Reply</a>
                    &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;

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


                    <a href="###"onClick={()=> changeMessageStatus(thisMsg['m_ID'], 2)}>🗑️ Archive</a>

                </p>

            </div>

        ))}

      </>

    );

}

