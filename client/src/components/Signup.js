import React, { useRef, useState } from 'react';
import { Form, Button, Card, Alert, Navbar, Image } from 'react-bootstrap';
import { useAuth } from "../contexts/AuthContext"
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { firestore } from '../firebase'; // Import your Firestore instance
import { serverTimestamp, collection, setDoc, doc } from 'firebase/firestore';

import TopNav from "./TopNav";
import Footer from "./Footer";


export default function Signup() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { signup } = useAuth()
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const { providerInfo, fromClaimProfile } = state || {}


  async function handleSubmit(e) {
    e.preventDefault()

    if(passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError('Passwords do not match')
    }
    try {
      setError('');
      setLoading(true);
      const { user } = await signup(emailRef.current.value, passwordRef.current.value);
      const { displayName, email, uid } = user;

      const usersCollection = collection(firestore, 'users');

      const userDocRef = doc(usersCollection, uid);
      let userData;

      if (fromClaimProfile) {
        userData = {
          displayName: displayName || '',
          email: email,
          createdAt: serverTimestamp(),
          role: 'provider'
        }
      } else {
        userData = {
          displayName: displayName || '',
          email: email,
          createdAt: serverTimestamp(),
          role: 'client'
        }
      }

      await setDoc(userDocRef, userData);
      navigate('/login');
    } catch (error) {
      if (error.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters');
      } else if (error.code === 'auth/email-already-in-use') {
        setError('Email address is already in use');
      } else {
        setError('Failed to create an account');
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
          <h2 className ="text-center mb-4">Sign Up</h2>
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
              <Form.Control type="password" ref={passwordConfirmRef} required />
            </Form.Group>
            <hr />
            <Button disabled={loading} className="w-100" type="submit">Sign Up</Button>
          </Form>
        </Card.Body>
      </Card>
      {fromClaimProfile ? null :
        <div className="w-100 text-center mt-2">
          Already have an account? <Link to="/login">Log In</Link>
        </div>
      }

    </div>
    <Footer />

    </>
  )
}