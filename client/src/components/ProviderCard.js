import React from "react";
import { Card, Button } from "react-bootstrap";
import ProviderProfileCard from "./ProviderProfileCard";

const ProviderCard = ({ provider, onClick }) => {
	const {
		FacilityName,
		LocationAddress,
		LocationCity,
		LocationState,
		LocationZipCode,
		TelephoneNmbr,
		profilePicPath,
		FacilityPOC,
		// Add more fields as needed
	} = provider;

  console.log(provider)

	return (
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
							maxHeight: "calc(100% - 20px)", // Adjust the height relative to the parent container's height
						}} // Set max-width and max-height for the image
						src={profilePicPath}
						alt="Profile pic"
					/>
					<div style={{ textAlign: "center" }}>{FacilityName}</div>
				</div>
			</Card.Body>
		</Card>
	);
};

export default ProviderCard;
