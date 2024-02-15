import React, { useState } from 'react'
import { Card, Alert, Navbar, Image } from 'react-bootstrap'

import TopNav from "./TopNav";
import Footer from "./Footer";

export default function ClientDashboard() {
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
      <div className="w-100 text-center mt-2">
        this is the client dashboard
      </div>

    </div>
    <Footer />
    </>
  )
};