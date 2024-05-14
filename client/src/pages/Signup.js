import React, { useRef, useState, useEffect } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { firestore } from "../firebase"; // Import your Firestore instance
import { serverTimestamp, collection, setDoc, doc } from "firebase/firestore";
import { FaCheck, FaTimes, FaEyeSlash, FaEye } from 'react-icons/fa'; // Import eye and eye-slash icons
import { query, where, getDocs } from "firebase/firestore";

import TopNav from "../components/TopNav";
import Footer from "../components/Footer";

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

	const [passwordsMatch, setPasswordsMatch] = useState(true);
	const [isTouched, setIsTouched] = useState(false);

	const handleInputChange = () => {
		if (!isTouched) {
			setIsTouched(true);
		}
	};

	const [showPassword, setShowPassword] = useState(false);
	const togglePasswordVisibility = () => {
	  setShowPassword(!showPassword);
	};
  

	const checkPasswordsMatch = () => {
		if (passwordRef.current && passwordConfirmRef.current) {
			const password = passwordRef.current.value;
			const confirmPassword = passwordConfirmRef.current.value;
			setPasswordsMatch(password === confirmPassword);
			console.log('set pwdMatch: ', password === confirmPassword )
		}
	};
		
	useEffect(() => {
		const passwordField = passwordRef.current;
		const confirmPasswordField = passwordConfirmRef.current;
	
		const handleChange = () => {
			checkPasswordsMatch();
		};
	
		if (passwordField && confirmPasswordField) {
			passwordField.addEventListener('input', handleChange);
			confirmPasswordField.addEventListener('input', handleChange);
		}
	
		return () => {
			if (passwordField && confirmPasswordField) {
				passwordField.removeEventListener('input', handleChange);
				confirmPasswordField.removeEventListener('input', handleChange);
			}
		};
	}, []);
	
	
	async function handleSubmit(e) {
		e.preventDefault();

		if (!passwordsMatch) {
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
				userData = {
					...providerInfo,
					displayName: displayName || "",
					createdAt: serverTimestamp(),
					email: email,
					role: "provider",
					privacy: {
						allowAnyoneToMessage: true, // Default value, you can adjust as needed
						recieveEmailNotifications: true,
						recieveTextNotifications: false,
					}
				};
			} else {
				if (localStorage.getItem('surveyData') !== null) {
					const data = JSON.parse(localStorage.getItem('surveyData'));
					console.log(data);
					userData = {
						...data,
						displayName: displayName || "",
						email: email,
						createdAt: serverTimestamp(),
						role: "client",
					}
				} else {
					userData = {
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

			console.log(error);

			if (error.code === "auth/weak-password") {

				setError("Password should be at least 6 characters");

			} else if (error.code === "auth/email-already-in-use") {

				setError("Email address is already in use.");

				// Find the user ID associated with the provided email...
				// I put this here because, although the above error fires sometimes,
				// that does not apparently mean that the email is actually being used.
				// So, we need to figure out why and address that.
				const email = emailRef.current.value;
				const usersCollection = collection(firestore, "users");
				const q = query(usersCollection, where("email", "==", email));
				const querySnapshot = await getDocs(q);
				
				if (!querySnapshot.empty) {

					const userID = querySnapshot.docs[0].id;
					console.log('Email address is already in use by user with ID: ' +userID);

				} else {

					console.log(`Email address is already in use, but it's not in Firebase`);

				}

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
			<div className="contentContainer utilityPage loginPage">
				<Card>
					<Card.Body>
						<h2 className="text-center mb-4">Sign Up</h2>
						{error && <Alert variant="danger">{error}</Alert>}
						<Form onSubmit={handleSubmit}>
							<Form.Group id="email">
								<Form.Label>Email:</Form.Label>
								<Form.Control type="email" ref={emailRef} onChange={handleInputChange} required />
							</Form.Group>
							<Form.Group id="password">
								<Form.Label>Password:</Form.Label>
								<Form.Control type={showPassword ? "text" : "password"} ref={passwordRef} onChange={handleInputChange} required />
							</Form.Group>
							<Form.Group id="password-confirm">
								<Form.Label>Confirm Password:</Form.Label>
								<Form.Control
									type={showPassword ? "text" : "password"}
									ref={passwordConfirmRef}
									required
								/>
							</Form.Group>

							{isTouched && 
								<>
								<div className="loginPasswordControl" onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>{showPassword ? <><FaEyeSlash /> Hide Passwords</> : <><FaEye /> Show Passwords</>}</div>

								<div className="loginPasswordControl">{!passwordsMatch ? <><span className="CFred"><FaTimes /> Passwords do not match</span></> : <><span className="CFgreen"><FaCheck /> Passwords match</span></>}</div>
								</>
							}

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
