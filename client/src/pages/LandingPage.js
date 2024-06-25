import React from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaCheck } from 'react-icons/fa';

import TopNav from "../components/TopNav";
import Footer from "../components/Footer";
import Accordion from 'react-bootstrap/Accordion';
import YoutubeEmbed from "../components/YoutubeEmbed";

export default function LandingPage() {




  return (
    <>
      <TopNav />

      <div className="homeRow1 CFgrayBackground">
        <div className="contentContainer">
          <div className="left60">
            <h2 className="CFpink">Match with Adult Family Homes</h2>
            <p>
              The easy way to explore tailored care options, schedule tours, receive quotes, and make informed decisions about your loved one's care.
            </p>
            <Link to="/client-dashboard">
              <Button variant="primary">Find an AFH</Button>
            </Link>
          </div>

          <div className="right40">
            <img src="cooking.jpg" alt="Cooking" />
          </div>

          <div className="clear"></div>
        </div>
      </div>

      <div className="homeRow2">
        <div className="contentContainer">
          <YoutubeEmbed embedId="dQw4w9WgXcQ" />
        </div>
      </div>


      <div className="homeRow3">

          <div className="contentContainer CFgrayBackground">

                <h2>Keep Our Seniors Safe</h2>

                <div className="checkBoxList">
                  <FaCheck />
                  <p>
                    <b>Transparent Pricing:</b> Receive clear pricing for current and future levels of care.
                  </p>
                </div>
                <div className="clear"></div>

                <div className="checkBoxList">
                  <FaCheck />
                  <p>
                    <b>Unbiased Guidance:</b> Our recommendations are based solely on what's best for you and your loved ones, not on commissions or incentives.
                  </p>
                </div>
                <div className="clear"></div>

                <div className="checkBoxList">
                  <FaCheck />
                  <p>
                    <b>Personalized Matches:</b> Our advanced matching algorithm connects you with care options tailored to your unique needs and preferences.
                  </p>
                </div>
                <div className="clear"></div>

                <div className="checkBoxList">
                  <FaCheck />
                  <p>
                    <b>Streamlined Experience:</b> We simplify the search process, making it easy to explore homes, schedule tours, and complete paperwork.
                  </p>
                </div>

            </div>

      </div>


      <div className="homeRow4">
          <div className="contentContainer">

                <div className="hr4Box CFgrayBackground farLeft">
                  [image]
                  <h3>Zero Commission Community Partner</h3>
                  <p>
                    Chat with a local advisor you can trust. 100% unbiased, unincentivized guidance. A reliable partner who's well-versed in the communities and resources near you. Count on your advisor for as much or as little as you need.
                  </p>
                  <Link to="/###">
                    <Button variant="primary">Chat</Button>
                  </Link>
                </div>

                <div className="hr4Box CFgrayBackground">
                  [image]
                  <h3>Match with Licensed Care Providers</h3>
                  <p>
                    We make it incredibly easy for you to browse local options who have current availability or match with the most compatible options. All care providers are licensed with the state.
                  </p>
                  <Link to="/###">
                    <Button variant="primary">Start</Button>
                  </Link>
                </div>

                <div className="hr4Box CFgrayBackground farRight">
                  [image]
                  <h3>Pre-vetted</h3>
                  <p>
                    Our dedicated team personally visits each facility, fostering relationships with provider & staff. We're focused on trust and transparency, we go the extra mile to provide families with peace of mind, knowing that their loved ones are in good hands.
                  </p>
                </div>
                <div className="clear"></div>

          </div>

      </div>



      <div className="homeRow5 CFblackBackground">
        <div className="contentContainer">
          <h2 className="text-center">Frequently asked questions</h2>
          <Accordion>
            <Accordion.Item eventKey="0">
              <Accordion.Header>What is Carefinder?</Accordion.Header>
              <Accordion.Body>
                Carefinder is an online marketplace connecting families with pre-qualified care providers, such as senior living facilities and adult family homes. We're not a referral agency but a listing service facilitating personalized matches, quotes, tours scheduling, and unbiased guidance.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>How does it work?</Accordion.Header>
              <Accordion.Body>
                CareFinder connects care providers with families seeking care in Adult Family Home settings. Simply create an account, list your AFH, and receive messages, quote requests, and tour scheduling from interested families.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2">
              <Accordion.Header>How does Carefinder charge?</Accordion.Header>
              <Accordion.Body>xxx xxx xxx xxx xxx</Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="3">
              <Accordion.Header>How is Carefinder unbiased?</Accordion.Header>
              <Accordion.Body>
                Matches are based on a proprietary algorithm, and our advisors are not paid on commission, ensuring 100% unbiased guidance.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="4">
              <Accordion.Header>Why is Carefinder better for the industry?</Accordion.Header>
              <Accordion.Body>
                We prioritize seniors' well-being by providing unbiased guidance. For care providers, it's a low-cost, annual flat fee to access a lead generation powerhouse.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="5">
              <Accordion.Header>What if I change my mind?</Accordion.Header>
              <Accordion.Body>xxx xxx xxx xxx xxx</Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>
      </div>

      <div style={{height:60}}></div>
      <Footer />
    </>
  )
};