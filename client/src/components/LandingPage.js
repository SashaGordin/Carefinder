import React, { useState } from 'react'
import { Card, Button, Alert, Navbar, Image } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom';

import TopNav from "./TopNav";
import Footer from "./Footer";

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
    <TopNav />

    <div className="CFgrayBackground">

        <div className="contentContainer clientSearchBar">

            <input id="clientSearch" name="yyy" placeholder="Search city, zip code, etc." />

            <button id="findMatches" type="button" className='btn'>Find Matches</button>

            <button id="takeSurvey" type="button" className='btn'>Take Survey</button>

        </div>

    </div>

    <div className="CFgrayBackground">

        <div className='contentContainer'>

            <div className='clientLProw2left CFgrayBackground'>
                [google map]
            </div>

            <div className='clientLProw2right CFblackBackground'>
                [map results area]
            </div>

            <div class="clear"></div>

        </div>    

    </div>

    <div className="contentContainer utilityPage">

        <div className='clientDashboard'>

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
                <Button variant="link" onClick={() => navigate('/login')}>Log In</Button>
              </>
            }

            <Link to="/survey">Take Survey</Link>

          </div>
        </div>

      </div>
      <Footer />
    </>
  )
};