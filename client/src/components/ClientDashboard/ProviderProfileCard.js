import React, { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { FaCheckCircle } from 'react-icons/fa';

const ProviderProfileCard = ({
  provider,
  onShowProfile,
  showModal,
  setShowModal,
}) => {
  const {
    profilePicPath,
    FacilityPOC,
    FacilityName,
    listingsData, // Add more fields as needed
    Speciality,
  } = provider;

  const handleShowProfile = () => {
    if (showModal) {
      onShowProfile();
    } else {
      setShowModal(true);
    }
  };

  console.log('this is the provider', provider);
  return (
    <>
      <div
        className="flex-row flex-1 m-0"
        data-license-number={provider.LicenseNumber}
        style={{ borderRight: '10px solid #151414' }}
      >
        <div className="pCardImageContainer">
          <img className="pCardPics" src={profilePicPath} alt="Profile pic" />
        </div>

        <div className="flex flex-col" style={{ padding: 10 }}>
          <Card.Title>{FacilityPOC}</Card.Title>
          <div className="verified">
            <FaCheckCircle /> Verified Provider
          </div>
          <div className="ppcButton">
            9 miles away &nbsp;&nbsp;&nbsp;&nbsp;
            <a onClick={handleShowProfile}>Message</a>
          </div>
          <div className="clear"></div>
        </div>
      </div>
    </>
  );
};

export default ProviderProfileCard;
