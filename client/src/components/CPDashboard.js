import React, { useState } from 'react'
import { Card, Button, Alert, Navbar, Image } from 'react-bootstrap'

import logo from '../assets/Group.png';
// import background from '../assets/Rectangle_7.png';

export default function CPDashboard() {
  const [error, setError] = useState('')





  return (
    <>
      <Navbar bg="dark" fixed="top">
          <Image src={logo} alt="Carefinder"  />
        <Navbar.Brand>

          Carefinder
        </Navbar.Brand>
      </Navbar>
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
    </>
  )
};