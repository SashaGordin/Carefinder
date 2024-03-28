import React, { useState } from 'react'
import { Card, Button, Alert, Navbar, Image } from 'react-bootstrap'

import TopNav from "./TopNav";
import Footer from "./Footer";
import WelcomeMsg from './CPDashboard/WelcomeMsg';

// get usename
import { useAuth } from "../contexts/AuthContext";


export default function CPDashboard() {
  const [error, setError] = useState('')

  // was thinking we could grab displayName from here... maybe not...
  const { login, currentUser } = useAuth()
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