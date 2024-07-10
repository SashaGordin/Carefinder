import React, { useRef, useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore';
import { firestore } from '../firebase'; // Import your Firestore instance
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import eye and eye-slash icons


import TopNav from "../components/TopNav";
import Footer from "../components/Footer";

export default function Login() {
	const emailRef = useRef();
	const passwordRef = useRef();
	const { login } = useAuth();
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  async function handleSubmit(e) {
    e.preventDefault()


		try {
			setError("");
			setLoading(true);
			await login(emailRef.current.value, passwordRef.current.value)
				.then(async (userCredential) => {
					const user = userCredential.user;
					const userDocRef = doc(firestore, "users", user.uid);
					const userDocSnapshot = await getDoc(userDocRef);
					if (userDocSnapshot.exists()) {
						const userData = userDocSnapshot.data();
						const userRole = userData.role;
						userRole === "client"
							? navigate("/client-dashboard")
							: navigate("/care-provider-dashboard");
					} else {
						setError("User document not found");
					}
				})
				.catch((error) => {
					setError("Failed to log in");
					console.log(error);
				});
		} catch (error) {
			setError("Failed to log in");
			console.log(error);
		}

		setLoading(false);
	}

	return (
		<>
			<TopNav />
			<div className="contentContainer utilityPage loginPage">
				<Card>
					<Card.Body>
						<h2 className="text-center mb-4">Log In</h2>
						{error && <Alert variant="danger">{error}</Alert>}
						<Form onSubmit={handleSubmit} autoComplete="on">
							<Form.Group id="email">
								<Form.Label>Email:</Form.Label>
                <Form.Control type="email" id="email" name="email" ref={emailRef} required />
              </Form.Group>
              <Form.Group id="password">
                <Form.Label>Password:</Form.Label>
                <Form.Control type={showPassword ? "text" : "password"} ref={passwordRef} required />
                <div className="loginPasswordControl" onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>{showPassword ? <><FaEyeSlash /> Hide Password</> : <><FaEye /> Show Password</>}</div>
              </Form.Group>
              <hr></hr>
              <Button disabled={loading} className="w-100" type="submit">Log In</Button>
            </Form>
            <div className="w-100 text-center mt-3">
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>
          </Card.Body>
        </Card>
        <div className="w-100 text-center mt-2">
          Need an account for a senior? <Link to="/signup">Sign up here</Link>.
        </div>
        <div className="w-100 text-center mt-2">
          Are you with an AFH?  <Link to="/claim-profile">Sign up as licensed AFH care provider</Link>.
        </div>
			</div>
			<Footer />
		</>
	);
}
