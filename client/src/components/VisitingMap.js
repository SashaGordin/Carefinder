import {
	GoogleMap,
	Marker,
	DirectionsRenderer,
} from "@react-google-maps/api";
import React, { useState, useEffect } from "react";

export default function VisitingMap({ provider }) {
	const [userAddress, setUserAddress] = useState("");
	const [directions, setDirections] = useState(null);
	const [map, setMap] = useState(null);
	const [duration, setDuration] = useState(null);

	const handleAddressChange = (event) => {
		setUserAddress(event.target.value);
	};

	useEffect(() => {
		calculateRoute();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userAddress, map]);


	const calculateRoute = async () => {
		if (!userAddress || !map) return;

		const directionsService = new window.google.maps.DirectionsService();
		const results = await directionsService.route({
			origin: userAddress,
			destination: { lat: provider.position.lat, lng: provider.position.lng },
			travelMode: window.google.maps.TravelMode.DRIVING,
		});

		const durationInMinutes = results.routes[0].legs[0].duration.value / 60;

		setDirections(results);
		setDuration(durationInMinutes); // Update this line
		map.fitBounds(results.routes[0].bounds);
	};

	return (
		<div>
			<input
				type="text"
				placeholder="Enter your address"
				value={userAddress}
				onChange={handleAddressChange}
			/>
			{duration && (
				<span>
					Estimated travel time:{" "}
					{Math.floor(duration / 60) > 0
						? `${Math.floor(duration / 60)} hours `
						: ""}
					{Math.round(duration % 60)} minutes
				</span>
			)}
			<GoogleMap
				mapContainerStyle={{
					height: "300px",
					width: "100%",
					marginBottom: "20px",
					borderRadius:10
				}}
				center={{ lat: provider.position.lat, lng: provider.position.lng }}
				zoom={12}
				onLoad={(map) => setMap(map)}
			>
				<Marker
					position={{ lat: provider.position.lat, lng: provider.position.lng }}
				/>
				{directions && <DirectionsRenderer directions={directions} />}
			</GoogleMap>
		</div>
	);
}
