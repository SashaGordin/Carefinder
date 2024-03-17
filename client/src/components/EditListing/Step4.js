import React from 'react';
import { Button, Card } from 'react-bootstrap';

export default function Step4({  onNext, onBack, listingInfo, setListingInfo}) {
  const setProviderCredentials = () => {
    let credentials;
    document.querySelectorAll("[name='providerCredentials']").forEach((t) => {
      if (t.checked)
        credentials += "," + t.value;
    });
    listingInfo.providerCredentials = credentials;
    setListingInfo(listingInfo);
  }
  
  const options = ["MD", "DO", "PA-C", "ARNP", "RN, BSN", "RN", "LPN", "EMT", "Other"]
  
  let checkboxOptions = [];
  for (let i = 0; i < options.length; i++)
  {
    const option = options[i];
    console.log(option);
    checkboxOptions.push(<><input name="providerCredentials" type="checkbox" id={option} value={option}/><label htmlFor={option}>{option}</label></>);
  }
  return (
    <>
      <Card className="claimProfileCard">

        <Card.Body>

          <Card.Title>Does the home provider or manager hold any of following credentials?</Card.Title>

          <Card.Text>
           Select all that apply
            
          </Card.Text>
          <div onChange={setProviderCredentials}>
              {checkboxOptions}
          </div>
        </Card.Body>
        
      </Card>

    </>

  );
};