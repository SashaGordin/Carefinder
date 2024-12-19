import React, { useRef, useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
  Circle,
} from '@react-google-maps/api';

export default function Step5({ listingInfo, setListingInfo }) {
  //copied these from LandingPage.js - should probably go in a separate file that we reference from everywhere we need mapping
  // we need to get the listing's lat lng.. not sure if we have it in db already or need to geocode
  const [selectedMarker, setSelectedMarker] = useState(null); // State to track selected marker
  const [mapBounds, setMapBounds] = useState(null);
  const boundsRef = useRef(null); // useRef to store the boundaries

  const startingPosition = useRef({ lat: 47.7543, lng: -122.1635 });
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  const mapOptions = {
    minZoom: 12,
  };
  const mapRef = useRef(null); // useRef to store the map instance

  const radiusRef = useRef(3200);
  const zoomRef = useRef(13);
  const handleMapLoad = (map) => {
    mapRef.current = map; // Store the map instance in the ref
    // Fetch providers based on initial map bounds
  };

  return (
    <>
      <Card className="claimProfileCard">
        <Card.Body>
          <Card.Title>Is the pin in the right spot?</Card.Title>
          <div
            className="CFgrayBackground"
            style={{ height: '300px', margin: '10px' }}
          >
            {isLoaded ? (
              <GoogleMap
                zoom={zoomRef.current}
                center={startingPosition.current}
                mapContainerStyle={{ width: '100%', height: '100%' }}
                onLoad={handleMapLoad}
                options={mapOptions}
              >
                <Marker
                  position={{ lat: 47.7543, lng: -122.1635 }}
                  onClick={() => setSelectedMarker(startingPosition.current)}
                  // You can customize markers with icons, labels, etc. here
                />
                {selectedMarker && (
                  <InfoWindow
                    position={selectedMarker}
                    onCloseClick={() => setSelectedMarker(null)}
                  >
                    <div style={{ color: 'black' }}>"Test Info InfoWindow"</div>
                  </InfoWindow>
                )}
              </GoogleMap>
            ) : (
              <div>Loading ...</div>
            )}
          </div>
        </Card.Body>
      </Card>
    </>
  );
}
