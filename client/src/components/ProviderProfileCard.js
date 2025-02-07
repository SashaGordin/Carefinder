import React, { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { FaCheckCircle } from 'react-icons/fa';

const ProviderProfileCard = ({
  provider,
  onShowProfile,
  hasSurvey,
  setSurveyModalOpen,
}) => {
  const {
    profilePicPath,
    FacilityPOC,
    FacilityName,
    listingsData, // Add more fields as needed
    Speciality,
  } = provider;

  const handleShowProfile = () => {
    onShowProfile();
    /*if (hasSurvey) {
      onShowProfile();
    } else {
      setSurveyModalOpen(true);
    }*/
  };

  console.log('PROVIDERPROFILECARD: provider', provider);
  return (
    <>
      <div
        className="flex-row flex-1 m-0 pCardBacks pCardLeftSide"
        data-license-number={provider.LicenseNumber}
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
            <div className="ppsDistance">9 miles away</div>
            <div className="ppsMsgButton">
              <a onClick={handleShowProfile}>Message</a>
            </div>
            <div className="clear"></div>
          </div>
          <div className="clear"></div>
        </div>
      </div>
    </>
  );
};

export default ProviderProfileCard;
