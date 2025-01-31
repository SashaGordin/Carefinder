import { GoogleMap, Marker, InfoWindowF } from '@react-google-maps/api';
import { useRef } from 'react';
import { useLoadScript } from '@react-google-maps/api';
import ProviderCard from './ProviderCard';
const ClientDashboardMap = ({
  providers,
  selectedMarker,
  setSelectedMarker,
  zip,
  city,
  zoomRef,
  startingPosition,
  handleMapBoundsChanged,
  nearbyBigCities,
  hasSurvey,
  setSurveyModalOpen,
  mapRef,
  boundsRef,
  radiusRef,
  mapStyles,
  getProvidersFromBounds,
}) => {
  const providerListRef = useRef(null);

  const handleMapLoad = (map) => {
    mapRef.current = map; // Store the map instance in the ref
  };

  const panToCity = (city) => {
    if (mapRef.current) {
      const cityCoords = { lat: city.lat, lng: city.lng };
      startingPosition.current = cityCoords;
      mapRef.current.panTo(cityCoords);
      // setMapBounds(mapRef.current.getBounds()); // Manually set bounds
      const fixedBounds = calculateFixedBounds(cityCoords, radiusRef.current); // 5000 meters (5 km) radius, adjust as needed
      const newBounds = new window.google.maps.LatLngBounds(
        new window.google.maps.LatLng(fixedBounds.south, fixedBounds.west),
        new window.google.maps.LatLng(fixedBounds.north, fixedBounds.east)
      );

      boundsRef.current = newBounds;
      // handleMapBoundsChanged();
      setSelectedMarker(null);
      getProvidersFromBounds();
    }
  };

  const handleProviderSelect = (provider) => {
    // Scroll to the selected provider in the map
    if (mapRef.current) {
      mapRef.current.panTo(provider.position);
      startingPosition.current = {
        lat: provider.position.lat,
        lng: provider.position.lng,
      };
      setSelectedMarker(provider); // Open InfoWindow for the selected provider
    }
  };

  const mapOptions = {
    minZoom: 12,
    styles: mapStyles,
    disableDefaultUI: true,
  };

  const pinkMarkerIcon = {
    url: 'selected_map_icon.png',
    scaledSize: {
      width: 50,
      height: 50,
    },
  };

  const mutedMarkerIcon = {
    url: 'non_selected_icon.png',
    scaledSize: {
      width: 30,
      height: 30,
    },
  };

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);
    scrollToProvider(marker.LicenseNumber);
  };

  const scrollToProvider = (licenseNumber) => {
    const providerElement = providerListRef.current.querySelector(
      `[data-license-number="${licenseNumber}"]`
    );
    if (providerElement) {
      console.log(providerElement);
      providerElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const calculateFixedBounds = (center, radiusInMeters) => {
    const earthRadius = 6378137; // Earth's radius in meters
    const latDelta = (radiusInMeters / earthRadius) * (180 / Math.PI);
    const lngDelta =
      ((radiusInMeters / earthRadius) * (180 / Math.PI)) /
      Math.cos((center.lat * Math.PI) / 180);

    return {
      north: center.lat + latDelta,
      south: center.lat - latDelta,
      east: center.lng + lngDelta,
      west: center.lng - lngDelta,
    };
  };

  return (
    <div className="CFblackBackground">
      <div className="contentContainer" style={{ padding: '20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h3>{city ? city : 'Woodinville'}, WA</h3>
          <h6>Licensed AFH care providers in {zip ? zip : '98072'}</h6>
        </div>
        <div className="flex">
          <div className="left50 flex-1 pr-3">
            {isLoaded ? (
              <GoogleMap
                zoom={zoomRef.current}
                center={startingPosition.current}
                mapContainerStyle={{
                  width: '100%',
                  height: '500px',
                  borderRadius: 10,
                }}
                onLoad={handleMapLoad}
                onBoundsChanged={handleMapBoundsChanged}
                options={mapOptions}
              >
                {providers &&
                  providers.length > 0 &&
                  providers.map((provider) => (
                    <Marker
                      key={provider.id}
                      position={provider.position}
                      onClick={() => handleMarkerClick(provider)}
                      className="h-20 w-20"
                      icon={
                        selectedMarker === provider
                          ? pinkMarkerIcon
                          : mutedMarkerIcon
                      }
                    />
                  ))}
                {selectedMarker && (
                  <InfoWindowF
                    position={selectedMarker.position}
                    onCloseClick={() => setSelectedMarker(null)}
                  >
                    <div className="relative text-black flex flex-col max-w-[15rem] p-0 m-0">
                      {/* Image Container with Close Button */}
                      <div className="relative w-full h-32 p-0 m-0">
                        <img
                          src={selectedMarker.listingsData.homePhotos[0]}
                          alt="Home Photo"
                          className="w-full h-full object-cover p-0 m-0"
                        />
                        {/* Close Button positioned absolutely */}
                        <button
                          className="absolute top-2 right-2 rounded-full p-1 shadow-md z-10 text-black hover:bg-gray-200"
                          onClick={() => setSelectedMarker(null)}
                        >
                          ✕
                        </button>
                      </div>

                      {/* Content Section */}
                      <div className="p-2">
                        <h5 className="font-semibold">
                          {selectedMarker.FacilityName}
                        </h5>
                        <div>{selectedMarker.LocationAddress}</div>
                        <div>{`${selectedMarker.LocationCity}, ${selectedMarker.LocationState} ${selectedMarker.LocationZipCode}`}</div>
                        <div className="mt-2 text-center">
                          {
                            selectedMarker.roomsData.filter(
                              (room) => room.isAvailable
                            ).length
                          }{' '}
                          rooms available
                        </div>
                      </div>
                    </div>
                  </InfoWindowF>
                )}
              </GoogleMap>
            ) : (
              <div>Loading ...</div>
            )}
            <div>
              <h6
                style={{
                  textAlign: 'left',
                  marginTop: '4px',
                  marginBottom: '2px',
                }}
              >
                Neighboring cities near {zip}
              </h6>
              <ul
                style={{
                  display: 'flex',
                  gap: '20px',
                  justifyContent: 'left',
                  paddingLeft: 0,
                }}
              >
                {nearbyBigCities &&
                  nearbyBigCities.map((city) => (
                    <li
                      key={city.name}
                      onClick={() => panToCity(city)}
                      style={{
                        listStyle: 'none',
                        textAlign: 'left',
                        cursor: 'pointer',
                      }}
                    >
                      {/* <img src={city.image} alt={city.name} style={{ width: "50px", height: '50px', objectFit: "cover", borderRadius: "5px", margin: '0 auto' }} /> */}
                      <div>{city.name}</div>
                    </li>
                  ))}
              </ul>
            </div>
          </div>

          <div
            className="pcards_right CFblackBackground"
            style={{
              flex: 1,
              maxHeight: '500px',
              overflowY: 'auto',
            }}
            ref={providerListRef}
          >
            {providers && providers.length > 0 ? (
              providers.map((provider) => (
                <ProviderCard
                  key={provider.LicenseNumber}
                  provider={provider}
                  onClick={() => handleProviderSelect(provider)}
                  hasSurvey={hasSurvey}
                  setSurveyModalOpen={setSurveyModalOpen}
                />
              ))
            ) : (
              <div>No providers found</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboardMap;
