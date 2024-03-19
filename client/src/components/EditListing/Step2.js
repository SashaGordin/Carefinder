import React, { useState } from 'react';
import { Button, Form, Card, Placeholder } from 'react-bootstrap';
import axios from 'axios';


export default function Step2({ listingInfo, setListingInfo }) {
  const handleYearChange = (e) => {
    setListingInfo({
      ...listingInfo, 
      licenseYear: e.target.value});
  }

  return (

    <>
      <Card className="claimProfileCard">

        <Card.Body>

          <Card.Title>About the home</Card.Title>
          <Card.Text>Enter the year this home was licensed.</Card.Text>
            <input type="text" placeholder="Enter the year" value={listingInfo.licenseYear ?? ""} onChange={handleYearChange} />
           {/* Button to go back to previous step */}
        </Card.Body>
      </Card>
    </>

  );
}
