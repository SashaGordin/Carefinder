import React, { useState } from 'react'
import { Card, Button, Alert, Navbar, Image } from 'react-bootstrap'

import TopNav from "./TopNav";
import Footer from "./Footer";

export default function CPDashboard() {
  const [error, setError] = useState('')





  return (
    <>
    <TopNav />
    <div className="contentContainer utilityPage">

        <Card>
          <Card.Body>
            <h2 className="text-center mb-4">Provider DashBoard</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <div className='CFdashboard'>
              <strong>Email:</strong>
              <input type="text"></input>
            </div>
          </Card.Body>
        </Card>
        <div className="w-100 text-center mt-2">
          this is the provider dashboard
        </div>
        
      </div>
      <Footer />
    </>
  )
};