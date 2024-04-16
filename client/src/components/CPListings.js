import React, { useState, useEffect } from 'react';
import { Card, Button, Alert, Navbar, Image } from 'react-bootstrap'
import { firestore } from '../firebase'; // Assuming you have firebase.js setup
import { useAuth } from "../contexts/AuthContext"
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import TopNav from "./TopNav";
import Footer from "./Footer";
import Listings from './CPListings/Listings';
import PersonalInfo from './menu/PersonalInfo';
import Profile from './CPListings/Profile';
import ListingCard from './CPListings/ListingCard';

export default function CPListings() {
  const [userData, setUserData] = useState({});
  const { currentUser } = useAuth()
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const userDocRef = doc(firestore, 'users', currentUser.uid);
      const userDocSnapshot = await getDoc(userDocRef);
      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        console.log(userData);
        setUserData(userData);
      } else {
        setError('User document not found');
      }
    };
    fetchData();
  }, []);
  //need to add for loop to iterate through all listings for a provider

  const handleUpdate = async (updatedUserData) => {
    try {
      const userDocRef = doc(firestore, 'users', currentUser.uid);
      await updateDoc(userDocRef, updatedUserData);
      console.log('User data updated successfully');

      // Re-fetch user data after update
      const updatedUserDocSnapshot = await getDoc(userDocRef);
      if (updatedUserDocSnapshot.exists()) {
        const updatedUserData = updatedUserDocSnapshot.data();
        setUserData(updatedUserData);
      } else {
        setError('User document not found after update');
      }
    } catch (error) {
      setError('Error updating user data: ' + error.message);
    }
  };

  return (
    <>

      <div className="CPlistings">

        <TopNav userRole="provider" />
        <p>&nbsp;</p>

        <Card><PersonalInfo /></Card>
        <p>&nbsp;</p>

        <Profile userData={userData} handleUpdate={handleUpdate} />
        <p>&nbsp;</p>
        
        <ListingCard userData={userData} handleUpdate={handleUpdate} />
        <p>&nbsp;</p>

      </div>
      
      <Footer />
    </>
  )
};