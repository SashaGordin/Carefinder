import React, { useState } from 'react'
import { Card, Alert } from 'react-bootstrap'

import TopNav from "../components/TopNav";
import Footer from "../components/Footer";

export default function LandingPage() {
  const [error, setError] = useState('');




  return (
    <>
    <TopNav />
    <div className="contentContainer utilityPage">

      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Client DashBoard</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <div className='CFdashboard'>
            <strong>Email:</strong>
            <input type="text"></input>
          </div>
        </Card.Body>
      </Card>

    </div>
    <Footer />
    </>
  )
};