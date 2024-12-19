import { GoogleMap, Marker, Polyline } from '@react-google-maps/api';
import React, { useState, useEffect } from 'react';

export default function VisitingMap({ provider, addresses, setAddresses }) {
  const [routes, setRoutes] = useState([]);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [newAddress, setNewAddress] = useState('');
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(null);

  // Function to geocode an address and return lat/lng
  const geocodeAddress = async (address) => {
    const geocoder = new window.google.maps.Geocoder();
    return new Promise((resolve, reject) => {
      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const location = results[0].geometry.location;
          resolve({ lat: location.lat(), lng: location.lng() });
        } else {
          reject(`Geocode failed for address: ${address}`);
        }
      });
    });
  };

  // Geocode initial addresses on component mount
  useEffect(() => {
    const initializeMarkers = async () => {
      if (addresses?.length > 0) {
        const initialMarkers = await Promise.all(
          addresses.map(async (address, index) => {
            try {
              const coords = await geocodeAddress(address);
              return { ...coords, label: index.toString() };
            } catch (error) {
              console.error(error);
              return null;
            }
          })
        );
        setMarkers(initialMarkers.filter((marker) => marker !== null));
      }
    };

    initializeMarkers();
  }, [addresses]);

  // Calculate route for each address to the provider
  const calculateRoutes = async () => {
    const directionsService = new window.google.maps.DirectionsService();
    const allRoutes = await Promise.all(
      addresses.map(async (address) => {
        try {
          const { lat, lng } = await geocodeAddress(address);
          const result = await directionsService.route({
            origin: { lat, lng },
            destination: {
              lat: provider.position.lat,
              lng: provider.position.lng,
            },
            travelMode: window.google.maps.TravelMode.DRIVING,
          });
          return result.routes[0];
        } catch (error) {
          console.error(`Error calculating route for ${address}:`, error);
          return null;
        }
      })
    );
    setRoutes(allRoutes.filter((route) => route !== null));
    setSelectedRouteIndex(null);
  };

  // Re-run the route calculation if addresses or provider position change
  useEffect(() => {
    if (addresses?.length > 0) {
      calculateRoutes();
    }
  }, [addresses, provider.position]);

  // Handle new address input
  const handleAddressSubmit = (event) => {
    event.preventDefault();
    if (newAddress) {
      setAddresses([...addresses, newAddress]);
      setNewAddress('');
    }
  };

  // Handle selecting a route on click
  const handleRouteClick = (index) => {
    setSelectedRouteIndex(index);
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Input form for new address */}
      <form onSubmit={handleAddressSubmit} className="flex gap-2">
        <input
          type="text"
          value={newAddress}
          onChange={(e) => setNewAddress(e.target.value)}
          placeholder="Enter new address"
          className="border p-2"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 mb-2 rounded"
        >
          Add Address
        </button>
      </form>

      <GoogleMap
        mapContainerStyle={{
          height: '300px',
          width: '100%',
          marginBottom: '20px',
          borderRadius: 10,
        }}
        center={{ lat: provider.position.lat, lng: provider.position.lng }}
        zoom={12}
        onLoad={(map) => setMap(map)}
        options={{
          disableDefaultUI: true,
        }}
      >
        {/* Mark the provider's location */}
        <Marker
          position={{ lat: provider.position.lat, lng: provider.position.lng }}
          label="Provider"
          key="provider"
        />

        {/* Mark the user's addresses */}
        {markers.map((marker, index) => (
          <Marker
            key={index}
            position={marker}
            label={marker.label}
            onClick={() => handleRouteClick(index)}
          />
        ))}

        {/* Render polylines for each route */}
        {routes.map((route, index) => (
          <Polyline
            key={index}
            path={route.overview_path}
            options={{
              strokeColor: selectedRouteIndex === index ? '#0000FF' : '#C71585',
              strokeOpacity: selectedRouteIndex === index ? 1.0 : 0.5,
              strokeWeight: selectedRouteIndex === index ? 6 : 4,
            }}
            onClick={() => handleRouteClick(index)}
          />
        ))}

        {/* Display selected route duration */}
      </GoogleMap>
      {selectedRouteIndex !== null && routes[selectedRouteIndex] && (
        <div className="text-center bg-white p-2 rounded shadow-md text-black">
          <p>
            <strong>Duration:</strong>{' '}
            {routes[selectedRouteIndex].legs[0].duration.text}
          </p>
        </div>
      )}
    </div>
  );
}
