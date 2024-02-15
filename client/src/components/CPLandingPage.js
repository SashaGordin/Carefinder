import React, { useState } from 'react'
import { Card, Button, Alert, Navbar, Image } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom';

// THIS PAGE IS:  /care-provider
import Accordion from 'react-bootstrap/Accordion';
import YoutubeEmbed from "./YoutubeEmbed";
import Footer from "./Footer";

// NOTE: This page imports Footer.js, which I think we should import on all pages. I think we should handle the nav bar in this same way, so that we can have a Navbar file that can do the menu system, and we can then import it into all pages in a tidy mnner.

// import logo from '../assets/Group.png';
// import background from '../assets/Rectangle_7.png';


export default function CPLandingPage() {
  const [error] = useState('')
  const navigate = useNavigate();

  return (
    <>
      <Navbar bg="dark" fixed="top">
        <div className="contentContainer">
          <Image src='cflogo.png' alt="Welcome to CareFinder" />
          <Navbar.Brand>Carefinder</Navbar.Brand>
          <p>We will likely have some sort of bootstrap menu here, so will set the component and CSS separately when we get to that.</p>
        </div>
      </Navbar>

      <div className="CProw1 CFgrayBackground">
        <div className="contentContainer">
          <div className="left60">
            <h1 className='CFpink'>Don't overpay for senior referrals</h1>
            <p>No commission, no absurd placement fees. Built by care providers for care providers.</p>
            <button type="button" class="btn btn-dark">Claim Profile</button>
          </div>
          <div className="right40">
            <Image src='cooking.jpg' alt="Welcome to CareFinder" />
          </div>
          <div className="clear"></div>
        </div>
      </div>

      <div className="CProw2 CFblackBackground">
        <div className="contentContainer">
        <div className="left40">
          <YoutubeEmbed embedId="dQw4w9WgXcQ" />
          </div>
          <div className="right60">
            <p>Thanks to modern technology, families don't need senior advisors to determine cost of care, search for homes, or find comparable options.</p>
            <p>Yet traditional senior advisors still want you to pay 100% of the first month's rent like you did before the internet.</p>
            <p>At Carefinder, we want you to keep what you've earned, have a better experience, and get all the benefits that come with an advisor -- all for a low flar annual membership fee.</p>
            <button type="button" class="btn btn-secondary">Claim Profile</button>
          </div>
          <div className="clear"></div>
        </div>
      </div>

      <div className="CProw3 CFpinkBackground">
        <div className="contentContainer">
          <p>Your membership fee is not due until you land your first resident who stays more than 30 days!</p>
        </div>
      </div>

      <div className="CProw4 CFblackBackground">
        <div className="contentContainer">

          <div className="CPchoiceBox CFgrayBackground">
            <button type="button" class="btn mostPopular">Most popular</button>
            <div className="clear"></div>
            <p className="CPchoiceLevel">Try us out</p>
            <p className="CPchoicePrice">List your AFH</p>
            <p className="CPchoiceSubhead">Risk-free</p>
            <p className="CPboxText">By listing your AFH, make it visible to all seniors seeking care at no cost. Once you've welcomed your first private pay resident, your premium membership will be activated.</p>
            <button type="button" class="btn btn btn-dark">Review agreement</button>
          </div>

          <div className="CPchoiceBox CFgrayBackground">
            <p className="CPchoiceLevel CForange">Premium Membership</p>
            <p className="CPchoicePrice">$150/month</p>
            <p className="CPchoiceSubhead">Unlimited access</p>
            <p className="CPboxText">Regardless if you need one room filled of the entire house. Our annual membership fee covers it all (per license).</p>
            <p className="CPchoiceTerms">Membership fee is an annual agreement of $1,800 broken up over 12 months.</p>
          </div>

          <div className="CPchoiceBox CFgrayBackground allGrayText">
            <p className="CPchoiceLevel">Traditional Model</p>
            <p className="CPchoicePrice">100% of first month's rent</p>
            <p className="CPchoiceSubhead">Never again</p>
            <p className="CPboxText">Nobody wants to work an entire month for free.</p>
            <p className="CPchoiceTerms">Fun fact: On average, it would take roughly 5.5 years of paying for a Carefinder membership to equal one transaction with the traditional options.</p>
          </div>

          <div className="clear"></div>

        </div>
      </div>

      <div className="CProw5 CFblackBackground">
        <div className="contentContainer">

          <h2>Frequently asked questions</h2>
          <Accordion>
            <Accordion.Item eventKey="0">
              <Accordion.Header>How does it work?</Accordion.Header>
              <Accordion.Body>[Micah needs to write this answer.]</Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>What is the difference between <span className="CForange">nonmember</span> & <span className="CFpink">members?</span></Accordion.Header>
              <Accordion.Body>[Micah needs to write this answer.]</Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2">
              <Accordion.Header>How is Carefinder unbiased?</Accordion.Header>
              <Accordion.Body>[Micah needs to write this answer.]</Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="3">
              <Accordion.Header>Why is Carefinder better for the industry?</Accordion.Header>
              <Accordion.Body>[Micah needs to write this answer.]</Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="4">
              <Accordion.Header>What if I change my mind?</Accordion.Header>
              <Accordion.Body>[Micah needs to write this answer.]</Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="5">
              <Accordion.Header>What if the family wants their senior moved?</Accordion.Header>
              <Accordion.Body>[Micah needs to write this answer.]</Accordion.Body>
            </Accordion.Item>
          </Accordion>

        </div>
      </div>

    <Footer />

     {/*
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Dashboard</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <strong>Email:</strong>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        <Button variant="link" onClick={() => navigate('/claim-profile')}>
          Claim Profile
        </Button>
      </div>
       */}
    </>
  )
};