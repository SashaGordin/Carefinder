import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import TopNav from '../components/TopNav';
import Footer from '../components/Footer';
import Accordion from 'react-bootstrap/Accordion';
import YoutubeEmbed from '../components/YoutubeEmbed';
import { FaMapMarkerAlt, FaSmile, FaCheck } from 'react-icons/fa';

export default function LandingPage() {
  const [query, setQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    const trimmedQuery = query.trim();
    const isZipCode = /^\d{5}$/.test(trimmedQuery);
    const hasCityAndState = /\w+,\s*\w{2}/.test(trimmedQuery);

    if (isZipCode || hasCityAndState) {
      setErrorMessage(''); // Clear any previous error message
      const encodedQuery = encodeURIComponent(trimmedQuery);
      navigate(`/client-dashboard?refLookup=${encodedQuery}`);
    } else {
      setErrorMessage(
        'Please enter a valid city and state (e.g., City, State) or a valid 5-digit zipcode.'
      );
    }
  };

  const iconStyle = {
    height: '35px',
    width: '35px',
    marginBottom: '20px',
  };

  return (
    <>
      <TopNav />
      <div className="homeRow1 homeTopBackground">
        <div className="contentContainer">
          <div className="left50">
            <h2>
              Match with local<br></br>senior care options
            </h2>
            <p style={{ textShadow: '2px 2px 0 black' }}>
              We help you make smart decisions about senior care.
            </p>

            <div className="homeLookup">
              <input
                type="text"
                placeholder="Search city, zip code, etc."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button onClick={handleSearch}>Search</button>
            </div>

            {errorMessage && (
              <div
                style={{
                  color: 'red',
                  marginTop: '10px',
                  textAlign: 'left',
                  fontSize: '14px',
                }}
              >
                {errorMessage}
              </div>
            )}
          </div>

          <div className="right50">
            <img src="laptop-shot.png" />
          </div>

          <div className="clear"></div>
        </div>
      </div>

      <div className="homeRow2 CFblackBackground">
        <div className="contentContainer">
          <div className="left40">
            <YoutubeEmbed embedId="dQw4w9WgXcQ" />
          </div>
          <div className="right60">
            <p>
              Thanks to modern technology, families no longer need senior
              advisors to determine cost of care, search for homes, or find
              comparable options. You just use Carefinder.
            </p>
            <p>
              All options on Carefinder are pre-vetted, meet high standards for
              providing quiality care and are highly recommendable.
            </p>
          </div>
          <div className="clear"></div>
        </div>
      </div>

      <div className="homeRow3">
        <div className="contentContainer">
          <div className="triplebox CFgrayBackground">
            <FaMapMarkerAlt style={{ ...iconStyle, color: 'pink' }} />
            <p className="h3">Skip the search</p>
            <p>
              AI-driven matchmaking connects you directly to the most compatible
              pre-vetted care.
            </p>
          </div>

          <div className="triplebox CFgrayBackground">
            <FaSmile style={{ ...iconStyle, color: 'yellow' }} />
            <p className="h3">Stress-free zone</p>
            <p>
              We streamline the entir process from matchmaking to admissions.
              Simply give us a call or message if you need any support along the
              way.
            </p>
          </div>

          <div className="triplebox CFgrayBackground">
            <FaCheck style={{ ...iconStyle, color: 'orange' }} />
            <p className="h3">Transparent & unbiased</p>
            <p>
              We don't collect behind-the-scenes commissions, which means you
              can be confident in receiving unbiased guidance that you can
              trust.
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
                Carefinder is an online marketplace connecting families with
                pre-qualified care providers, such as senior living facilities
                and adult family homes. We're not a referral agency but a
                listing service facilitating personalized matches, quotes, tours
                scheduling, and unbiased guidance.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>How does it work?</Accordion.Header>
              <Accordion.Body>
                CareFinder connects care providers with families seeking care in
                Adult Family Home settings. Simply create an account, list your
                AFH, and receive messages, quote requests, and tour scheduling
                from interested families.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2">
              <Accordion.Header>How does Carefinder charge?</Accordion.Header>
              <Accordion.Body>xxx xxx xxx xxx xxx</Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="3">
              <Accordion.Header>How is Carefinder unbiased?</Accordion.Header>
              <Accordion.Body>
                Matches are based on a proprietary algorithm, and our advisors
                are not paid on commission, ensuring 100% unbiased guidance.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="4">
              <Accordion.Header>
                Why is Carefinder better for the industry?
              </Accordion.Header>
              <Accordion.Body>
                We prioritize seniors' well-being by providing unbiased
                guidance. For care providers, it's a low-cost, annual flat fee
                to access a lead generation powerhouse.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="5">
              <Accordion.Header>What if I change my mind?</Accordion.Header>
              <Accordion.Body>xxx xxx xxx xxx xxx</Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>
      </div>
      <div style={{ height: 60 }}></div>
      <Footer />
    </>
  );
}
