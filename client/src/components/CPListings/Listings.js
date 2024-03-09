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
      <Card className="listingCard">
      <Card.Body>
        <div className='d-flex'>
          <div className="listingStatus alert">{listingStatus}</div>
          <div className="ml-auto"><img src={toggleImg}/></div>
        </div>
        <Card.Title>{listingName}</Card.Title>
        <div className="p-5 bg-dark"><img src={listingImg ?? defaultListingImg}/></div>
        <Button>{btnText}</Button>
      </Card.Body>
      </Card>
    </>

  );
}