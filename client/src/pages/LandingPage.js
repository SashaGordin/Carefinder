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

export default function LandingPage() {
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

	let delayDuration = 500;

	const getProvidersFromBounds = () => {
		setIsBoundsChanging(false);
		axios
			.post("http://localhost:3001/getProviders", {
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
			})
			.catch((error) => {
				console.error("Error fetching providers:", error);
			});
	};

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
				const response = await axios.post(`http://localhost:3001/getAddress`, {
					address: query,
				});
				const { lat, lng } = response.data.address;
				startingPosition.current = { lat: lat, lng: lng };
				mapRef.current.panTo(startingPosition.current);
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
    console.log('test');
    console.log(providerListRef.current)
    const providerElement = providerListRef.current.querySelector(
      `[data-license-number="${licenseNumber}"]`
    );
    if (providerElement) {
      console.log(providerElement)
      providerElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

	const handleProviderSelect = (provider) => {
		// Scroll to the selected provider in the map
		console.log("here");
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
		<>
			<TopNav />

			<div className="CFblackBackground">
				<div className="contentContainer clientSearchBar">
					<input
						id="clientSearch"
						name="yyy"
						placeholder="Search city, zip code, etc."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								handleSearch();
							}
						}}
					/>

					<button id="findMatches" type="button" className="btn">
						Find Matches
					</button>

					<Link to="/survey" id="takeSurvey" type="button" className="btn">
						Take Survey
					</Link>
				</div>
			</div>

			<div className="CFblackBackground">
				<div
					style={{
						maxWidth: "1200px",
						marginLeft: "auto",
						marginRight: "auto",
					}}
				>
					<div
						className="clientLProw2left CFblackBackground"
						style={{ height: "400px" }}
					>
						{isLoaded ? (
							<GoogleMap
								zoom={zoomRef.current}
								center={startingPosition.current}
								mapContainerStyle={{ width: "100%", height: "100%" }}
								onLoad={handleMapLoad}
								onBoundsChanged={handleMapBoundsChanged}
								options={mapOptions}
							>
								{providers.map((provider) => (
									<Marker
										key={provider.id}
										position={provider.position}
										onClick={() => {
                      handleMarkerClick(provider);
                      return false; // Handle the click event and open the InfoWindow
                    }}
										// You can customize markers with icons, labels, etc. here
									/>
								))}
								{selectedMarker && (
									<InfoWindowF
										position={selectedMarker.position}
										onCloseClick={() => setSelectedMarker(null)}
									>
										<div style={{ color: "black" }}>
											<div>
												<h5>{formatFacilityPOC(selectedMarker.FacilityPOC)}</h5>
											</div>
											<div>
												<div>{selectedMarker.LocationAddress}</div>
											</div>
											<div>
												<div>
													{selectedMarker.LocationCity},{" "}
													{selectedMarker.LocationState}{" "}
													{selectedMarker.LocationZipCode}
												</div>
											</div>
										</div>
									</InfoWindowF>
								)}
							</GoogleMap>
						) : (
							<div>Loading ...</div>
						)}
					</div>

					<div
						className="clientLProw2right CFblackBackground"
						style={{ maxHeight: "400px", overflowY: "auto" }}
						ref={providerListRef}
					>
						{providers.map((provider) => (
							<ProviderCard
								key={provider.LicenseNumber}
								provider={provider}
								onClick={() => handleProviderSelect(provider)}
							/>
						))}
					</div>

					<div className="clear"></div>
				</div>
			</div>

			<div className="contentContainer utilityPage">
				<div className="clientDashboard">
					<Card>
						<Card.Body>
							<h2 className="text-center mb-4">Dashboard</h2>
							{error && <Alert variant="danger">{error}</Alert>}
							<div className="CFdashboard">
								<strong>Email:</strong>
								<input type="text"></input>
							</div>
						</Card.Body>
					</Card>

					<div className="w-100 text-center mt-2">
						{currentUser ? (
							<>
								<Button variant="link" onClick={handleLogout}>
									Log Out
								</Button>
							</>
						) : (
							<>
								<Button variant="link" onClick={() => navigate("/login")}>
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
