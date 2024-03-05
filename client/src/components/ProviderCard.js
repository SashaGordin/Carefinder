import React from 'react';
import { Card } from 'react-bootstrap';

const ProviderCard = ({ provider, onClick }) => {
  const {
    FacilityName,
    LocationAddress,
    LocationCity,
    LocationState,
    LocationZipCode,
    TelephoneNmbr,
    // Add more fields as needed
  } = provider;

  return (
    <Card>
      <Card.Body>
        <div onClick={() => onClick(provider)}>
          <Card.Title>{FacilityName}</Card.Title>
        </div>
        <Card.Text>
          <strong>Address:</strong> {LocationAddress}, {LocationCity}, {LocationState} {LocationZipCode}<br />
          <strong>Telephone:</strong> {TelephoneNmbr}
          {/* Add more fields here */}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default ProviderCard;