import { Card } from 'react-bootstrap';
import ProviderProfileCard from './ProviderProfileCard';
import React, { useState } from 'react';
import PropertyPhotoModal from './PropertyPhotoModal';
import ViewProfile from './ViewProfile';

const ProviderCard = ({ provider, onClick, hasSurvey, setSurveyModalOpen }) => {
  const { FacilityName, listingsData } = provider;

  const isReal = Object.keys(listingsData).length > 0;
  const homePhotos = listingsData.homePhotos;

  let roomPhotos = [];
  console.log('PROVIDERCARD listingsData', listingsData);

  if (isReal && listingsData.roomData) {
    roomPhotos = listingsData.roomData.map((room) => room.roomPhotos);
  }

  const [modalType, setModalType] = useState(null); // null, 'photos', 'profile'
  const handleOpenModal = (type) => setModalType(type);
  const handleCloseModal = () => setModalType(null);

  return (
    <>
      {isReal ? (
        <div className="Pcard">
          {/*  THIS IS THE TWO-PART CARD THAT SITS TO THE RIGHT OF THE MAP */}
          <Card>
            <Card.Body
              style={{
                display: 'flex',
                flexDirection: 'row',
                fontSize: '12px',
              }}
              onClick={() => onClick(provider)}
            >
              {/* THIS IS THE LEFT SIDE OF THE CARD (the Provider): */}
              <ProviderProfileCard
                provider={provider}
                onShowProfile={() => handleOpenModal('profile')}
                hasSurvey={hasSurvey}
                setSurveyModalOpen={setSurveyModalOpen}
              />

              {/* ... AND THIS IS THE RIGHT SIDE (the ROOM) */}
              <div className="pcardRightSide">
                <div className="pCardImageContainer">
                  <img
                    className="pCardPics"
                    src={homePhotos[0] || 'https://placehold.co/600x400'}
                    alt="Profile pic"
                    onClick={() => handleOpenModal('photos')}
                  />
                </div>

                <div
                  style={{
                    textAlign: 'center',
                    fontWeight: 'bold',
                    paddingTop: '4px',
                    cursor: 'pointer',
                  }}
                >
                  {FacilityName.length > 25
                    ? `${FacilityName.substring(0, 25)}...`
                    : FacilityName}

                  <div className="clear"></div>

                  {/**  NEED TO LIST ROOM AMENITIES HERE */}
                  <p className="amenities">
                    <span className="amenity">Private room</span>
                    <span className="amenity">Private bathroom</span>
                  </p>

                  <p>
                    <a onClick={() => handleOpenModal('photos')}>
                      View Available Room
                    </a>
                  </p>
                  <p className="vProfileLink">
                    <a onClick={() => handleOpenModal('profile')}>
                      View Profile
                    </a>
                  </p>
                </div>
              </div>
            </Card.Body>
          </Card>

          {modalType === 'photos' && (
            <PropertyPhotoModal
              showModal={modalType === 'photos'}
              setShowModal={handleCloseModal}
              FacilityName={FacilityName}
              homePhotos={homePhotos}
              roomPhotos={roomPhotos}
            />
          )}
          {modalType === 'profile' && (
            <ViewProfile
              provider={provider}
              showModal={modalType === 'profile'}
              setShowModal={handleCloseModal}
            />
          )}
        </div>
      ) : (
        <Card>
          <Card.Body
            style={{
              display: 'flex',
              flexDirection: 'row',
              fontSize: '12px',
              maxHeight: '200px',
            }}
            onClick={() => onClick(provider)}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                margin: '5px',
              }}
            >
              <div style={{ textAlign: 'center' }}>{FacilityName}</div>
            </div>
          </Card.Body>
        </Card>
      )}
    </>
  );
};

export default ProviderCard;
