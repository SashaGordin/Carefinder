import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import TopNav from "./TopNav";
import Footer from "./Footer";

export default function CareFinderContactUs() {

    const [error, setError] = useState('');

    return (
        <>
        <TopNav />
        <div className="contentContainer utilityPage">

            <Card>
            <Card.Body>
                <Card.Title>👵CareFinder: <span className='CForange'>Contact Us</span></Card.Title>
                <Card.Text>[page tbd]</Card.Text>
            </Card.Body>
            </Card>

        </div>
        <Footer />
        </>
    )

};
