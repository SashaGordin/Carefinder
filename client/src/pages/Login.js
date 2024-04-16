import React, { useRef, useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { useAuth } from "../contexts/AuthContext"
import { Link, useNavigate } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore';
import { firestore } from '../firebase'; // Import your Firestore instance

import TopNav from "../components/TopNav";
import Footer from "../components/Footer";


export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login, currentUser } = useAuth()
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      setError('');
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      const userDocRef = doc(firestore, 'users', currentUser.uid);
      const userDocSnapshot = await getDoc(userDocRef);
      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        const userRole = userData.role;
        userRole === 'client' ? navigate('/client-dashboard') : navigate('/care-provider-dashboard');
      } else {
        setError('User document not found');
      }
    } catch {
      setError('Failed to log in');
    }
    setLoading(false);
  }

  return (
    <>
    <TopNav />
    <div className="contentContainer utilityPage">

        <Card>
          <Card.Body>
            <h2 className ="text-center mb-4">Log In</h2>
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
              <hr></hr>
              <Button disabled={loading} className="w-100" type="submit">Log In</Button>
            </Form>
            <div className="w-100 text-center mt-3">
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>
          </Card.Body>
        </Card>
        <div className="w-100 text-center mt-2">
          Need an account? <Link to="/signup">Sign Up</Link>
        </div>
        <div className="w-100 text-center mt-2">
          Join as licensed AFH care provider
          <div>
            <Link to="/claim-profile">Join</Link>
          </div>
        </div>

      </div>
      <Footer />
    </>
  )
}