import React, { useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

//!!PRETTY SURE THIS FILE IS UNUSED
export default function Listings({ userData}) {
  const navigate = useNavigate();

  let listingStatus = userData.listingStatus ?? "Incomplete";
  let toggleImg = listingStatus == "Listing is on" ? "toggleon.png" : "toggleoff.png";
  let btnText = listingStatus == "Incomplete" ? "Create listing" : "Edit listing";
  const defaultListingImg = "house.png";

  const editListing = () => {
    navigate('/edit-listing', {state: {userData}});
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
        <Card.Title><h5>{userData.FacilityName}</h5></Card.Title>
        <div className="CFListingImgContainer"><div className="CFPlaceholderImg"><img src={userData.listingImg ?? defaultListingImg}/></div></div>
        <Button onClick={editListing}>{btnText}</Button>
      </Card.Body>
      </Card>
    </>

  );
}