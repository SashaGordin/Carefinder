import { Card } from "react-bootstrap";
import ProviderProfileCard from "./ProviderProfileCard";
import React, { useState } from "react";
import PropertyPhotoModal from "./PropertyPhotoModal";

const ProviderCard = ({ provider, onClick }) => {
	const {
		FacilityName,
		homePhotos,
		listingsData
		// Add more fields as needed
	} = provider;

	const roomPhotos = listingsData[0].roomData.map((room) => room.roomPhotos);
	console.log(provider);
	const [showModal, setShowModal] = useState(false);

  const handleImageClick = () => {
    setShowModal(true);
  };

	return (
		<>
			<div className="providerCard">
				<Card>
					<Card.Body
						style={{
							display: "flex",
							flexDirection: "row",
							fontSize: "12px",
							maxHeight: "200px",
						}}
						onClick={() => onClick(provider)}
					>
						<ProviderProfileCard provider={provider} />
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								flex: 1,
								margin: "5px",
							}}
						>
							<img
								style={{
									maxWidth: "100%",
									width: "auto",
									height: "auto",
									maxHeight: "calc(100% - 20px)", 
									marginBottom:3,
									borderRadius:10
									// Adjust the height relative to the parent container's height
								}} // Set max-width and max-height for the image
								src={homePhotos[0]}
								alt="Profile pic"
								onClick={handleImageClick}
							/>
							<div style={{ textAlign: "center" }}>{FacilityName}</div>
						</div>
					</Card.Body>
				</Card>
			</div>
			{showModal && (
				<PropertyPhotoModal showModal={showModal} setShowModal={setShowModal} FacilityName={FacilityName} homePhotos={homePhotos} roomPhotos={roomPhotos} />
			)}
		</>
	);
};

export default ProviderCard;
