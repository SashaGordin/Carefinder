import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { firestore } from "../firebase"; // Import your Firestore instance
import { serverTimestamp, collection, setDoc, doc } from "firebase/firestore";
import firebase from 'firebase/compat/app';


import TopNav from "../components/TopNav";
import Footer from "../components/Footer";
import axios from "axios";

export default function Signup() {
	const emailRef = useRef();
	const passwordRef = useRef();
	const passwordConfirmRef = useRef();
	const { signup } = useAuth();
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const location = useLocation();
	const { state } = location;
	const { providerInfo, fromClaimProfile } = state || {};


	async function handleSubmit(e) {
		e.preventDefault();

		if (passwordRef.current.value !== passwordConfirmRef.current.value) {
			return setError("Passwords do not match");
		}
		try {
			setError("");
			setLoading(true);
			const { user } = await signup(
				emailRef.current.value,
				passwordRef.current.value
			);
			const { displayName, email, uid } = user;

			const usersCollection = collection(firestore, "users");

			const userDocRef = doc(usersCollection, uid);
			let userData;

			if (fromClaimProfile) {
				let providerAddress = `${providerInfo.LocationAddress}, ${providerInfo.LocationCity}, ${providerInfo.LocationState}`;
				const response = await axios
					.post(`http://localhost:3001/getCoordinates`, {
						address: providerAddress,
					}).then((response) => {return response.data;})
					.catch((error) => {
						console.error("Error occurred during the request:", error);
					});
				const { position, geolocation } = response.locationData;

				const newGeoPoint = new firebase.firestore.GeoPoint(
					geolocation.latitude,
					geolocation.longitude
				);

				userData = {
					...providerInfo,
					userId: uid,
					displayName: displayName || "",
					createdAt: serverTimestamp(),
					email: email,
					role: "provider",
					privacy: {
						allowAnyoneToMessage: true, // Default value, you can adjust as needed
						recieveEmailNotifications: true,
						recieveTextNotifications: false,
					},
					position,
					geolocation: newGeoPoint,
				};
			} else {
				if (localStorage.getItem("surveyData") !== null) {
					const data = JSON.parse(localStorage.getItem("surveyData"));
					console.log(data);
					userData = {
						...data,
						userId: uid,
						displayName: displayName || "",
						email: email,
						createdAt: serverTimestamp(),
						role: "client",
					};
				} else {
					userData = {
						userId: uid,
						displayName: displayName || "",
						email: email,
						createdAt: serverTimestamp(),
						role: "client",
					};
				}
			}

			await setDoc(userDocRef, userData);
			navigate("/login");
		} catch (error) {
			if (error.code === "auth/weak-password") {
				setError("Password should be at least 6 characters");
			} else if (error.code === "auth/email-already-in-use") {
				setError("Email address is already in use");
			} else {
				setError("Failed to create an account");
			}
		} finally {
			setLoading(false);
		}
	}

	return (
		<>
			<TopNav />
			<div className="contentContainer utilityPage">
				<Card>
					<Card.Body>
						<h2 className="text-center mb-4">Sign Up</h2>
						{error && <Alert variant="danger">{error}</Alert>}
						<Form onSubmit={handleSubmit}>
							<Form.Group id="email">
								<Form.Label>Email</Form.Label>
								<Form.Control type="email" ref={emailRef} required />
							</Form.Group>
							<Form.Group id="password">
								<Form.Label>Password</Form.Label>
								<Form.Control type="password" ref={passwordRef} required />
							</Form.Group>
							<Form.Group id="password-confirm">
								<Form.Label>Password Confirmation</Form.Label>
								<Form.Control
									type="password"
									ref={passwordConfirmRef}
									required
								/>
							</Form.Group>
							<hr />
							<Button disabled={loading} className="w-100" type="submit">
								Sign Up
							</Button>
						</Form>
					</Card.Body>
				</Card>
				{fromClaimProfile ? null : (
					<div className="w-100 text-center mt-2">
						Already have an account? <Link to="/login">Log In</Link>
					</div>
				)}
			</div>
			<Footer />
		</>
	);
}
