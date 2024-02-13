import React, { useState } from 'react'
import { Card, Button, Alert, Navbar, Image } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom';

import logo from '../assets/Group.png';
// import background from '../assets/Rectangle_7.png';

export default function LandingPage() {
  const [error, setError] = useState('')
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();


  async function handleLogout() {
    setError('')

    try{
      await logout()
      navigate('/login')
    } catch {
      setError('Failed to log out')
    }
  }

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
          <h2 className="text-center mb-4">Dashboard</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <div className='CFdashboard'>
            <strong>Email:</strong>
            <input type="text"></input>
          </div>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        {currentUser ?
          <>
            <Button variant="link" onClick={handleLogout}>
              Log Out
            </Button>
          </>
          :
          <>
            <Button variant="link" onClick={() => navigate('/login')}>
              Log In
            </Button>
          </>
        }
        <Link to="/survey">Take Survey</Link>
      </div>
    </>
  )
};