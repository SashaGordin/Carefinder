import React, { useState } from 'react';
import { Button, Form, Card, Placeholder } from 'react-bootstrap';
import axios from 'axios';


export default function Step2({ listingInfo, setListingInfo }) {
  const setLicenseYear = (year) => {
    listingInfo.licenseYear = year;
    setListingInfo(listingInfo);
  }

  return (

    <>
      <Card className="claimProfileCard">

        <Card.Body>

          <Card.Title>About the home</Card.Title>
          <Card.Text>Enter the year this home was licensed.</Card.Text>
            <input type="text" placeholder="Enter the year" onChange={e => setLicenseYear(e.target.value)} />
           {/* Button to go back to previous step */}
        </Card.Body>
      </Card>
    </>

  );
}
