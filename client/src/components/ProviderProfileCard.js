import React, { useState } from "react";
import { Card, Button } from "react-bootstrap";
import ViewProfile from "./ViewProfile";

const ProviderProfileCard = ({ provider }) => {
	const {
		profilePicPath,
		FacilityPOC,
		FacilityName,
		listingsData, // Add more fields as needed
		Speciality,
	} = provider;
	console.log("adskfjslkdjf", provider);

	const [showModal, setShowModal] = useState(false);

	const handleShow = () => setShowModal(true);

	console.log("this is the provider", provider);
	return (
		<>
			<div
				className="flex flex-row flex-1 m-0"
				data-license-number={provider.LicenseNumber}
			>
				<img
					className="cardPicLeft"
					src={profilePicPath}
					alt="Profile pic"
					style={{ marginRight: 10, borderRadius: 10 }}
				/>
				<div className="flex flex-col">
					<Card.Title>{FacilityPOC}</Card.Title>
					<div style={{ marginBottom: 5 }}>5 miles</div>
					<Button className="text-xs" onClick={handleShow}>
						View profile
					</Button>
				</div>
			</div>

			{/*
				*** THIS IS THE MAIN MODAL WHEN YOU CLICK ON A PROVIDER
				--From here, you can click on a pic to get a sub-modal of the pics.
			*/}

			{showModal && (
				<ViewProfile
					provider={provider}
					showModal={showModal}
					setShowModal={setShowModal}
				/>
			)}
		</>
	);
};

export default ProviderProfileCard;
