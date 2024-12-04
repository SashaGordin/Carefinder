import { Card } from "react-bootstrap";
import ProviderProfileCard from "./ProviderProfileCard";
import React, { useState } from "react";
import PropertyPhotoModal from "./PropertyPhotoModal";

const ProviderCard = ({ provider, onClick }) => {

	const { FacilityName, listingsData } = provider;

	const isReal = listingsData !== undefined;
	const homePhotos = listingsData.homePhotos;

	let roomPhotos = [];
	console.log("listingsData", listingsData);

	if (isReal && listingsData.roomData) { roomPhotos = listingsData.roomData.map((room) => room.roomPhotos); }

	const [showModal, setShowModal] = useState(false);

	const handleImageClick = () => { setShowModal(true); };

	return (
		<>
			{ isReal ? (
				<div className="Pcard">
					<Card>
						<Card.Body style={{ display: "flex", flexDirection: "row", fontSize: "12px", maxHeight: "200px" }}
							onClick={() => onClick(provider)} >
							<ProviderProfileCard provider={provider} />
							<div style={{ display: "flex", flexDirection: "column", flex: 1, margin: "0px 0px 0px 10px"	}}	>
								<img
									style={{
										maxWidth: "100%",        // Ensures the image doesn’t exceed the container width
										width: "auto",            // Width is automatically calculated to maintain aspect ratio
										height: "auto",           // Height is automatically calculated to maintain aspect ratio
										maxHeight: "calc(100% - 30px)",  // Limits the height to avoid overflow
										marginBottom: 3,          // Adds a small bottom margin
										borderTopRightRadius: 10,         // Rounds the corners of the image
										borderTopLeftRadius: 10,         // Rounds the corners of the image
										display: "block",          // Ensures there’s no space below the image (removes inline-block gap)
										cursor: "pointer"
									}}
									src={homePhotos[0]} alt="Profile pic" onClick={handleImageClick} />
								<div style={{ textAlign: "center", fontWeight:"bold", paddingTop:"4px",cursor: "pointer" }}>
									{FacilityName.length > 25 ? `${FacilityName.substring(0, 25)}...` : FacilityName}
								</div>
							</div>
						</Card.Body>
					</Card>
					{showModal && (
						<PropertyPhotoModal showModal={showModal} setShowModal={setShowModal} FacilityName={FacilityName} homePhotos={homePhotos} roomPhotos={roomPhotos} />
					)}
				</div>
			) : (
				<Card>
					<Card.Body style={{	display: "flex",flexDirection: "row", fontSize: "12px", maxHeight: "200px" }}
						onClick={() => onClick(provider)} >
						{/* <ProviderProfileCard provider={provider} /> */}
						<div style={{ display: "flex", flexDirection: "column",	flex: 1, margin: "5px" }} >
							{/* <img style={{ maxWidth: "100%", width: "auto", height: "auto", maxHeight: "calc(100% - 20px)" }}
								src={homePhotos[0]} alt="Profile pic" onClick={handleImageClick}/> */}
							<div style={{ textAlign: "center" }}>{FacilityName}</div>
						</div>
					</Card.Body>
				</Card>
			)}
		</>
	);
};

export default ProviderCard;
