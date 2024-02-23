import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import TopNav from "./TopNav";
import Footer from "./Footer";

export default function SupportSuggestion() {

    const [error, setError] = useState('');

    return (
        <>
        <TopNav />
        <div className="contentContainer utilityPage">

            <Card>
            <Card.Body>
                <Card.Title>👵CareFinder Support: <span className='CForange'>Suggest an Improvement</span></Card.Title>
                <Card.Text>We always welcome and appreciate feedback! If you have a suggestion for something we can expand on or improve on our web site, please reach out to our team at XXX@CareFinder.com. We will get back wtih you promptly. Many Thanks! 🙏</Card.Text>
            </Card.Body>
            </Card>

        </div>
        <Footer />
        </>
    )

};

