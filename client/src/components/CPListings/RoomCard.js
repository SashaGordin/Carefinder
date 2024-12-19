import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function RoomCard({
  userData,
  roomData,
  listingData,
  handleRoomUpdate,
  facilityPath,
}) {
  const navigate = useNavigate();

  const [isAvailable, setIsAvailable] = useState(roomData.isAvailable);
  let listingStatus = isAvailable ? 'Listing is on' : 'Listing is off';
  let toggleImg = isAvailable ? 'toggleon.png' : 'toggleoff.png';
  const defaultListingImg = 'bed.png';

  const editRoom = () => {
    navigate('/edit-room', {
      state: { userData, roomData, listingData, facilityPath },
    });
  };

  const toggleListing = (e) => {
    let val = e.target.checked;
    handleRoomUpdate({ isAvailable: val }, roomData.roomId).then(() => {
      setIsAvailable(val);
    });
  };

  return (
    <>
      <div className="singleRoomCard">
        <div className="CFListingCardHeader2 d-flex justify-content-between">
          <div className="CFListingStatus2 ">{listingStatus}</div>
          <Form.Switch
            inline
            name="isAvailable"
            value="1"
            checked={roomData.isAvailable ?? false}
            onChange={toggleListing}
          />
          <div className="clear"></div>
        </div>

        <h5>{roomData.roomName}</h5>

        <div className="CFListingImgContainer2">
          <div className="CFPlaceholderImg2">
            <img
              style={{ borderRadius: '10px' }}
              alt=""
              height="100px"
              src={
                (roomData.roomPhotos && roomData.roomPhotos[0]) ??
                defaultListingImg
              }
            />
          </div>

          <Button style={{ marginTop: '10px' }} onClick={editRoom}>
            Edit listing
          </Button>
        </div>
      </div>
    </>
  );
}
