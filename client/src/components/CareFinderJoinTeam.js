import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import TopNav from "./TopNav";
import Footer from "./Footer";

export default function SupportReportIssue() {

    return (
        <>
        <TopNav />
        <div className="contentContainer utilityPage">

            <Card>
            <Card.Body>
                <h2 style={{textAlign:'center'}}>Join Our Team</h2>
                <p style={{fontSize:20, margin:20, marginBottom:40}}>Interested in transforming lives with us? Email us at: CareFinderWA@Gmail.com with the headline "I need a job" and introduce yourself.</p>
                <p style={{textAlign:'center', margin:20}}> <a href="/" className="center-button">Okay</a></p>
            </Card.Body>
            </Card>



        </div>
        <Footer />
        </>
    )

};

