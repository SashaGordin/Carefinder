import { GoogleMap, Marker, DirectionsRenderer } from "@react-google-maps/api";
import React, { useState, useEffect } from "react";

export default function VisitingMap({ provider, addresses, setAddresses }) {
	const [directions, setDirections] = useState([]);
	const [map, setMap] = useState(null);
	const [markers, setMarkers] = useState([]);
	const [newAddress, setNewAddress] = useState(""); // State to store the new address input

	// Function to geocode an address and return lat/lng
	const geocodeAddress = async (address) => {
		const geocoder = new window.google.maps.Geocoder();
		return new Promise((resolve, reject) => {
			geocoder.geocode({ address }, (results, status) => {
				if (status === "OK" && results[0]) {
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
					addresses.map(async (address) => {
						try {
							const coords = await geocodeAddress(address);
							return { ...coords, label: address };
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
	}, [addresses]); // Dependencies: addresses

	// Calculate route for each address to the provider
	const calculateRoutes = async () => {
		const directionsService = new window.google.maps.DirectionsService();
		const allDirections = await Promise.all(
			addresses.map(async (address) => {
				try {
					const { lat, lng } = await geocodeAddress(address);
					const results = await directionsService.route({
						origin: { lat, lng },
						destination: {
							lat: provider.position.lat,
							lng: provider.position.lng,
						},
						travelMode: window.google.maps.TravelMode.DRIVING,
					});
					return results;
				} catch (error) {
					console.error(`Error calculating route for ${address}:`, error);
					return null;
				}
			})
		);
		// Filter out null results
		setDirections(allDirections.filter((route) => route !== null));
	};

	// Re-run the route calculation if addresses or provider position change
	useEffect(() => {
		if (addresses?.length > 0) {
			calculateRoutes();
		}
	}, [addresses, provider.position]); // Dependencies: addresses and provider.position

	// Handle new address input
	const handleAddressSubmit = (event) => {
		event.preventDefault();
		if (newAddress) {
			setAddresses([...addresses, newAddress]); // Add the new address to the list
			setNewAddress(""); // Clear the input field
		}
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
				<button type="submit" className="bg-blue-500 text-white p-2 rounded">
					Add Address
				</button>
			</form>

			<GoogleMap
				mapContainerStyle={{
					height: "300px",
					width: "100%",
					marginBottom: "20px",
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
				/>

				{/* Mark the user's addresses */}
				{markers.map((marker, index) => (
					<Marker key={index} position={marker} label={marker.label} />
				))}

				{/* Render routes for each address */}
				{directions.map((direction, index) => (
					<DirectionsRenderer key={index} directions={direction} />
				))}
			</GoogleMap>
		</div>
	);
}
