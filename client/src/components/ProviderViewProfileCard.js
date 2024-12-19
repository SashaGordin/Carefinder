import React, { useState } from 'react';
import { Card, Button, Modal } from 'react-bootstrap';
import { formatName } from '../utils';
const ProviderViewProfileCard = ({ provider }) => {
  console.log('profile pic path', provider.profilePicPath);
  return (
    <div className="bg-[#1e1f26] rounded-md overflow-hidden">
      <div className="w-full">
        <img
          src={provider.profilePicPath}
          className="w-full h-full object-cover"
          alt=" provider profile pic"
        />
      </div>
      <div className="p-2 flex flex-row justify-between">
        {formatName(provider.FacilityPOC)}
        <Button
          variant="link"
          onClick={() => {
            window.location.href = `/msg-outbox?ref=${provider.userId}`;
          }}
        >
          Message
        </Button>
      </div>
    </div>
  );
};

export default ProviderViewProfileCard;
