import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function RoomCard({ userData, roomData, listingData, handleRoomUpdate, facilityPath}) {
  const navigate = useNavigate();


  const [isAvailable, setIsAvailable] = useState(roomData.isAvailable);
  let listingStatus = isAvailable ? "Listing is on" : "Listing is off";
  let toggleImg = isAvailable ? "toggleon.png" : "toggleoff.png";
  const defaultListingImg = "bed.png";

  const editListing = () => {
	  navigate('/room-survey', {state: {userData, roomData, listingData, facilityPath }});
  }

  const toggleListing = () => {
    handleRoomUpdate({isAvailable:!isAvailable}, roomData.roomId).then(() => {setIsAvailable(!isAvailable)});
  }

  return (

    <>

      <div className="singleRoomCard">

        <div className='CFListingCardHeader2'>

          <div className="CFListingStatus2">
            {listingStatus}
            <img alt="" onClick={toggleListing} src={toggleImg}/>
          </div>


          <div className="clear"></div>

        </div>

        <h5>{roomData.roomName}</h5>

        <div className="CFListingImgContainer2">

          <div className="CFPlaceholderImg2"><img style={{borderRadius:"10px"}} alt="" height='100px' src={(roomData.roomPhotos && roomData.roomPhotos[0]) ?? defaultListingImg}/></div>

          <Button style={{marginTop:"10px"}}onClick={editListing}>Edit listing</Button>

        </div>

      </div>

    </>

  );
}