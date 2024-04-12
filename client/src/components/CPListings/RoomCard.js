import React, { useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function RoomCard({ roomData}) {
  const navigate = useNavigate();

  let listingStatus = roomData.listingStatus ?? "Incomplete";
  let toggleImg = listingStatus == "Listing is on" ? "toggleon.png" : "toggleoff.png";
  let btnText = listingStatus == "Incomplete" ? "Create listing" : "Edit listing";
  const defaultListingImg = "bed.png";

  const editListing = () => {
    navigate('/edit-listing', {state: {roomData}});
  }

  const toggleListing = () => {
    //TODO turn on listing in db and switch toggle button img
    toggleImg = toggleImg == "toggleon.png" ? "toggleoff.png" : "toggleon.png";
  }

  return (

    <>
    
      <div className="singleRoomCard">

        <div className='CFListingCardHeader2'>

          <div className="CFListingStatus2">{listingStatus}</div>

          <div className="CFlistingButton2" onClick={toggleListing}><img src={toggleImg}/></div>

          <div className="clear"></div>

        </div>

        <h5>{roomData.RoomName}</h5>

        <div className="CFListingImgContainer2">

          <div className="CFPlaceholderImg2"><img src={roomData.listingImg ?? defaultListingImg}/></div>

          <Button onClick={editListing}>{btnText}</Button>

        </div>

      </div>

    </>

  );
}