import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
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
import { useLocation } from "react-router-dom";

/**
 * TODO:  This page accepts a new param in the URL, sent here from the home page. Sample is:
 * /client-dashboard?refLookup=Seattle%2C%20WA
 * ...So, we need to grab that "refLookup" (if present), parse it as necessary, and then
 * pass it to the script below so that people can see their search immediately.
 * I imported useLocation, above to grab it, and then isolated it below as 'refLookup'
 * But I'm not sure how to best pass it to the page as a default location.
 * I think maybe we'd use a useEffect and, if the refLookup is present, we lookup its latitude/longitude using google Geocoder, and then set the lat/long as startingpoint instead of the existing default starting point. Since @sasha is most familiar here, I thought I'd leave it for you.
 *
 *
 * ALSO...
 * Anyone can now search this page and see results (no login required.) BUT, Micah wants it so that, when the provider card comes up, you have to be logged in to be able to continue (e.g., messsage the provider or reserve a room). I wasn't sure what the final flow is, but I think basically if they're not logged in, then the reserve room and message buttons would maybe either just go to the signup / login page, or maybe flash an alert on screen first to tell people they need to join (for free) first before continuing. I didn't make this change as I wasn't sure what the final flow would be.
 */

export default function ClientDashboard() {
	const [searchQuery, setSearchQuery] = useState("");
	const [providers, setProviders] = useState([]);
	const [mapBounds, setMapBounds] = useState(null);
	const [selectedMarker, setSelectedMarker] = useState(null); // State to track selected marker
	const mapRef = useRef(null); // useRef to store the map instance
	const boundsRef = useRef(null); // useRef to store the boundaries
	const providerListRef = useRef(null);
	const [isBoundsChanging, setIsBoundsChanging] = useState(false);
	const [initialLoad, setInitialLoad] = useState(true);
	const [zip, setZip] = useState(null);
	const [city, setCity] = useState(null);
	const [nearbyBigCities, setNearbyBigCities] = useState([]);
	const [errorMessage, setErrorMessage] = useState("");



	let delayDuration = 500;

	const location = useLocation();
	const searchParams = new URLSearchParams(location.search);
	const refLookup = searchParams.get("refLookup");

	// ADDED THIS TO GRAB a posible "refLookup" passed here.
	// Need to make this autoload on the page somehow, if present and valic
	// const location = useLocation();
	// const searchParams = new URLSearchParams(location.search);
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
			if (refLookup) {
				setSearchQuery(refLookup);
				handleSearch(refLookup);
			} else {
				handleMapBoundsChanged();
			}
			setInitialLoad(false); // Set initialLoad to false after the initial load
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

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
			setErrorMessage("");
			try {
				const response = await axios.post(
					`${process.env.REACT_APP_ENDPOINT}/getAddress`,
					{
						address: query,
					}
				);
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
				setErrorMessage("An error occurred while searching. Please try again.");
			}
		} else {
			// If the query doesn't contain a valid zipcode or city, prompt the user to enter a valid input
			setErrorMessage("Please enter a valid city and state (City, State) or a valid 5-digit zipcode.");

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

	return (
		<>
			<TopNav />
			<div className="CFblackBackground">
				<div
					className="contentContainer clientSearchBar"
					style={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						padding: "20px",
					}}
				>
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
						style={{
							padding: "20px 20px 20px 20px",
							borderRadius: "30px",
							width: "50%",
							marginRight: "10px",
							position: "relative",
							top: 6,
							fontSize: "20px",
						}}
					/>
					<button
						id="findMatches"
						type="button"
						className="btn"
						onClick={() => handleSearch()}
						style={{
							padding: "10px 20px",
							borderRadius: "10px",
							backgroundColor: "#FFA500",
							color: "white",
							marginRight: "10px",
						}}
					>
						Find a Match
					</button>
					<Link
						to="/survey"
						id="takeSurvey"
						type="button"
						className="btn"
						style={{
							padding: "10px 20px",
							borderRadius: "10px",
							backgroundColor: "#FF69B4",
							color: "white",
						}}
					>
						Contact us
					</Link>
				</div>
			</div>

			{errorMessage && (
      <div
        style={{
          color: "red",
          marginTop: "10px",
          textAlign: "center",
          width: "100%",
        }}
      >
        {errorMessage}
      </div>
    )}

			<div className="CFblackBackground">
				<div className="contentContainer" style={{ padding: "20px" }}>
					<div style={{ textAlign: "center", marginBottom: "20px" }}>
						<h3>{city ? city : "Woodinville"}, WA</h3>
						<h6>Licensed AFH care providers in {zip ? zip : "98072"}</h6>
					</div>
					<div className="providersRow" style={{ display: "flex" }}>
						<div
							className="googleMapsContainer"
							style={{ flex: 1, paddingRight: "20px" }}
						>
							{isLoaded ? (
								<GoogleMap
									zoom={zoomRef.current}
									center={startingPosition.current}
									mapContainerStyle={{
										width: "100%",
										height: "500px",
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
								<h6 style={{ textAlign: "left", marginTop:"4px", marginBottom:"2px" }}>
									Neighboring cities near {zip}
								</h6>
								<ul
									style={{
										display: "flex",
										gap: "20px",
										justifyContent: "left",
										paddingLeft:0
									}}
								>
									{nearbyBigCities &&
										nearbyBigCities.map((city) => (
											<li
												key={city.name}
												onClick={() => panToCity(city)}
												style={{ listStyle: "none", textAlign: "left", cursor: "pointer" }}
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
								maxHeight: "500px",
								overflowY: "auto",
								borderRadius: "15px",
							}}
							ref={providerListRef}
						>
							{providers && providers.length > 0 ? (
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
			<Footer />
		</>
	);
}
