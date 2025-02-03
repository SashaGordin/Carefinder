import React, { useState, useEffect, useRef } from 'react';
import TopNav from '../components/TopNav';
import Footer from '../components/Footer';
import axios from 'axios';
import { debounce } from 'lodash';
import { useLocation, useNavigate } from 'react-router-dom';
import { formatName } from '../utils';
import mapStyles from '../mapStyles.json';
import SurveyModal from '../components/SurveyModal';
import { useAuth } from '../contexts/AuthContext';
import ClientDashboardSearchBar from '../components/ClientDashboard/ClientDashboardSearchBar';
import ClientDashboardMap from '../components/ClientDashboard/ClientDashboardMap';

export default function ClientDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [providers, setProviders] = useState([]);
  const [mapBounds, setMapBounds] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null); // State to track selected marker
  const mapRef = useRef(null); // useRef to store the map instance
  const boundsRef = useRef(null); // useRef to store the boundaries
  const [isBoundsChanging, setIsBoundsChanging] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [zip, setZip] = useState(null);
  const [city, setCity] = useState(null);
  const [nearbyBigCities, setNearbyBigCities] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [surveyModalOpen, setSurveyModalOpen] = useState(false);
  const [hasSurvey, setHasSurvey] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  let delayDuration = 500;

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const refLookup = searchParams.get('refLookup');

  useEffect(() => {
    return () => {
      debouncedGetProviders.current.cancel();
    };
  }, []);

  useEffect(() => {
    if (mapBounds) {
      debouncedGetProviders.current(); // Only runs when `mapBounds` updates
    }
  }, [mapBounds]);

  // ADDED THIS TO GRAB a posible "refLookup" passed here.
  // Need to make this autoload on the page somehow, if present and valic
  // const location = useLocation();
  // const searchParams = new URLSearchParams(location.search);a
  // const refLookup = searchParams.get('refLookup');

  const getProvidersFromBounds = () => {
    setIsBoundsChanging(false);
    axios
      .post(`${process.env.REACT_APP_ENDPOINT}/getProviders`, {
        bounds: {
          north: boundsRef.current.getNorthEast().lat(),
          south: boundsRef.current.getSouthWest().lat(),
          east: boundsRef.current.getNorthEast().lng(),
          west: boundsRef.current.getSouthWest().lng(),
        },
        center: startingPosition.current,
        radius: radiusRef.current,
        zoomLevel: zoomRef.current,
      })
      .then((response) => {
        setProviders(response.data.providers);
        setNearbyBigCities(response.data.nearbyBigCities);
        setZip(response.data.currentZipCode);
        setCity(response.data.cityName);
      })
      .catch((error) => {
        console.error('Error fetching providers:', error);
      });
  };

  //IN PROGRESS
  // const getAvailListings = () => {
  // 	axios
  // 		.post("${process.env.REACT_APP_ENDPOINT}/getAvailListings", {})
  // 		.then((response) => {
  // 			console.log(response.data);
  // 			const listingPaths = response.data.listingPaths;
  // 			for (let path of listingPaths) {
  // 				axios.post("${process.env.REACT_APP_ENDPOINT}/getRoomDataForListingPath", {listingPath: path}).then((response) => {
  // 					console.log(response.data.roomData);
  // 				});
  // 			}
  // 		})
  // 		.catch((error) => {
  // 			console.error("Error fetching avail listings:", error);
  // 		});
  // };

  const debouncedGetProviders = useRef(
    debounce(getProvidersFromBounds, delayDuration)
  );

  const startingPosition = useRef({ lat: 47.7543, lng: -122.1635 });

  const radiusRef = useRef(3200);
  const zoomRef = useRef(13);

  useEffect(() => {
    axios
      .post(`${process.env.REACT_APP_ENDPOINT}/getSurvey`, {
        userId: currentUser.uid,
      })
      .then((res) => {
        console.log('res', res);
        if (res.data.survey.length > 0) {
          console.log('res.data.survey', res.data.survey);
          setHasSurvey(true);
        }
      })
      .catch((err) => {
        console.log('Error getting survey', err);
      });
  }, []);

  useEffect(() => {
    if (initialLoad) {
      if (refLookup) {
        setSearchQuery(refLookup);
        handleSearch(refLookup);
      } else {
        handleMapBoundsChanged();
      }
      setInitialLoad(false); // Set initialLoad to false after the initial load
    }
    // eslint-disable-next-line
  }, []);

  const handleFindMatches = () => {
    if (hasSurvey) {
      handleSearch();
    } else {
      navigate('/survey');
    }
  };

  const handleSearch = async (refQuery) => {
    let query;
    if (refQuery) {
      query = refQuery.trim();
    } else {
      query = searchQuery.trim();
    }
    const isZipCode = /^\d{5}$/.test(query); // Check if the query is a 5-digit zipcode
    const hasCityAndState = /\w+,\s*\w{2}/.test(query);
    if (isZipCode || hasCityAndState) {
      setErrorMessage('');
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_ENDPOINT}/getAddress`,
          {
            address: query,
          }
        );
        console.log('response', response);
        const { lat, lng } = response.data.address;
        startingPosition.current = { lat: lat, lng: lng };
        mapRef.current.panTo(startingPosition.current);
        const fixedBounds = calculateFixedBounds(
          startingPosition.current,
          radiusRef.current
        );
        const newBounds = new window.google.maps.LatLngBounds(
          new window.google.maps.LatLng(fixedBounds.south, fixedBounds.west),
          new window.google.maps.LatLng(fixedBounds.north, fixedBounds.east)
        );
        boundsRef.current = newBounds;
        getProvidersFromBounds();
      } catch (error) {
        console.error('Error searching for providers:', error);
        setErrorMessage('An error occurred while searching. Please try again.');
      }
    } else {
      // If the query doesn't contain a valid zipcode or city, prompt the user to enter a valid input
      setErrorMessage(
        'Please enter a valid city and state (City, State) or a valid 5-digit zipcode.'
      );
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

  const handleMapBoundsChanged = debounce(() => {
    if (mapRef.current) {
      const newBounds = mapRef.current.getBounds();
      const newCenter = newBounds.getCenter();
      const latDiff = Math.abs(startingPosition.current.lat - newCenter.lat());
      const lngDiff = Math.abs(startingPosition.current.lng - newCenter.lng());
      const threshold = 0.001; // Adjust the threshold value as needed

      if (initialLoad || latDiff > threshold || lngDiff > threshold) {
        boundsRef.current = newBounds;
        if (mapRef.current.getZoom() > zoomRef.current) {
          radiusRef.current /= 2;
        } else if (mapRef.current.getZoom() < zoomRef.current) {
          radiusRef.current *= 2;
        }

        zoomRef.current = mapRef.current.getZoom();
        startingPosition.current = {
          lat: newCenter.lat(),
          lng: newCenter.lng(),
        };
        setMapBounds(newBounds); // Update map bounds
        setIsBoundsChanging(true);
        debouncedGetProviders.current();
      }
    }
  }, 500);

  useEffect(() => {
    if (!isBoundsChanging && boundsRef.current) {
      getProvidersFromBounds();
    }
  }, [isBoundsChanging, mapBounds]);

  return (
    <>
      <TopNav />
      <ClientDashboardSearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        handleFindMatches={handleFindMatches}
        errorMessage={errorMessage}
      />

      <ClientDashboardMap
        providers={providers}
        selectedMarker={selectedMarker}
        setSelectedMarker={setSelectedMarker}
        zip={zip}
        city={city}
        zoomRef={zoomRef}
        startingPosition={startingPosition}
        handleMapBoundsChanged={handleMapBoundsChanged}
        nearbyBigCities={nearbyBigCities}
        hasSurvey={hasSurvey}
        setSurveyModalOpen={setSurveyModalOpen}
        mapRef={mapRef}
        boundsRef={boundsRef}
        radiusRef={radiusRef}
        mapStyles={mapStyles}
        getProvidersFromBounds={getProvidersFromBounds}
      />
      <SurveyModal
        showModal={surveyModalOpen}
        handleCloseModal={() => setSurveyModalOpen(false)}
      />
      <Footer />
    </>
  );
}
