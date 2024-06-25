import React from 'react'
import { Card } from 'react-bootstrap'

import TopNav from "../components/TopNav";
import Footer from "../components/Footer";
import WelcomeMsg from '../components/CPDashboard/WelcomeMsg';

// get usename
import { useAuth } from "../contexts/AuthContext";


export default function CPDashboard() {

  // was thinking we could grab displayName from here... maybe not...
  const { currentUser } = useAuth()
  let providerName = currentUser.displayName;
  if (!providerName) {providerName = 'Provider';}
  console.log(currentUser.displayName);

  return (
    <>
    <TopNav userRole="provider"/>
    <div className="contentContainer utilityPage">

        <WelcomeMsg providerName={providerName}/>
        <Card>
          <Card.Body>
            Blog posts go here
          </Card.Body>
        </Card>

      </div>
      <Footer />
    </>
  )
};