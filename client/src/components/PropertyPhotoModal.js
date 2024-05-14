import React from "react";
import { Modal, Button } from "react-bootstrap";

export default function PropertyPhotoModal({
	showModal,
	setShowModal,
	FacilityName,
	homePhotos,
	roomPhotos,
}) {
	console.log(homePhotos, roomPhotos);
	return (
		<Modal
			className="text-black"
			show={showModal}
			onHide={() => setShowModal(false)}
		>
			<Modal.Header closeButton>
				<Modal.Title>{FacilityName}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div>
					<h5>Home Photos</h5>
					{homePhotos.map((photo, index) => (
						<img
							key={index}
							src={photo}
							alt={`Home ${index + 1}`}
							className="w-100 mb-3"
						/>
					))}
				</div>
				<div className="mt-3">
					{roomPhotos.map((photosArray, roomIndex) => (
						<div key={roomIndex}>
							<h5>Room {roomIndex + 1} Photos</h5>
							{photosArray.map((photo, index) => (
								<img
									key={index}
									src={photo}
									alt={`Room ${roomIndex + 1}`}
									className="w-100 mb-3"
								/>
							))}
						</div>
					))}
				</div>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={() => setShowModal(false)}>
					Close
				</Button>
			</Modal.Footer>
		</Modal>
	);
}
