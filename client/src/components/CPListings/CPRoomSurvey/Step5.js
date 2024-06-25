import React, { useState } from 'react';
import { Card, Form } from 'react-bootstrap';

export default function Step5({ roomInfo, setRoomInfo }) {
  const getInitialOptionState = () => {
    if (roomInfo.addlDetails) {
      for (const val of roomInfo.addlDetails) {
        if (val.startsWith("Other"))
          return val.substring(5);
      }
    }
    return "";
  }

  let initialOptionState = getInitialOptionState();
  const [otherOption, setOtherOption] = useState(initialOptionState)

  const getCheckedStatus = (option) => {
    if (roomInfo.addlDetails?.includes(option))
      return true;
    else if (option === "Other" && roomInfo.addlDetails) {
      for (const val of roomInfo.addlDetails) {
        if (val.startsWith("Other"))
          return true;
      }
    }
    return false;
  }


  const handleChange = () => {
    let addlDetails = [];
    setOtherOption(document.getElementById("OtherInputField").value);

    document.querySelectorAll("[type='checkbox']:checked").forEach((t) => {
      let thisVal = t.id.startsWith("Other") ? "Other " + document.getElementById("OtherInputField").value : t.id;
      addlDetails.push(thisVal);
    });
    setRoomInfo({
      ...roomInfo,
      addlDetails: addlDetails
    });
  }


  const options = ["Main floor", "Must use stairs or elevator to access room", "Door to outside", "Pleasant view", "Other"];

  return (
    <>
      <Card className="claimProfileCard">

        <Card.Body>

          <Card.Title>Which of these apply to this room?</Card.Title>
          <Form>
            {options.map((option, i) => (
              <Form.Check
                key={i}
                type='checkbox'
                id={option}
                label={option}
                checked={getCheckedStatus(option)}
                onChange={handleChange}
              />
            ))}
            <input type="text" id="OtherInputField" value={otherOption} onChange={handleChange} />
          </Form>
        </Card.Body>

      </Card>

    </>

  );
};