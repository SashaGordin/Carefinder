import React, { useState } from "react";
import { Card, Button, Modal } from "react-bootstrap";
import PropertyPhotoModal from "./PropertyPhotoModal";
import { useNavigate } from "react-router-dom";
import VisitingMap from "./VisitingMap";
import ProviderViewProfileCard from "./ProviderViewProfileCard";
const ViewProfile = ({ provider, showModal, setShowModal }) => {
	const {
		profilePicPath,
		FacilityPOC,
		FacilityName,
		listingsData, // Add more fields as needed
		Speciality,
		LicenseNumber,
	} = provider;

	const { costOfCare, highlightedFeatures } = listingsData;
	const homePhotos = listingsData.homePhotos;
	console.log("costOfCare", costOfCare);
	const { fullServiceList } = costOfCare;

	const roomPhotos = listingsData.roomData?.map((room) => room.roomPhotos);

	const [showImageModal, setShowImageModal] = useState(false);

	const navigate = useNavigate();

	const handleImageClick = () => {
		setShowImageModal(true);
	};

	console.log("room photos", roomPhotos);
	console.log("home photos", homePhotos);

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
							<div className="bg-[#1e1f26]">
								<h4>Where will you be visiting from?</h4>

								<VisitingMap provider={provider} />
							</div>
							{/** FACILITY NAME AND SPECIALTY AND ROOM INFO: */}
							<div className="bg-[#1e1f26] p-3">
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
							<div className="bg-[#1e1f26] p-3">
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
										<div>Rent room 1: </div>
										<div>100/day</div>
									</div>
									<div className="flex flex-row justify-between">
										<div>Rent room 2: </div>
										<div>100/day</div>
									</div>
									<div className="flex flex-row justify-between">
										<div>Care Level</div>
										{/* <Dropdown>
											<Dropdown.Toggle variant="success" id="dropdown-basic">
												Dropdown Button
											</Dropdown.Toggle>
										</Dropdown> */}
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

export default ViewProfile;
