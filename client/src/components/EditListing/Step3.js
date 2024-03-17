import React from 'react';
import { Button, Label, Card } from 'react-bootstrap';


export default function Step3({ listingInfo, setListingInfo}) {
  const setProviderStatement = (msg) => {
    listingInfo.providerStatement = msg;
    setListingInfo(listingInfo);
  }
  
  return (

    <>
      <Card className="claimProfileCard">

        <Card.Body>

          <Card.Title>About the home</Card.Title>

          <Card.Text>
              Provider statement
              <textarea className="small" rows="5" cols="50" onChange={e => setProviderStatement(e.target.value)}></textarea>
          </Card.Text>
        </Card.Body>
      </Card>
    </>

  );
};
