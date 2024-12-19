import React from 'react';
import { useNavigate } from 'react-router-dom';
import TopNav from '../components/TopNav';
import Footer from '../components/Footer';

/**
 * NOTE: We used to load a component at CPDashboard/WelcomeMsg.js here, but I took it out,
 * as I don't think we need it anymore. The code is still there, though, in case we want to bring it back.
 */

// get usename
// import { useAuth } from "../contexts/AuthContext";

export default function CPDashboard() {
  // was thinking we could grab displayName from here... maybe not...
  // const { currentUser } = useAuth()
  // let providerName = currentUser.displayName;
  // if (!providerName) {providerName = 'Provider';}
  // console.log(currentUser.displayName);

  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/contact-us');
  };

  return (
    <>
      <TopNav userRole="provider" />

      <div className="welcomeProviderPage">
        <div className="contentContainer utilityPage">
          <div className="providerButton">
            <button onClick={handleButtonClick}>Submit Feedback</button>
          </div>

          <div className="welcomeProviderPageBox">
            <h2 style={{ textAlign: 'center', fontWeight: 'bold' }}>
              Welcome AFH Providers!
            </h2>

            <p style={{ textAlign: 'center' }}>
              We are incredibly grateful to have you with us. As a new service,
              our results may be limited during thie initial phase. We are
              currently testing our MVP (minimal viable product) and your
              feedback will help us build new features and updates soon. Thank
              you for your support and patience as we continue to improve.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
