import React, { useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function Listings({ licenseNumber, listingStatus, listingName, listingImg}) {
  const navigate = useNavigate();

  listingStatus = listingStatus ?? "Incomplete";
  let toggleImg = listingStatus == "Listing is on" ? "toggleon.png" : "toggleoff.png";
  let btnText = listingStatus == "Incomplete" ? "Create listing" : "Edit listing";
  const defaultListingImg = "house.png";

  const editListing = () => {
    navigate('/edit-listing', {state: {licenseNumber}});
  }

  const toggleListing = () => {
    //TODO turn on listing in db and switch toggle button img
    toggleImg = toggleImg == "toggleon.png" ? "toggleoff.png" : "toggleon.png";
  }

  return (

    <>
      <Card className="CFListingCard">
      <Card.Body>
        <div className='CFListingCardHeader'>
          <div className="CFListingStatus">{listingStatus}</div>
          <div className="ml-auto" onClick={toggleListing}><img src={toggleImg}/></div>
        </div>
        <Card.Title><h5>{listingName}</h5></Card.Title>
        <div className="CFListingImgContainer"><div className="CFPlaceholderImg"><img src={listingImg ?? defaultListingImg}/></div></div>
        <Button onClick={editListing}>{btnText}</Button>
      </Card.Body>
      </Card>
    </>

  );
}