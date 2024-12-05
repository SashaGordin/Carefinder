import React, { useState } from "react";
import { Card, Button, Modal } from "react-bootstrap";
import PropertyPhotoModal from "./PropertyPhotoModal";
import { useNavigate } from "react-router-dom";
import VisitingMap from "./VisitingMap";
import ProviderViewProfileCard from "./ProviderViewProfileCard";
import { formatPrice } from "../utils";
import { careDescriptions } from "../constants";
const ViewProfile = ({ provider, showModal, setShowModal }) => {
	const {
		profilePicPath,
		FacilityPOC,
		FacilityName,
		listingsData, // Add more fields as needed
		roomsData,
		Speciality,
		LicenseNumber,
	} = provider;

	const { costOfCare, highlightedFeatures } = listingsData;
	const homePhotos = listingsData.homePhotos;
	// console.log("costOfCare", costOfCare);
	const { fullServiceList } = costOfCare;

	const roomPhotos = roomsData.map((room) => room.roomPhotos);
	const availableRooms = roomsData.filter((room) => room.isAvailable);
	const [showImageModal, setShowImageModal] = useState(false);
	const [selectedCareLevel, setSelectedCareLevel] = useState("L");
	const navigate = useNavigate();

	const handleImageClick = () => {
		setShowImageModal(true);
	};

	// console.log("room photos", roomPhotos);
	// console.log("home photos", homePhotos);
	const careLevelMap = {
		L: "Low",
		M: "Medium",
		H: "High",
		T: "Total",
	};
	console.log("roomsData", roomsData);
	console.log("availableRooms", availableRooms);

	const handleClose = () => setShowModal(false);

	return (
		<>
			<Modal show={showModal} onHide={handleClose} size="xl" centered>
				{/* <Modal.Header>
      <Button variant="link" onClick={() => setShowModal(false)} className="providerModalBackButton">
        <span aria-hidden="true">Back</span>
      </Button>
    </Modal.Header> */}

				<Modal.Body>
					<div
						className="flex flex-row flex-1 gap-2 mx-20 my-10"
						data-license-number={provider.LicenseNumber}
					>
						{/** LEFT SIDE: */}
						<div className="flex flex-col flex-1 gap-2">
							{/** MAP: */}
							<div className="bg-[#1e1f26] p-3">
								<h4>Where will you be visiting from?</h4>

								<VisitingMap provider={provider} />
							</div>
							{/** FACILITY NAME AND SPECIALTY AND ROOM INFO: */}
							<div className="bg-[#1e1f26] p-3 flex flex-col gap-2">
								<div className="rubik500 font-bold text-2xl">
									{FacilityName}
								</div>
								<div className="text-xs">
									<span>Licensed For</span>
									<div className="flex flex-wrap gap-2">
										{Speciality.split(",").map((specialty) => (
											<span
												className="bg-black rounded-md p-2.5"
												key={specialty}
											>
												{specialty.trim()}
											</span>
										))}
									</div>
								</div>
								<div className="flex flex-col gap-2">
									<div className="font-bold">Available Rooms:</div>
									{availableRooms.map((room) => (
										<>
											<img
												src={room.roomPhotos[0]}
												className="h-48 object-cover"
												alt="room 1"
												key={room.roomName}
											/>
											{room.roomDetails && (
												<div className="flex flex-row gap-2">
													<span className="bg-gray-700 rounded-md p-2">
														{room.roomDetails.map((detail) => (
															<div key={detail}>{detail}</div>
														))}
													</span>
												</div>
											)}
										</>
									))}
								</div>
								<div className="font-bold">Home:</div>
								{homePhotos.map((photo) => (
									<img
										src={photo}
										className="h-48 object-cover"
										alt="room 1"
										key={photo}
									/>
								))}
							</div>
							{/** License info: */}
							<div className="bg-[#1e1f26] p-3 flex flex-col justify-between">
								<div className="rubik500 font-bold text-lg">
									License Number: {LicenseNumber}
								</div>
								<div className="rubik500 font-bold text-lg">
									Latest Inspection: {LicenseNumber}
								</div>
								<div className="rubik500 font-bold text-lg">
									Disclosure of services: {LicenseNumber}
								</div>
							</div>
						</div>
						{/** RIGHT SIDE: */}
						<div className="flex flex-1 flex-col gap-2">
							<ProviderViewProfileCard provider={provider} />
							{/** Testimonials: */}
							<div className="bg-[#1e1f26] p-3">
								<h4>Testimonials</h4>
							</div>
							{/** Highlighted Features: */}
							<div className="bg-[#1e1f26] p-3">
								<div className="text-center">
									<h4>Highlighted Features</h4>
									{highlightedFeatures.selectedFeatures.map((feature) => (
										<div key={feature}>{feature}</div>
									))}
								</div>
							</div>
							<div className="bg-[#1e1f26] px-4 py-3">
								<h4>Estimated Cost</h4>
								<p>
									The following care levels provide an overview of the support
									seniors may requuire within an Adult Family Home, ranging from
									low to total care. Please noe that this is a guide. To
									determine an exact daily rate, a comprehensive assessment must
									be reviewed by the provider. Get started by sending this
									provider a message.
								</p>
								<img
									src={homePhotos[0]}
									className="h-48 object-cover"
									alt="room 1"
								/>
								<div className="flex flex-col gap-2">
									<div className="flex flex-row justify-between">
										<div>Rent {availableRooms[0].roomName}: </div>
										<div className="font-bold text-lg">
											{formatPrice(availableRooms[0].rentCost)}/day
										</div>
									</div>
									<div className="flex flex-row justify-between">
										<div>Cost of care:</div>
										<div className="font-bold text-lg">
											{formatPrice(costOfCare[selectedCareLevel].lowPrice * 1)}
											/day
										</div>
									</div>
									<div className="flex flex-row justify-between items-center">
										<div>Care Level:</div>
										<select
											value={selectedCareLevel}
											onChange={(e) => setSelectedCareLevel(e.target.value)} // Update care level state
											className="p-1 bg-gray-700 text-white rounded-md text-lg font-bold"
										>
											<option value="L">Low</option>
											<option value="M">Medium</option>
											<option value="H">High</option>
											<option value="T">Total</option>
										</select>
									</div>
								</div>
								<div className="mt-2">
									<span className="font-bold">{careLevelMap[selectedCareLevel]} Care: </span>
									<span>{careDescriptions[selectedCareLevel]}</span>
								</div>
								<div className="flex flex-col mt-2">
									<div className="font-bold">Base Price: </div>
									<div className="flex flex-col">
										{costOfCare[selectedCareLevel].services.map((service) => (
											<div key={service}>{service}</div>
										))}
									</div>
								</div>
								<div className="flex flex-row justify-between mt-2">
									<div className="font-bold">Total Cost:</div>
									<div className="font-bold text-lg">
										{formatPrice(costOfCare[selectedCareLevel].lowPrice * 30)}
										/month
									</div>
								</div>
							</div>
							<div className="bg-[#1e1f26] px-4 py-3 gap-2 flex flex-col">
								<h4>Reservation</h4>
								<div>
									Resere a room to secure a spot within this AFH. Review
									contract, house rules and then make a non refundable deposit
									to show your commitment for booking care. Booking proccesses
									will be completed on move in day.
								</div>
								<div>
									Please note: If reservation is denied by provider, your card
									will not be charged.
								</div>
								<div className="flex justify-end">
									<Button>Request Reservation</Button>
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

export default ViewProfile;
