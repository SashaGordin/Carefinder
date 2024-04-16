import React, { useState } from 'react'
import { Image } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';

// THIS PAGE IS:  /care-provider
import Accordion from 'react-bootstrap/Accordion';
import YoutubeEmbed from "../components/YoutubeEmbed";
import TopNav from "../components/TopNav";
import Footer from "../components/Footer";

// NOTE: This page imports Footer.js, which I think we should import on all pages. I think we should handle the nav bar in this same way, so that we can have a Navbar file that can do the menu system, and we can then import it into all pages in a tidy mnner.

// import logo from '../assets/Group.png';
// import background from '../assets/Rectangle_7.png';


export default function CPLandingPage() {
  const [error] = useState('')
  const navigate = useNavigate();

  return (
    <>

      <TopNav />

      <div className="CProw1 CFgrayBackground">
        <div className="contentContainer">
          <div className="left60">
            <h1 className='CFpink'>Don't overpay for senior referrals</h1>
            <p>No commission, no absurd placement fees. Built by care providers for care providers.</p>
            <button type="button" className="btn btn-dark">Claim Profile</button>
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
            <button type="button" className="btn btn-secondary">Claim Profile</button>
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
            <button type="button" className="btn mostPopular">Most popular</button>
            <div className="clear"></div>
            <p className="CPchoiceLevel">Try us out</p>
            <p className="CPchoicePrice">List your AFH</p>
            <p className="CPchoiceSubhead">Risk-free</p>
            <p className="CPboxText">By listing your AFH, make it visible to all seniors seeking care at no cost. Once you've welcomed your first private pay resident, your premium membership will be activated.</p>
            <button type="button" className="btn btn btn-dark">Review agreement</button>
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
              <Accordion.Header>Why Carefinder?</Accordion.Header>
              <Accordion.Body>Carefinder addresses the shortcomings of traditional senior referral and placement agencies, offering transparency and unbiased guidance. We empower families to make informed decisions while providing a cost-effective solution for care providers.</Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>What is Carefinder?</Accordion.Header>
              <Accordion.Body>Carefinder is an online marketplace connecting families with pre-qualified care providers, such as senior living facilities and adult family homes. We're not a referral agency but a listing service facilitating personalized matches, quotes, tours scheduling, and unbiased guidance.</Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2">
              <Accordion.Header>How does it work?</Accordion.Header>
              <Accordion.Body>CareFinder connects care providers with families seeking care in Adult Family Home settings. Simply create an account, list your AFH, and receive messages, quote requests, and tour scheduling from interested families.</Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="3">
              <Accordion.Header>What is the difference between non-members and members?</Accordion.Header>
              <Accordion.Body>Non-members secure a new resident at no upfront cost. After 30 days, if the resident stays, we charge an annual membership fee of $1,800, offering unlimited access for 12 months.</Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="4">
              <Accordion.Header>How is Carefinder unbiased?</Accordion.Header>
              <Accordion.Body>Matches are based on a proprietary algorithm, and our advisors are not paid on commission, ensuring 100% unbiased guidance.</Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="5">
              <Accordion.Header>Why is Carefinder better for the industry?</Accordion.Header>
              <Accordion.Body>We prioritize seniors' well-being by providing unbiased guidance. For care providers, it's a low-cost, annual flat fee to access a lead generation powerhouse.</Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="6">
              <Accordion.Header>What if I change my mind about a resident?</Accordion.Header>
              <Accordion.Body>While we encourage communication, ultimately, your home operates by your rules. Families can find a new home, and our support team can assist.</Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="7">
              <Accordion.Header>What if the family wants to move their senior?</Accordion.Header>
              <Accordion.Body>No charge within 30 days, after which there's a fee. However, with our model, you can always land your next resident at no extra cost.</Accordion.Body>
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