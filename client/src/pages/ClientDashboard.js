import React, { useState, useEffect, useRef } from "react";
import { Card, Button, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import {
	GoogleMap,
	useLoadScript,
	Marker,
	InfoWindowF,
} from "@react-google-maps/api";
import TopNav from "../components/TopNav";
import Footer from "../components/Footer";
import axios from "axios";
import ProviderCard from "../components/ProviderCard";
import { debounce } from "lodash";

export default function ClientDashboard() {
	const [error, setError] = useState("");
	const [open, setOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const { logout, currentUser } = useAuth();
	const navigate = useNavigate();
	const [providers, setProviders] = useState([]);
	const [map, setMap] = useState(null);
	const [mapBounds, setMapBounds] = useState(null);
	const isMounted = useRef(false);
	const [selectedMarker, setSelectedMarker] = useState(null); // State to track selected marker
	const mapRef = useRef(null); // useRef to store the map instance
	const boundsRef = useRef(null); // useRef to store the boundaries
	const providerListRef = useRef(null);
	const [isScrolling, setIsScrolling] = useState(false);
	const [isBoundsChanging, setIsBoundsChanging] = useState(false);
	const [prevBounds, setPrevBounds] = useState(null);
	const [isMapDraggable, setIsMapDraggable] = useState(true);
	const [initialLoad, setInitialLoad] = useState(true);
	const [zip, setZip] = useState(null);
	const [city, setCity] = useState(null);
	const [nearbyBigCities, setNearbyBigCities] = useState([]);

	let delayDuration = 500;

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
			})
			.then((response) => {
				setProviders(response.data.providers);
				setNearbyBigCities(response.data.nearbyBigCities);
				setZip(response.data.currentZipCode);
				setCity(response.data.cityName);
			})
			.catch((error) => {
				console.error("Error fetching providers:", error);
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

	const { isLoaded } = useLoadScript({
		googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
	});

	const mapOptions = {
		minZoom: 12,
	};

	const radiusRef = useRef(3200);
	const zoomRef = useRef(13);

	const handleMapLoad = (map) => {
		mapRef.current = map; // Store the map instance in the ref
	};

	useEffect(() => {
		if (initialLoad) {
			handleMapBoundsChanged();
			setInitialLoad(false); // Set initialLoad to false after the initial load
		}
	}, []);

	const handleSearch = async () => {
		const query = searchQuery.trim();
		const isZipCode = /^\d{5}$/.test(query); // Check if the query is a 5-digit zipcode
		const hasCityAndState = /\w+,\s*\w{2}/.test(query);
		if (isZipCode || hasCityAndState) {
			try {
				const response = await axios.post(`${process.env.REACT_APP_ENDPOINT}/getAddress`, {
					address: query,
				});
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
				console.error("Error searching:", error);
			}
		} else {
			// If the query doesn't contain a valid zipcode or city, prompt the user to enter a valid input
			alert(
				"Please enter a valid city and state (e.g., City, State) or a valid 5-digit zipcode."
			);
		}
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

	// const scrollToProvider = (providerId) => {
	// 	if (providerListRef.current) {
	//     console.log('jaks')
	// 		const providerElement = providerListRef.current.querySelector(
	// 			`#provider-${providerId}`
	// 		);
	// 		if (providerElement) {
	//       console.log('asdfad')
	// 			providerElement.scrollIntoView({ behavior: "smooth", block: "center" });
	// 		}
	// 	}
	// };

	const scrollToProvider = (licenseNumber) => {
		const providerElement = providerListRef.current.querySelector(
			`[data-license-number="${licenseNumber}"]`
		);
		if (providerElement) {
			console.log(providerElement);
			providerElement.scrollIntoView({ behavior: "smooth", block: "center" });
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

	function formatFacilityPOC(name) {
		const [lastName, restName] = name.split(",");
		const [firstName, middleInitial] = restName.split(" ");
		return `${firstName.trim()} ${middleInitial.trim()} ${lastName.trim()}`;
	}

	const handleMapBoundsChanged = debounce(() => {
		if (mapRef.current) {
			const newBounds = mapRef.current.getBounds();
			const newCenter = newBounds.getCenter();
			const latDiff = Math.abs(startingPosition.current.lat - newCenter.lat());
			const lngDiff = Math.abs(startingPosition.current.lng - newCenter.lng());
			const threshold = 0.00001; // Adjust the threshold value as needed

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

	const handleMarkerClick = (marker) => {
		setSelectedMarker(marker);
		scrollToProvider(marker.LicenseNumber);
	};

	async function handleLogout() {
		setError("");

		try {
			await logout();
			navigate("/login");
		} catch {
			setError("Failed to log out");
		}
	}

	return (
		// <>
		// 	<TopNav />
		// 	<div className="CFblackBackground">
		// 		<div className="contentContainer clientSearchBar">
		// 			<input
		// 				id="clientSearch"
		// 				name="yyy"
		// 				placeholder="Search city, zip code, etc."
		// 				value={searchQuery}
		// 				onChange={(e) => setSearchQuery(e.target.value)}
		// 				onKeyDown={(e) => {
		// 					if (e.key === "Enter") {
		// 						handleSearch();
		// 					}
		// 				}}
		// 			/>

		// 			<button id="findMatches" type="button" className="btn">
		// 				Find Matches
		// 			</button>

		// 			<Link to="/survey" id="takeSurvey" type="button" className="btn">
		// 				Take Survey
		// 			</Link>
		// 		</div>
		// 	</div>

		// 	<div className="CFblackBackground">
		// 		<div
		// 			style={{
		// 				maxWidth: "1200px",
		// 				marginLeft: "auto",
		// 				marginRight: "auto",
		// 			}}
		// 		>
		// 			<div
		// 				className="clientLProw2left CFblackBackground"
		// 				style={{ height: "400px" }}
		// 			>
		// 				<div style={{ textAlign: "center" }}>
		// 					<h3>{city ? city : "Seattle"}, WA</h3>
		// 					<h6>Licensed AFH care providers in {zip ? zip : "98101"}</h6>
		// 				</div>
		// 				{isLoaded ? (
		// 					<GoogleMap
		// 						zoom={zoomRef.current}
		// 						center={startingPosition.current}
		// 						mapContainerStyle={{ width: "100%", height: "100%" }}
		// 						onLoad={handleMapLoad}
		// 						onBoundsChanged={handleMapBoundsChanged}
		// 						options={mapOptions}
		// 					>
		// 						{providers.length > 0 &&
		// 							providers.map((provider) => (
		// 								<Marker
		// 									key={provider.id}
		// 									position={provider.position}
		// 									onClick={() => {
		// 										handleMarkerClick(provider);
		// 										return false; // Handle the click event and open the InfoWindow
		// 									}}
		// 									// You can customize markers with icons, labels, etc. here
		// 								/>
		// 							))}
		// 						{selectedMarker && (
		// 							<InfoWindowF
		// 								position={selectedMarker.position}
		// 								onCloseClick={() => setSelectedMarker(null)}
		// 							>
		// 								<div style={{ color: "black" }}>
		// 									<div>
		// 										<h5>{formatFacilityPOC(selectedMarker.FacilityPOC)}</h5>
		// 									</div>
		// 									<div>
		// 										<div>{selectedMarker.LocationAddress}</div>
		// 									</div>
		// 									<div>
		// 										<div>
		// 											{selectedMarker.LocationCity},{" "}
		// 											{selectedMarker.LocationState}{" "}
		// 											{selectedMarker.LocationZipCode}
		// 										</div>
		// 									</div>
		// 								</div>
		// 							</InfoWindowF>
		// 						)}
		// 					</GoogleMap>
		// 				) : (
		// 					<div>Loading ...</div>
		// 				)}
		// 				<div>
		// 					<h6 style={{ textAlign: "center" }}>
		// 						Neighboring cities near {zip}
		// 					</h6>
		// 					<ul
		// 						style={{
		// 							display: "flex",
		// 							gap: "20px",
		// 							justifyContent: "flex-start",
		// 						}}
		// 					>
		// 						{nearbyBigCities.map((city) => (
		// 							<li key={city.name} onClick={() => panToCity(city)}>
		// 								{city.name}
		// 							</li>
		// 						))}
		// 					</ul>
		// 				</div>
		// 			</div>

		// 			<div
		// 				className="clientLProw2right CFblackBackground"
		// 				style={{ maxHeight: "400px", overflowY: "auto" }}
		// 				ref={providerListRef}
		// 			>
		// 				{providers.length > 0 ? (
		// 					providers.map((provider) => (
		// 						<ProviderCard
		// 							key={provider.LicenseNumber}
		// 							provider={provider}
		// 							onClick={() => handleProviderSelect(provider)}
		// 						/>
		// 					))
		// 				) : (
		// 					<div>No providers found</div>
		// 				)}
		// 			</div>

		// 			<div className="clear"></div>
		// 		</div>
		// 	</div>

		// 	<div className="contentContainer utilityPage">
		// 		<div className="clientDashboard">
		// 			<div className="w-100 text-center mt-2">
		// 				{currentUser ? (
		// 					<>
		// 						<Button variant="link" onClick={handleLogout}>
		// 							Log Out
		// 						</Button>
		// 					</>
		// 				) : (
		// 					<>
		// 						<Button variant="link" onClick={() => navigate("/login")}>
		// 							Log In
		// 						</Button>
		// 					</>
		// 				)}
		// 			</div>
		// 		</div>
		// 	</div>
		// 	<Footer />
		// </>
		<>
      <TopNav />
      <div className="CFblackBackground">
        <div className="contentContainer clientSearchBar" style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" }}>
          <input
            id="clientSearch"
            name="yyy"
            placeholder="Search city, zip code etc."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            style={{ padding: "10px", borderRadius: "25px", width: "60%", marginRight: "10px" }}
          />
          <button
            id="findMatches"
            type="button"
            className="btn"
            onClick={handleSearch}
            style={{ padding: "10px 20px", borderRadius: "25px", backgroundColor: "#FFA500", color: "white", marginRight: "10px" }}
          >
            Find a Match
          </button>
          <Link to="/survey" id="takeSurvey" type="button" className="btn" style={{ padding: "10px 20px", borderRadius: "25px", backgroundColor: "#FF69B4", color: "white" }}>
            Contact us
          </Link>
        </div>
      </div>

      <div className="CFblackBackground" style={{ backgroundColor: "#1E1E1E" }}>
        <div className="contentContainer" style={{ padding: "20px" }}>
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <h3>{city ? city : "Woodinville"}, WA</h3>
            <h6>Licensed AFH care providers in {zip ? zip : "98072"}</h6>
          </div>
          <div className="providersRow" style={{ display: "flex" }}>
            <div className="googleMapsContainer" style={{ flex: 1, paddingRight: "20px" }}>
              {isLoaded ? (
                <GoogleMap
                  zoom={zoomRef.current}
                  center={startingPosition.current}
                  mapContainerStyle={{ width: "100%", height: "500px" }}
                  onLoad={handleMapLoad}
                  onBoundsChanged={handleMapBoundsChanged}
                  options={mapOptions}
                >
                  {providers.length > 0 &&
                    providers.map((provider) => (
                      <Marker
                        key={provider.id}
                        position={provider.position}
                        onClick={() => handleMarkerClick(provider)}
                      />
                    ))}
                  {selectedMarker && (
                    <InfoWindowF
                      position={selectedMarker.position}
                      onCloseClick={() => setSelectedMarker(null)}
                    >
                      <div style={{ color: "black" }}>
                        <h5>{formatFacilityPOC(selectedMarker.FacilityPOC)}</h5>
                        <div>{selectedMarker.LocationAddress}</div>
                        <div>{`${selectedMarker.LocationCity}, ${selectedMarker.LocationState} ${selectedMarker.LocationZipCode}`}</div>
                      </div>
                    </InfoWindowF>
                  )}
                </GoogleMap>
              ) : (
                <div>Loading ...</div>
              )}
              <div>
                <h6 style={{ textAlign: "center" }}>Neighboring cities near {zip}</h6>
                <ul style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
                  {nearbyBigCities.map((city) => (
                    <li key={city.name} onClick={() => panToCity(city)} style={{listStyle: 'none', textAlign: 'center'}}>
                      {/* <img src={city.image} alt={city.name} style={{ width: "50px", height: '50px', objectFit: "cover", borderRadius: "5px", margin: '0 auto' }} /> */}
                      <div>{city.name}</div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div
              className="clientLProw2right CFblackBackground"
              style={{ flex: 1, maxHeight: "500px", overflowY: "auto", backgroundColor: "#282828", borderRadius: "15px", padding: "15px" }}
              ref={providerListRef}
            >
              {providers.length > 0 ? (
                providers.map((provider) => (
                  <ProviderCard
                    key={provider.LicenseNumber}
                    provider={provider}
                    onClick={() => handleProviderSelect(provider)}
                  />
                ))
              ) : (
                <div>No providers found</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="contentContainer utilityPage" style={{ padding: "20px" }}>
        <div className="clientDashboard">
          <div className="w-100 text-center mt-2">
            {currentUser ? (
              <>
                <Button variant="link" onClick={handleLogout} style={{ color: "white" }}>
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="link" onClick={() => navigate("/login")} style={{ color: "white" }}>
                  Log In
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>

			
	);
}
