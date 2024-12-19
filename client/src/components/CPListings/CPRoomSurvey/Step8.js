import React from 'react';
import { Card, Image } from 'react-bootstrap';

export default function Step8({
  userData,
  listingData,
  roomInfo,
  // setRoomInfo,
}) {
  return (
    <>
      <div>
        <h2>Approve listing</h2>
        <p>Review before making listing public</p>
      </div>
      <Card className="claimProfileCard">
        <Card.Body>
          {userData.profilePicPath && (
            <Image height="150px" src={userData.profilePicPath} />
          )}
          {/* add listing photos here */}
          {roomInfo?.roomPhotos &&
            roomInfo.roomPhotos.map((path, i) => (
              <Image height="50px" src={path} key={i} />
            ))}
          <div>
            <h2>{userData.FacilityPOC}</h2>
            <p>Verified Provider</p>
            <p>Licensed since {listingData.licenseYear}</p>
          </div>
          <div>
            <h3>{listingData.facilityName}</h3>
            <p>Licensed for</p>
            {listingData.speciality &&
              listingData.speciality.map((x, i) => <p key={i}>{x}</p>)}
          </div>
          <div>
            <h3>What's special</h3>
            <p>{listingData.providerStatement}</p>
          </div>
        </Card.Body>
      </Card>
    </>
  );
}
