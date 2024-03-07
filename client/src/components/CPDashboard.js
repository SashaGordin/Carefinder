import React, { useState } from 'react'
import { Card, Button, Alert, Navbar, Image } from 'react-bootstrap'

import TopNav from "./TopNav";
import Footer from "./Footer";
import WelcomeMsg from './CPDashboard/WelcomeMsg';


export default function CPDashboard() {
  const [error, setError] = useState('')
  const providerName = "[Provider name]";
  
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