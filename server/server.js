const admin = require("./config/firebase-config");
require('dotenv').config({ path: '.env.local' });
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios'); // Import axios
const cors = require('cors'); // Import the cors package
const path = require('path');
const db = admin.firestore();
const geohash = require('geohash');
const geofire = require('geofire-common');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const client = require('twilio')(accountSid, authToken);

const app = express();
const port = 3001; // Choose a port for your server

app.use(bodyParser.json());
app.use(cors());

async function updateAPIDATA() {
  const snapshot = await admin.firestore().collection('API_AFH_DATA').get();

  const updates = [];

  snapshot.forEach(doc => {
      const { lat, lng } = doc.data().position; // Assuming your existing documents have a 'position' field with lat and lng
      const geoHash = geofire.geohashForLocation([lat, lng])

      updates.push(admin.firestore().collection('API_AFH_DATA').doc(doc.id).update({
          geoHash: geoHash
      }));
  });

  await Promise.all(updates);

  console.log('All documents updated successfully.');
}

// updateAPIDATA();

async function getServiceSid() {
  try {
    const docRef = admin.firestore().collection('twilio').doc('serviceSid');
    const doc = await docRef.get();
    if (doc.exists) {
      const serviceSid = doc.data().sid;
      // Check if the service SID is still valid by attempting to use it
      try {
        await client.verify.v2.services(serviceSid).fetch();
        return serviceSid; // Service SID is still valid
      } catch (error) {
        console.error('Error using stored service SID:', error);
        // If service SID is expired or invalid, create a new one
        const newService = await client.verify.v2.services.create({ friendlyName: 'My First Verify Service' });
        const newServiceSid = newService.sid;
        // Store new service SID in Firestore
        await docRef.set({ sid: newServiceSid });
        return newServiceSid;
      }
    } else {
      // If service SID doesn't exist, create a new one
      const service = await client.verify.v2.services.create({ friendlyName: 'My First Verify Service' });
      const serviceSid = service.sid;
      // Store service SID in Firestore
      await docRef.set({ sid: serviceSid });
      return serviceSid;
    }
  } catch (error) {
    console.error('Error getting service SID:', error);
    throw error;
  }
}


app.post('/matchUserWithHouses', async (req, res) => { // Async handler
  try {
    const surveyResponses = req.body;
    console.log(surveyResponses);

    // Fetch data from external API
    const response = await axios.get('https://fortress.wa.gov/dshs/adsaapps/lookup/FacilityLookupJSON.aspx?factype=AF');
    const data = response.data;

    // Filter the data by LocationCity === "Shoreline"
    const shorelineHomes = data.filter(home => home.LocationCity === "Shoreline");

    console.log(shorelineHomes);
    // Process filtered data here

    // Implement your matching logic here
    // ...

    // Return matched houses to the client
    res.json({ matchedHouses: shorelineHomes });
  } catch (error) {
    console.error('Error matching houses:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/getProviders' , async (req, res) => {

  const bounds = req.body.bounds;
  const center = req.body.center;
  const radius = req.body.radius;
  console.log(radius);
  const centerArray = Array.isArray(center) ? center : [center.lat, center.lng];



  //const radiusInM = 10000;
  try {
    console.log(typeof bounds.north);

    const snapshot = await admin.firestore().collection('API_AFH_DATA')
    .where('geolocation', '>=', new admin.firestore.GeoPoint(bounds.south, bounds.west))
    .where('geolocation', '<=', new admin.firestore.GeoPoint(bounds.north, bounds.east))
    .get();
    const providersInBounds = snapshot.docs.map(doc => doc.data());
    console.log("provider Count:", providersInBounds.length);
    const filteredProviders = providersInBounds.filter(provider => {
      const distanceInKm = geofire.distanceBetween([provider.geolocation.latitude, provider.geolocation.longitude], centerArray);
      const distanceInM = distanceInKm * 1000;

      return distanceInM <= radius;
  });

  console.log("Filtered Provider Count:", filteredProviders.length); // Log filtered provider count

    res.json({ providers: filteredProviders });
  } catch (error) {
    console.error('Error getting providers:', error);
    res.status(500).send('Internal Server Error');
  }
})

app.post('/findProvider', async (req, res) => { // Async handler
  try {
    const providerNumber = req.body.providerNumber;
    console.log(providerNumber);

    // Fetch data from external API
    const response = await axios.get('https://fortress.wa.gov/dshs/adsaapps/lookup/FacilityLookupJSON.aspx?factype=AF');
    const data = response.data;

    // Filter the data by LocationCity === "Shoreline"
    const providerInfo = data.filter(home => home.LicenseNumber === providerNumber);

    console.log(providerInfo);
    // Process filtered data here

    // Implement your matching logic here
    // ...

    // Return matched houses to the client
    res.json({ providerInfo: providerInfo });
  } catch (error) {
    console.error('Error matching houses:', error);
    res.status(500).send('Internal Server Error');
  }
});
//debug
const debugNumber = process.env.DEBUG_PHONE_NUMBER;
const debugMode = process.env.DEBUG_MODE;

app.post('/sendConfirmationText', async (req, res) => {
  const { phone } = req.body;
  console.log(phone);
  const numericPhoneNumber = phone.replace(/\D/g, '');

// Prepend +1 to the numeric phone number
    const formattedPhoneNumber = '+1' + numericPhoneNumber;
    let phoneNumber = debugMode ? debugNumber : formattedPhoneNumber;
    
    const serviceSid = await getServiceSid();

  // Create a verification request
  client.verify.v2.services(serviceSid)
  .verifications
  .create({ to: phoneNumber, channel: 'sms' })
  .then(verification => {
    console.log('Verification status:', verification.status);
    res.status(200).send('Confirmation text sent successfully');
  })
  .catch(error => {
    console.error('Error sending confirmation text:', error);
    res.status(500).send('Error sending confirmation text');
  });
});

  app.post('/verifyConfirmationCode', async(req, res) => {
    const { phoneNumber, code } = req.body;
    const numericPhoneNumber = phoneNumber.replace(/\D/g, '');

    // Prepend +1 to the numeric phone number
    const formattedPhoneNumber = '+1' + numericPhoneNumber;
    let phone = debugMode ? debugNumber : formattedPhoneNumber;

    const serviceSid = await getServiceSid();

    // Verify the code provided by the user
    client.verify.v2.services(serviceSid)
    .verificationChecks
    .create({ to: phone, code: code })
    .then(verificationCheck => {
      console.log('Verification check status:', verificationCheck.status);
      if (verificationCheck.status === 'approved') {
        res.status(200).send('Confirmation code is valid');
      } else {
        res.status(400).send('Invalid confirmation code');
      }
    })
    .catch(error => {
      console.error('Error verifying code:', error);
      res.status(500).send('Error verifying confirmation code');
    });
  });

  async function geocodeAddress(address) {
    try {
      const apiKey = API_KEY; // Replace with your Google Maps API key
      const encodedAddress = encodeURIComponent(address);
      console.log("address in geofunc", address);
      const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`);
      const data = response.data;
      console.log("this the data", data);
      //console.log(data.results);

      if (data.results && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        return { lat: location.lat, lng: location.lng };
      } else {
        console.log("address in geo func error ", address);
        throw new Error('No results found');
      }
    } catch (error) {
      console.error('Error geocoding address:', error);
      return null;
    }
  }

  app.post('/getAddress', async(req, res) => {
    const { address } = req.body;
    try {
      const geocoded = await geocodeAddress(address);
      console.log(geocoded);
      res.json({ address: geocoded });
    } catch (error) {
      console.error('Error geocoding address:', error);
    }
  })

  const fetchDataAndStoreInFirestore = async () => {
    try {
      const response = await axios.get('https://fortress.wa.gov/dshs/adsaapps/lookup/FacilityLookupJSON.aspx?factype=AF');
      const data = response.data;

      // Iterate over each item in the data array
      for (let i =0; i< data.length; i++) {
        const item=data[i];
        // Extract required fields from the item
        const {
          LicenseNumber,
          FacilityName,
          FacilityStatus,
          LocationAddress,
          LocationCity,
          LocationState,
          LocationZipCode,
          LocationCounty,
          MailAddress,
          MailCity,
          MailState,
          MailZipCode,
          TelephoneNmbr,
          Speciality,
          SpecialityCode,
          Contract,
          FacilityPOC,
          LicensedBedCount,
        } = item;

        const existingDoc = await admin.firestore().collection('API_AFH_DATA').doc(LicenseNumber).get();
        if (existingDoc.exists && existingDoc.LocationAddress === LocationAddress) {
          console.log('document exists');
          continue;
        }


          const address = `${LocationAddress}, ${LocationCity}, ${LocationState}`;

          // Geocode the address to get the position
          let position;
          try {
            position = await geocodeAddress(address);
          } catch {
            console.log("this is the address", address);
            return;
          }

          // Return the provider object with the position field added


        // Extract lat and lng from the LocationAddress or any other source
        const {lat, lng } = position;
        // Create an object with the extracted data
        const afhData = {
          LicenseNumber,
          FacilityName,
          FacilityStatus,
          LocationAddress,
          LocationCity,
          LocationState,
          LocationZipCode,
          LocationCounty,
          MailAddress,
          MailCity,
          MailState,
          MailZipCode,
          TelephoneNmbr,
          Speciality,
          SpecialityCode,
          Contract,
          FacilityPOC,
          LicensedBedCount,
          position: {
            lat,
            lng,
          },
          geolocation: new admin.firestore.GeoPoint(lat, lng),
        };

        // Store the data in Firestore
        await admin.firestore().collection('API_AFH_DATA').doc(LicenseNumber).set(afhData);

        // Optionally, link the data to the user account based on the license number
        // Here, you would need to implement a way to associate the user with the data
        // For example, if the user document contains a field called 'providers', you can add the LicenseNumber to it
        // await db.collection('users').doc(userId).collection('providers').doc(LicenseNumber).set(afhData);
      };

      console.log('Data stored successfully');
    } catch (error) {
      console.error('Error fetching or storing data:', error);
    }
  };




  async function findSpokaneHouse() {
    const address = "8211 N Standard St"; // Specify the address you want to search for
    console.log('hi');

    // Query the collection for the document with the specified address
    const snapshot = await admin.firestore().collection('API_AFH_DATA')
        .where('LocationAddress', '==', address)
        .get();

    // Check if any documents were found
    if (snapshot.empty) {
      console.log('No house found with the specified address.');
      return;
    }

    // Log the data of the found house
    snapshot.forEach(doc => {
        console.log('House data:', doc.data());
    });
  }


 



  // Call the function to fetch data and store it in Firestore
  // fetchDataAndStoreInFirestore();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});