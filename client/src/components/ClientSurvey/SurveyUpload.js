import React from "react";
import { Button, Container, Row, Col, Form } from "react-bootstrap";
import { getStorage, ref, uploadBytes, deleteObject } from "firebase/storage";
import { firestore } from "../../firebase";

/**
 * HIPAA COMPLIANCE NOTES: We originally were encrypting when taking in PDF assessments.
 * However, as Firestore is automatically encryting all data uploaded to its server,
 * per their policy here: https://cloud.google.com/firestore/docs/server-side-encryption ,
 * there is no need to redundantly encrypt that data, as our existing auth / access controls
 * provide security around who can access any personal health information -- which in this
 * case would be only the uploader and/or the CareFinder admin who is empowered to do so.
 * Ultimately, HIPAA compliance falls on CareFinder. If we need to expand this policy and/or
 * offer additional levels of encryption, see SurveyUpload-withEncryption.JS, which has
 * a good starting point leveraging node-forge. -JD
 */

const SurveyUpload = ({
	assessment,
	description,
	onNext,
	onBack,
	currentQuestionIndex,
	totalQuestions,
}) => {
	const handleNext = () => {
		onNext();
	};

	const handleBack = () => {
		onBack();
	};

	console.log("RADIO HANDLING!");
	console.log("assessment: " + assessment);
	const progressPercentage =
		((currentQuestionIndex + 1) / totalQuestions) * 100;

	const handlePDFupload = async () => {
		const storage = getStorage();
		const fileList = document.getElementById("formPDFupload").files;
		const acceptableMimeTypes = ["application/pdf"];

		for (const file of fileList) {
			if (acceptableMimeTypes.includes(file.type)) {
				try {
					const fileData = await readFileAsync(file);

					if (fileData) {
						// get userID from localstorage
						const localStorageCurrentUserID = localStorage.getItem(
							"localStorageCurrentUserID"
						);

						// Lookup if this person has an assessment on file already
						const userRef = firestore
							.collection("users")
							.doc(localStorageCurrentUserID);
						const userDoc = await userRef.get();

						if (userDoc.exists) {
							const userData = userDoc.data();
							if (userData.assessmentPDFfileName) {
								console.log(
									"You have an existing assessment. Let me delete that ..."
								);
								const fileNameToDelete = userData.assessmentPDFfileName;
								console.log(
									"Deleting your old assessment: ",
									fileNameToDelete + "..."
								);
								const fileRefToDelete = ref(
									storage,
									`assessments/${fileNameToDelete}`
								);
								await deleteObject(fileRefToDelete);
								console.log("File deleted successfully!");
							}
						}

						// Make new filename including the person's userID.
						// I think, for HIPAA purposes, this could come in handy as a double-check,
						// where, if a user is requesting a PDF that he/she uploaded, we can double check
						// that his/her userID is in the filename as a substring, ensuring that we never
						// accidentally show someone another person's assessment.
						const assessmentNewFileName =
							localStorageCurrentUserID + "-" + Date.now().toString() + ".pdf";
						const storageRef = ref(
							storage,
							`assessments/${assessmentNewFileName}`
						);
						console.log(
							"Gonna upload " +
								file.name +
								" ... as: " +
								assessmentNewFileName +
								"..."
						);

						try {
							await uploadBytes(storageRef, fileData);
							console.log(
								"Okay, uploaded " +
									file.name +
									" ... as: " +
									assessmentNewFileName +
									"!"
							);

							// Update the user document with the new data
							console.log(
								"Update user record: " + localStorageCurrentUserID + "..."
							);
							const userRef = firestore
								.collection("users")
								.doc(localStorageCurrentUserID);

							try {
								await userRef.update({
									assessmentPDFfileName: assessmentNewFileName,
								});
								console.log("User record updated successfully!");

								alert(
									"AWESOME! We received the file and have saved it securely (encrypted on our server) for our review. Please click `Next` and proceed to the next screen. Thanks!"
								);
							} catch (error) {
								console.error("Error updating user record:", error);
							}
						} catch (error) {
							console.error("Error uploading file:", error);
						}
					}
				} catch (error) {
					console.error("Error reading file:", error);
				}
			} else {
				alert(
					"FILE REJECTED: You cannot upload " +
						file.type +
						" files. Must be .PDF files for this. Kthx."
				);
			}
		}
	};

	const readFileAsync = (file) => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsArrayBuffer(file);
			reader.onload = () => {
				const data = new Uint8Array(reader.result);
				resolve(data);
				// console.log('async-check...',data);
			};
			reader.onerror = (error) => {
				reject(error);
			};
		});
	};

	return (
		<>
			{assessment === "Yes" ? (
				// <Container className="p-5" style={{ backgroundColor: "#333", color: "#fff" }} >
				// 	<Row className="justify-content-center text-center">
				// 		<h2 className="mb-4">Great! Upload it now</h2>
				// 		{description && <div className="mb-4">{description}</div>}
				// 		<Col xs={12} md={12} lg={12}>
				// 		<Form.Group controlId="formPDFupload" className="CFgrayBackground">
				// 		<Form.Label>Select images to upload (PDF only)</Form.Label>
				// 		<Form.Control type="file" accept="application/pdf" />
				// 		</Form.Group>
				// 		<Button onClick={handlePDFupload}>Upload File</Button>
				// 			<div className="d-flex justify-content-between mt-4">
				// 				<Button variant="secondary" onClick={handleBack}>Back</Button>
				// 				<Button variant="primary" onClick={handleNext}>
				// 					Next
				// 				</Button>
				// 			</div>
				// 		</Col>
				// 	</Row>
				// </Container>
				<div className="text-center items-center h-[calc(100vh-15rem)] max-w-[50rem] mx-auto flex flex-col justify-center">
					<h2>Upload assessment</h2>
					<p className="max-w-[45rem] mx-auto text-left">
						This will allow you to share you assessment with care providers whom
						you choose to share it with. Care providers must review an
						assessment in order to provide future residents with a proper
						estimate.
					</p>
					<p className="max-w-[45rem] mx-auto text-left mb-10">
						Please note: We use AI to review assessments for particular data
						points which we use to create compatible care matches. No
						information is stored, shared or sold. We are HIPPA compliant.
					</p>
					<Button variant="primary" onClick={handlePDFupload}>
						Upload
					</Button>
				</div>
			) : (
				<div className="text-center items-center h-[calc(100vh-15rem)] max-w-[50rem] mx-auto flex flex-col justify-center">
					<h2 className="mt-4">Schedule virtual assessment</h2>
					<p className="max-w-[45rem] mx-auto text-left mb-10">
						Please select a day and time that you and your senior are able to be
						in the same room and conduct a 45 minute assessment via google
						meets. Assessments are conducted by a washington state registered
						nurse.
					</p>
					<iframe
						title="Calendly Scheduler"
						src="https://calendly.com/carefinderwa/30min"
						style={{ width: "50%", height: "50rem", border: "0" }}
						scrolling="no"
					></iframe>
				</div>
				// <Container
				// 	className="p-5"
				// 	style={{ backgroundColor: "#333", color: "#fff" }}
				// >
				// 	<Row className="justify-content-center">
				// 		<h2 className="mb-4">Schedule virtual assessment</h2>
				// 		<div className="mb-4">
				// 			Please select a day and time that you and your senior are able to
				// 			be in the same room and conduct a 45 minute assessment via google
				// 			meets.
				// 		</div>

				// 		{/* input calendly here */}
				// 		<iframe
				// 			title="Calendly Scheduler"
				// 			src="https://calendly.com/carefinderwa/30min"
				// 			style={{ width: "100%", height: "800px", border: "0" }}
				// 			scrolling="no"
				// 		></iframe>

				// 		<div className="d-flex justify-content-between mt-4">
				// 			<Button variant="secondary" onClick={handleBack}>
				// 				Back
				// 			</Button>
				// 			<Button variant="primary" onClick={handleNext}>
				// 				Next
				// 			</Button>
				// 		</div>
				// 	</Row>
				// </Container>
			)}
			<div className="w-full h-2 bg-gray-200 fixed bottom-0 left-0 rounded mb-20">
				<div
					className="h-full bg-pink-500 transition-all duration-300 rounded"
					style={{ width: `${progressPercentage}%` }}
				></div>
				<div className="d-flex justify-content-between mx-20 my-4">
					<Button variant="secondary" className="px-2" onClick={handleBack}>
						Back
					</Button>
					<Button variant="primary" className="px-2" onClick={handleNext}>
						Next
					</Button>
				</div>
			</div>
		</>
	);
};

export default SurveyUpload;
