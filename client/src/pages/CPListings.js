import React, { useState, useEffect } from 'react';
import { Card, Alert } from 'react-bootstrap';
import { firestore } from '../firebase'; // Assuming you have firebase.js setup
import { useAuth } from '../contexts/AuthContext';
import {
  getDoc,
  getDocs,
  doc,
  updateDoc,
  collection,
} from 'firebase/firestore';
import TopNav from '../components/TopNav';
import Footer from '../components/Footer';
import PersonalInfo from '../components/CPListings/PersonalInfo';
import ListingCard from '../components/CPListings/ListingCard';
import AddAFH from '../components/AddAFH';

export default function CPListings() {
  const [userData, setUserData] = useState({});
  const { currentUser } = useAuth();
  const [error, setError] = useState('');
  const [listingsData, setListingsData] = useState([]);

  const removeAnimation = () => {
    const alert = document.getElementById('savedMsg');
    alert.classList.remove('fade-out');
  };
  useEffect(() => {
    const fetchData = async () => {
      const userDocRef = doc(firestore, 'users', currentUser.uid);
      const userDocSnapshot = await getDoc(userDocRef);
      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();

        const listings = [];
        const listingsPath = userDocSnapshot.ref.path + '/listings';
        console.log('getting docs from: ' + listingsPath);
        const listingsSnapshot = await getDocs(
          collection(firestore, listingsPath)
        );
        //get data for all listings for user

        listingsSnapshot.forEach((listing) => {
          const data = listing.data();
          console.log(data);
          listings.push(data);
        });
        if (listings.length === 0) {
          listings.push({
            facilityName: userData.FacilityName,
            licenseNumber: userData.LicenseNumber,
            listingAddress: `${userData.LocationAddress}, ${userData.LocationCity}, ${userData.LocationState} ${userData.LocationZipCode} `,
          });
        }
        console.log('listingsLength=' + listings.length);
        setListingsData([...listings]);
        console.log(userData);
        setUserData(userData);
      } else {
        setError('User document not found');
      }
    };
    fetchData();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div className="CPlistings">
        <TopNav userRole="provider" />
        <p>&nbsp;</p>
        {error && <div>{error}</div>}
        <Alert
          id="savedMsg"
          className={'floatingAlert'}
          onAnimationEnd={removeAnimation}
          variant={'success'}
        >
          Saved
        </Alert>
        {listingsData.map((data, i) => (
          <ListingCard userData={userData} initialListingData={data} key={i} />
        ))}
      </div>
      <p>&nbsp;</p>

      <Footer />
    </>
  );
}
