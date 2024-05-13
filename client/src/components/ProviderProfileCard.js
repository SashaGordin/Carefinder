import React, { useState } from "react";
import { Card, Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";

const ProviderProfileCard = ({ provider }) => {
	const {
		profilePicPath,
		FacilityPOC,
		FacilityName,

		// Add more fields as needed
	} = provider;

	const [showModal, setShowModal] = useState(false);

	const handleClose = () => setShowModal(false);
	const handleShow = () => setShowModal(true);

	const facilityImages = [
		profilePicPath,
		profilePicPath,
		profilePicPath,
		profilePicPath,
	];
	console.log([provider]);
	return (
		<>
			<div
				className="provider-card"
				data-license-number={provider.LicenseNumber}
				style={{
					display: "flex",
					flexDirection: "row",
					flex: 1,
					margin: "5px",
				}}
			>
				<img
					style={{ width: "100px" }}
					src={profilePicPath}
					alt="Profile pic"
				/>
				<div style={{ display: "flex", flexDirection: "column" }}>
					<Card.Title>{FacilityPOC}</Card.Title>
					<div>5 miles away</div>
					<Button style={{ fontSize: "10px" }} onClick={handleShow}>
						View profile
					</Button>
				</div>
			</div>

			<Modal
				style={{ color: "#ffffff" }}
				show={showModal}
				onHide={handleClose}
				size="xl"
				centered
			>
				<Modal.Header closeButton>
					<Modal.Title>Provider Profile</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div
						className="provider-card"
						data-license-number={provider.LicenseNumber}
						style={{
							display: "flex",
							flexDirection: "column",
							flex: 1,
							margin: "20px",
							backgroundColor: "#1e1f26",
						}}
					>
						<div style={{ margin: "20px" }}>
							<div
								style={{
									display: "flex",
									flexDirection: "row",
									marginBottom: "20px",
								}}
							>
								<img
									style={{ width: "100%", borderRadius: "25px" }}
									src={profilePicPath}
									alt="Profile pic"
								/>
								<div
									style={{
										display: "flex",
										flexDirection: "column",
										marginLeft: "10px",
									}}
								>
									<img
										style={{
											width: "100%",
											borderRadius: "5px",
											marginBottom: "10px",
										}}
										src={profilePicPath}
										alt="Profile pic"
									/>
									<img
										style={{ width: "100%", borderRadius: "5px" }}
										src={profilePicPath}
										alt="Profile pic"
									/>
								</div>
								<div
									style={{
										display: "flex",
										flexDirection: "column",
										marginLeft: "10px",
									}}
								>
									<img
										style={{
											width: "100%",
											borderRadius: "5px",
											marginBottom: "10px",
										}}
										src={profilePicPath}
										alt="Profile pic"
									/>
									<img
										style={{ width: "100%", borderRadius: "5px" }}
										src={profilePicPath}
										alt="Profile pic"
									/>
								</div>
							</div>
							<div
								style={{
									display: "flex",
									flexDirection: "row",
									justifyContent: "space-between",
								}}
							>
								<div style={{ display: "flex", flexDirection: "column" }}>
									<div style={{ display: "flex", flexDirection: "row" }}>
										<Card.Title>{FacilityPOC}</Card.Title>
										<div>Verified Provider</div>
										<div>Licensed since 1998</div>
									</div>
									<div style={{ display: "flex", flexDirection: "row" }}>
										<Card.Title>{FacilityName}</Card.Title>
										<div>Licensed For: </div>
										<div>Diabetes</div>
										<div>Mental Health</div>
									</div>
								</div>
								<div
									style={{
										display: "flex",
										flexDirection: "column",
										backgroundColor: "black",
										borderRadius: "10px",
										padding: "20px",
									}}
								>
									<Button
										className="mb-2"
										onClick={() => {
											window.location.href = `/msg-outbox?ref=${provider.userId}`;
										}}
									>
										Message
									</Button>
									{/* <Link to={`/msg-outbox?ref=${provider.userId}`}>
										Forgot Password?
									</Link> */}
									<Button
										className="mb-2"
										onClick={() => {
											window.location.href = `/msg-outbox?ref=${provider.userId}&type=quote`;
										}}
									>
										Request Quote
									</Button>
									<Button className="mb-2">Google Meets</Button>
									<Button>Tour Home</Button>
								</div>
							</div>
							<div>Whats special</div>
							<div>At our blah blah blah... {/*description */}</div>
							<div
								style={{
									display: "flex",
									flexDirection: "column",
									alignItems: "flex-start",
									maxWidth: "60%",
									backgroundImage: 'url("bookCare.png")',
									borderRadius: "8px",
									padding: "20px",
								}}
							>
								<div style={{ color: "#ffffff", fontSize: "50px" }}>
									Book Care.
								</div>
								<div>
									Review disclosures, contract, make a deposit of first months
									rent outlined in quote, select a move in date and you're ready
									to move.
								</div>
								<div
									style={{
										display: "flex",
										flexDirection: "row",
										justifyContent: "space-between",
										width: "100%",
									}}
								>
									<div></div>
									{/* Use marginTop: auto to push the button to the bottom */}
									<Button>Reserve Room</Button>
								</div>
							</div>
						</div>
					</div>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleClose}>
						Close
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
};

export default ProviderProfileCard;
