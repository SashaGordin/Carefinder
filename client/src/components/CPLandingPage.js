import React, { useState } from 'react'
import { Card, Button, Alert, Navbar, Image } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom';

import logo from '../assets/Group.png';
// import background from '../assets/Rectangle_7.png';

export default function CPLandingPage() {
  const [error] = useState('')
  const navigate = useNavigate();


  return (
    <>
      <Navbar bg="dark" fixed="top">
        {/* <div  style={{
            backgroundImage: `url(${background})`,
            backgroundSize: 'cover',
            width: '50px',  // Adjust the width to match your icon
            marginRight: '10px',
            overflow: 'hidden',
          }}> */}
          <Image src={logo} alt="Logo Icon" style={{ width: '50px', marginRight: '15px', marginLeft: '5px' }} />
        {/* </div> */}
        <Navbar.Brand>

          Carefinder
        </Navbar.Brand>
      </Navbar>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Dashboard</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <strong>Email:</strong>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        <Button variant="link" onClick={() => navigate('/claim-profile')}>
          Claim Profile
        </Button>
      </div>
    </>
  )
};