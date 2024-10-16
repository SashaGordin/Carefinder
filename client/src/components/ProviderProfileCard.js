import React, { useState } from "react";
import { Card, Button, Modal } from "react-bootstrap";
import PropertyPhotoModal from "./PropertyPhotoModal";
import { useNavigate } from "react-router-dom";
import VisitingMap from "./VisitingMap";

const ProviderProfileCard = ({ provider }) => {
	const {
		profilePicPath,
		FacilityPOC,
		FacilityName,
		homePhotos,
		listingsData, // Add more fields as needed
		Speciality,
	} = provider;
	console.log("adskfjslkdjf", provider);

	const roomPhotos = listingsData[0].roomData.map((room) => room.roomPhotos);

	const [showModal, setShowModal] = useState(false);

	const [showImageModal, setShowImageModal] = useState(false);

	const navigate = useNavigate();

	const handleImageClick = () => {
		setShowImageModal(true);
	};

	const handleClose = () => setShowModal(false);
	const handleShow = () => setShowModal(true);

	console.log("this is the provider", provider);
	return (
		<>
			<div
				className="provider-card"
				data-license-number={provider.LicenseNumber}
				style={{
					display: "flex",
					flexDirection: "row",
					flex: 1,
					margin: "0px",
				}}
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

			<Modal
				style={{ color: "#ffffff" }}
				show={showModal}
				onHide={handleClose}
				size="xl"
				centered
			>

				<Modal.Header>
					<Button variant="link" onClick={() => setShowModal(false)} className="providerModalBackButton">
						<span aria-hidden="true">Back</span>
					</Button>
				</Modal.Header>

				<Modal.Body>
					<div
						className="provider-card"
						data-license-number={provider.LicenseNumber}
						style={{
							display: "flex",
							flexDirection: "column",
							flex: 1,
							margin: "10px",
							marginTop: 0,
							backgroundColor: "#1e1f26",
						}}
					>
						<div style={{ margin: "20px" }}>

							<div style={{ display: "flex", flexDirection: "row", marginBottom: "20px" }} onClick={handleImageClick} >

								{/** MAIN PROVIDER PROFILE PIC: */}
								<img style={{ width: "100%", borderRadius: "20px" }} src={profilePicPath} alt=" provider profile pic" />

								{/** HOME PICS: */}
								<div style={{ display: "flex",flexDirection: "column", marginLeft: "15px" }}>
									<img className="providerModalCardHomePics" src={homePhotos[0]}	alt="provider card home pic 1" />
									<img className="providerModalCardHomePics" src={homePhotos[1]}	alt="provider card home pic 2" />
								</div>

								<div style={{ display: "flex",flexDirection: "column", marginLeft: "15px" }}>
									<img className="providerModalCardHomePics" src={homePhotos[2]}	alt="provider card home pic 3" />
									<img className="providerModalCardHomePics" src={homePhotos[3]}	alt="provider card home pic 4" />
								</div>

							</div>

							{/** PROVIDER INFORMATION: */}
							<div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}	>

								<div style={{ display: "flex", flexDirection: "column" }}>

									<div style={{ display: "flex", flexDirection: "row" }}>
										<div style={{ fontSize:"200%",fontWeight:"bold", marginRight:"20px"}} className="rubik500"> {FacilityPOC} </div>
										<div style={{paddingTop:"15px",marginRight:"15px"}}>&#10004; Verified Provider</div>
										<div style={{paddingTop:"15px",marginRight:"15px"}}>&#10004; Licensed</div>
									</div>

									<div style={{ display: "flex", flexDirection: "row", marginTop:"20px" }}>
										<div style={{ fontSize:"200%",fontWeight:"bold", marginRight:"40px",width:"50%"}} className="rubik500"> {FacilityName} </div>
										<div style={{marginTop:"15px"}}>  
											<span style={{ background:"black",borderRadius:"10px", padding:"5px 10px 5px 10px", marginRight:"10px", display:"table-cell" }}>Licensed For</span>
											{Speciality}
										</div>
									</div>

								</div>

								<div style={{ display: "flex", flexDirection: "column", backgroundColor: "black", borderRadius: "10px", padding: "15px", height:"fit-content" }} >

									<Button className="mb-2" onClick={() => {
											window.location.href = `/msg-outbox?ref=${provider.userId}`;
										}}>
										Message
									</Button>
									
									<Button onClick={() => {
											navigate("/reserve-room", { state: { provider } });
										}}
									>
										Reserve Room
									</Button>

								</div>

							</div>

							<div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", maxWidth: "100%" }}>

								<h4 style={{marginTop:"40px"}}>What's special</h4>

								<div>This would be some description by the PROVIDER, which we will need to provide them with some sort of PROFILE editing field to populate this WHATS-SPECIAL area. They will then type up what is special about their AFH, and the text will go here. So, this is just a sample of what that might look like. We should limit their response to XXX characters to make sure it all fits here and is easily readable. We should probably disallow links and/or HTML in this input as well. Kthx.</div>

								<h4 style={{marginTop:"40px"}}>Features</h4>
								<div>This would be some description by the PROVIDER, which we will need to provide them with some sort of PROFILE editing field to populate this FEATURES area. They will then type up some features about their AFH, and the text will go here. So, this is just a sample of what that might look like. We should limit their response to XXX characters to make sure it all fits here and is easily readable. We should probably disallow links and/or HTML in this input as well. Kthx.</div>

								<h4 style={{marginTop:"40px"}}>Where will you be visiting from?</h4>

								<VisitingMap provider={provider} />
								
								<div style={{ backgroundImage: 'url("bookCare.png")', borderRadius: "10px", padding: "20px" }} >

									<div style={{ color: "#ffffff", fontSize: "50px" }}>Book Care.</div>
									
									<div>Review disclosures, contract, make a deposit of first month's rent outlined in quote, select a move in date and you're ready to move.</div>
									
									<div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between",
											width: "100%",  marginTop:"20px"}} >
										<div></div>
										<Button>Reserve Room</Button>
									</div>

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
			{showImageModal && (
				<PropertyPhotoModal
					showModal={showImageModal}
					setShowModal={setShowImageModal}
					FacilityName={FacilityName}
					homePhotos={homePhotos}
					roomPhotos={roomPhotos}
				/>
			)}
		</>
	);
};

export default ProviderProfileCard;
