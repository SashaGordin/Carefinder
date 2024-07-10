import React from 'react';
import { Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

// THIS PAGE IS:  /care-provider
import Accordion from 'react-bootstrap/Accordion';
import YoutubeEmbed from "../components/YoutubeEmbed";
import TopNav from "../components/TopNav";
import Footer from "../components/Footer";


export default function CPLandingPage() {

  const listStyle = { listStyleType: 'none', padding: 0 };
  const listItemStyle = { position: 'relative', paddingLeft: '40px', marginBottom: '10px' };
  const checkmarkStyle = { content: '"\\2713"',  position: 'absolute', left: 0, color: '#ff6699' };

  const navigate = useNavigate();
  const handleButtonClick = () => {
    navigate('/claim-profile');
  };


  return (
    <>

      <TopNav />

      <div className="CProw1 CFgrayBackground">
        <div className="contentContainer">

        <div className="CPhomeTopBackground">

            <div className="left60">

              <h1 className='CFpink'>Don't overpay for senior referrals</h1>
              <p>No absurd placement fees. Built by and for AFDH care providers. Land private pay seniors, risk free.</p>
              <button type="button" className="btn btn-dark" onClick={handleButtonClick}>Claim Profile</button>

            </div>

            <div className="right40">
              &nbsp;
            </div>

            <div className="clear"></div>

            </div>

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
            <button type="button" className="btn btn-secondary" onClick={handleButtonClick}>Claim Profile</button>
          </div>
          <div className="clear"></div>
        </div>
      </div>

      <div className="CProw3 CFpinkBackground">
        <div className="contentContainer">
          <p>Your subscription fee is not due until you land your first resident who stays more than 30 days!</p>
        </div>
      </div>

      <div className="CProw4 CFblackBackground">
        <div className="contentContainer">

          <div className="CPchoiceBox CFgrayBackground">
            <button type="button" className="btn mostPopular">Start here</button>
            <div className="clear"></div>
            <p className="CPchoiceLevel">Try us out</p>
            <p className="CPchoicePrice">List your AFH</p>
            <p className="CPchoiceSubhead">Free</p>
            <p className="CPboxText">By listing your AFH, make it visible to all seniors seeking care at no cost. Once you've welcomed your first private pay resident, your subscription will be activated.</p>
            <button type="button" className="btn btn btn-dark button2">Review agreement</button>
          </div>

          <div className="CPchoiceBox CPchoiceBox2 CFgrayBackground">
            <p className="CPchoiceLevel CForange">Subscription</p>
            <p className="CPchoicePrice">$100/month</p>
            <p className="CPboxText">Secure a private pay resident, after 30 days your subscription activates. We charge $100/month for 24 months per successful booking. ($2,400 max)</p>
            <p style={{textAlign:'left',fontWeight:'bold'}}>Pro's:</p>

            <style> {`.custom-checkmark-list li::before { content: '\\2713'; position: absolute; left: 0; color: #ff6699;}`}</style>
                <ul style={listStyle} className="custom-checkmark-list">
                  <li style={listItemStyle}>No large upfront fees or commission.</li>
                  <li style={listItemStyle}>Spread your payments over 24 months, reducing financial strain.</li>
                  <li style={listItemStyle}>Start paying only after the resident has stayed for at least 30 days.</li>
                  <li style={listItemStyle}>Payments stop if the resident leaves, moves out, or passes away.</li>
                  <li style={listItemStyle}>Secure $1,500 non-refundable deposit for room reservation.</li>
                  <li style={listItemStyle}>Warm fuzzzy feeling :-)</li>
                </ul>

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

    </>
  )
};