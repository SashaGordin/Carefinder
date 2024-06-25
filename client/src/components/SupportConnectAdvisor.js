import React from 'react';
import { Card } from 'react-bootstrap';
import TopNav from "./TopNav";
import Footer from "./Footer";

export default function SupportConnectAdvisor() {


    return (
        <>
        <TopNav />
        <div className="contentContainer utilityPage">

            <Card>
            <Card.Body>
                <Card.Title>👵CareFinder Support: <span className='CForange'>Connect with an Advisor</span></Card.Title>
                <Card.Text>If you are need to connect with a CareFinder advisor, please reach out to our team at XXX@CareFinder.com. We will get back wtih you promptly. Many Thanks! 🙏</Card.Text>
            </Card.Body>
            </Card>

        </div>
        <Footer />
        </>
    )

};

