import React, { useState, useEffect } from 'react';
import { Card, Button, Alert, Navbar, Image } from 'react-bootstrap'
import { firestore } from '../firebase'; // Assuming you have firebase.js setup
import { useAuth } from "../contexts/AuthContext"
import { getDoc, getDocs, doc, updateDoc, collection } from 'firebase/firestore';
import TopNav from "./TopNav";
import Footer from "./Footer";
import Listings from './CPListings/Listings';
import PersonalInfo from './menu/PersonalInfo';
import Profile from './CPListings/Profile';
import ListingCard from './CPListings/ListingCard';
import axios from 'axios';

export default function CPListings() {
  const [userData, setUserData] = useState({});
  const { currentUser } = useAuth()
  const [error, setError] = useState('');
  const [listingsData, setListingsData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const userDocRef = doc(firestore, 'users', currentUser.uid);
      const userDocSnapshot = await getDoc(userDocRef);
      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();

        const listings = [];
        const listingsPath = userDocSnapshot.ref.path + "/listings";
        console.log("getting docs from: " + listingsPath);
        const listingsSnapshot = await getDocs(collection(firestore, listingsPath));
        //get data for all listings for user

        listingsSnapshot.forEach((listing) => {
          const data = listing.data();
          console.log(data);
          listings.push(data);
        });
        if (listings.length == 0) {
          listings.push({
            facilityName: userData.FacilityName,
            licenseNumber: userData.LicenseNumber,
            listingAddress: `${userData.LocationAddress}, ${userData.LocationCity}, ${userData.LocationState} ${userData.LocationZipCode} `
          });
        }
        console.log("listingsLength=" + listings.length);
        setListingsData([...listings]);
        console.log(userData);
        setUserData(userData);
      } else {
        setError('User document not found');
      }
    };
    fetchData();
  }, []);

  const handleUpdate = async (updatedUserData) => {
    try {
      const newUserData = await axios.post(`${process.env.REACT_APP_ENDPOINT}/updateUserData`, { updatedUserData, currentUser });
      // Re-fetch user data after update

      setUserData(newUserData);

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
        {listingsData.map((data, i) => (<ListingCard userData={userData} initialListingData={data} key={i} />))}
        <p>&nbsp;</p>

      </div>

      <Footer />
    </>
  )
};