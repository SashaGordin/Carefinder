import React, { useState } from 'react';
import { Button, Card, Form, Image} from 'react-bootstrap';
import { getStorage, ref, uploadBytes } from "firebase/storage";
import FileUpload from '../FileUpload';

export default function Step12({ listingInfo, setListingInfo }) {
  let initialOptionState = listingInfo.fundDepletionPolicy?.startsWith("Other") ? listingInfo.fundDepletionPolicy.substring(5) : "";
  const [otherOption, setOtherOption] = useState(initialOptionState)

  const options = [
    "Residents are required to leave the facility.", 
    "Residents are supported in transitioning to Medicaid seamlessly.", 
    "Residents must find alternative funding sources.",
    "Other"
]; 
  const handleChange = (e) => {
    if (e.target.id == "OtherInputField")
      setOtherOption(e.target.value);
    
    let thisVal = e.target.id.startsWith("Other") ? "Other " + document.getElementById("OtherInputField").value : e.target.id;
    setListingInfo({
      ...listingInfo, 
      fundDepletionPolicy: thisVal});
  }

  return (
    <>
      <Card className="claimProfileCard">

        <Card.Body>

          <Card.Title>What happens if a resident\'s private funds are depleted while in your care?</Card.Title>
          <Form>
              {options.map((option, i) => (
                  <Form.Check 
                    key={i}
                    type='radio'
                    id={option}
                    label={option}
                    checked={listingInfo.fundDepletionPolicy?.includes(option) ?? false}
                    onChange={handleChange}
                  />
              ))}
              <input type="text" id="OtherInputField" value={otherOption} onChange={handleChange}/>
            </Form>
        </Card.Body>

      </Card>

    </>

  );
};