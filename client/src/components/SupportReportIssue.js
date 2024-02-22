import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import TopNav from "./TopNav";
import Footer from "./Footer";

export default function SupportReportIssue() {

    const [error, setError] = useState('');

    return (
        <>
        <TopNav />
        <div className="contentContainer utilityPage">

            <Card>
            <Card.Body>
                <Card.Title>👵CareFinder Support: <span className='CForange'>Report an Issue</span></Card.Title>
                <Card.Text>If you are experiencing any issues with our web site, please reach out to our team at XXX@CareFinder.com. We will get back wtih you promptly. Many Thanks! 🙏</Card.Text>
            </Card.Body>
            </Card>

        </div>
        <Footer />
        </>
    )

};

