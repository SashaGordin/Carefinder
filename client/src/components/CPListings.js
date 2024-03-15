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
      <TopNav userRole="provider" />

      <div className="contentContainer utilityPage">
        <h1>Your listings</h1>
        <Listings listingName={listingName} listingStatus={listingStatus} listingImg={listingImg} />
      </div>
      <Footer />
    </>
  )
};