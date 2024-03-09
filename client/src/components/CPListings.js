import React, { useState } from 'react'
import { Card, Button, Alert, Navbar, Image } from 'react-bootstrap'

import TopNav from "./TopNav";
import Footer from "./Footer";
import Listings from './CPListings/Listings';


export default function CPListings() {
  const [error, setError] = useState('')
  const providerName = "[Provider name]";
  const listingName = "Above Woodinville";
  const listingStatus = "Incomplete";
  const listingImg = null;

  return (
    <>
    <TopNav />
    <h2>Your listings</h2>
    <div className="contentContainer utilityPage">
        <Listings listingName={listingName} listingStatus={listingStatus} listingImg={listingImg}/>
      </div>
      <Footer />
    </>
  )
};