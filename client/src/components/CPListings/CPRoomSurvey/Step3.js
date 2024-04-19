import React, { useState } from 'react';
import { Button, Label, Card } from 'react-bootstrap';


export default function Step3({ listingInfo, setListingInfo}) {
  const handleStatementChange = (e) => {
    setListingInfo({
      ...listingInfo, 
      providerStatement: e.target.value});
  }

  
  return (

    <>
      <Card className="claimProfileCard">

        <Card.Body>

          <Card.Title>About the home</Card.Title>

          <Card.Text>
              Provider statement
              <textarea className="small" rows="5" cols="50" value={listingInfo.providerStatement ?? ""} onChange={handleStatementChange}></textarea>
          </Card.Text>
        </Card.Body>
      </Card>
    </>

  );
};
