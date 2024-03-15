import React, { useState } from 'react';
import { Button, Card } from 'react-bootstrap';

export default function Listings({ listingStatus, listingName, listingImg}) {
  const [providerNumber, setProviderNumber] = useState('');
  //const [providerInfo, setProviderInfo] = useState(null);

  let toggleImg = listingStatus == "Listing is on" ? "toggleon.ong" : "toggleoff.png";
  let btnText = listingStatus == "Incomplete" ? "Create listing" : "Edit listing";
  const defaultListingImg = "house.png";

  return (

    <>
      <Card className="CFListingCard">
      <Card.Body>
        <div className='CFListingCardHeader'>
          <div className="CFListingStatus">{listingStatus}</div>
          <div className="ml-auto"><img src={toggleImg}/></div>
        </div>
        <Card.Title><h2>{listingName}</h2></Card.Title>
        <div className="CFListingImgContainer"><div className="CFPlaceholderImg"><img src={listingImg ?? defaultListingImg}/></div></div>
        <Button>{btnText}</Button>
      </Card.Body>
      </Card>
    </>

  );
}