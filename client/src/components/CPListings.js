import React, { useState, useEffect } from 'react';
import { Card, Button, Alert, Navbar, Image } from 'react-bootstrap'
import { firestore } from '../firebase'; // Assuming you have firebase.js setup
import { useAuth } from "../contexts/AuthContext"
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import TopNav from "./TopNav";
import Footer from "./Footer";
import Listings from './CPListings/Listings';


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
  
   return (
    <>
      <TopNav userRole="provider" />

      <div className="contentContainer utilityPage">
        <h1>Your listings</h1>
        <Listings licenseNumber={userData.LicenseNumber} listingName={userData.FacilityName} listingStatus={userData.listingStatus} listingImg={userData.listingImg} />
      </div>
      <Footer />
    </>
  )
};