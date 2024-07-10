import React, { useState } from 'react'
import { Card, Alert, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom';
import { FaCheck } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import TopNav from "../components/TopNav";
import Footer from "../components/Footer";
import Accordion from 'react-bootstrap/Accordion';
import YoutubeEmbed from "../components/YoutubeEmbed";

export default function LandingPage() {

  const [error, setError] = useState('');

  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    const encodedQuery = encodeURIComponent(query);
    navigate(`/client-dashboard?refLookup=${encodedQuery}`);
  };

  const listStyle = { listStyleType: 'none', padding: 0 };
  const listItemStyle = { position: 'relative', paddingLeft: '40px', marginBottom: '20px' };
  const checkmarkStyle = { content: '"\\2713"',  position: 'absolute', left: 0, color: '#ff6699' };

  return (
    <>
      <TopNav />
  
      <div className="homeRow1 CFgrayBackground">

          <div className="contentContainer">

              <div className="homeTopBackground">

                  <div className="left60">
                    <h2>Adult Family Homes,<br></br>King County, WA</h2>
                    <p style={{ textShadow: '2px 2px 0 black' }}>The easy way to reserve a room and book care within an Adult Family Home for 24/7 senior care.</p>

                        <div className="homeLookup">
                          <input
                            type="text"
                            placeholder="Search city, zip code, etc."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                          />
                          <button onClick={handleSearch}>Search</button>
                      </div>

                  </div>
          
                  <div className="right40">
                    &nbsp;
                  </div>
        
                  <div className="clear"></div>

              </div>

          </div>

      </div>
  
      <div className="homeRow2 CFblackBackground">
        <div className="contentContainer">
        <div className="left40">
          <YoutubeEmbed embedId="dQw4w9WgXcQ" />
          </div>
          <div className="right60">
            <p>Thanks to modern technology, families don't need senior advisors to determine cost of care, search for homes, or find comparable options.</p>
            <p>Yet traditional senior advisors still want you to pay 100% of the first month's rent like you did before the internet.</p>
            <p>At Carefinder, we want you to keep what you've earned, have a better experience, and get all the benefits that come with an advisor.</p>
          </div>
          <div className="clear"></div>
        </div>
      </div>
  

      <div className="homeRow3">

          <div className="contentContainer CFgrayBackground">

                <h2>Keep Our Seniors Safe</h2>

                <style> {`.custom-checkmark-list li::before { content: '\\2713'; position: absolute; left: 0; color: #ff6699;}`}</style>
                <ul style={listStyle} className="custom-checkmark-list">
                  <li style={listItemStyle}><b>Transparent Pricing:</b> Receive clear pricing for current and future levels of care.</li>
                  <li style={listItemStyle}><b>Unbiased Guidance:</b> Our recommendations are based solely on what's best for you and your loved ones, not on commissions or incentives.</li>
                  <li style={listItemStyle}><b>Personalized Matches:</b> Our advanced matching algorithm connects you with care options tailored to your unique needs and preferences.</li>
                  <li style={listItemStyle}><b>Streamlined Experience:</b> We simplify the search process, making it easy to explore homes, schedule tours, and complete paperwork.</li>
                </ul>

            </div>

      </div>
  

      <div className="homeRow4">
          <div className="contentContainer">

                <div className="hr4Box CFgrayBackground farLeft">
                  <h3>Zero Commission Community Partner</h3>
                  <p>
                    Chat with a local advisor you can trust. 100% unbiased, unincentivized guidance. A reliable partner who's well-versed in the communities and resources near you. Count on your advisor for as much or as little as you need.
                  </p>
                  <Link to="/###">
                    <Button variant="primary">Chat</Button>
                  </Link>
                </div>
          
                <div className="hr4Box CFgrayBackground">
                  <h3>Match with Licensed Care Providers</h3>
                  <p>
                    We make it incredibly easy for you to browse local options who have current availability or match with the most compatible options. All care providers are licensed with the state.
                  </p>
                  <Link to="/###">
                    <Button variant="primary">Start</Button>
                  </Link>
                </div>
          
                <div className="hr4Box CFgrayBackground farRight">
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