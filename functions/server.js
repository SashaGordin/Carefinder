/* eslint-disable no-unused-vars */
/* eslint-disable no-tabs */
/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
const Stripe = require('stripe');
const admin = require('./config/firebase-config');
require('dotenv').config({ path: '.env.local' });
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios'); // Import axios
const cors = require('cors'); // Import the cors package
const { defineSecret } = require('firebase-functions/params');
const geofire = require('geofire-common');
const { doc, updateDoc, getDoc } = require('firebase/firestore');
const { formatPhoneNumber } = require('./util-functions');
const { formatName } = require('./util-functions');
const configureMiddleware = require('./middleware/middlewareLoader');
const Middleware = require('./middleware/index');
const config = require('./config/config');
const functions = require('firebase-functions');
const db = config.initFirebase();
// const stripe = config.initStripe();
// const twilioClient = config.initTwilio();

const googleMapsApiKey = defineSecret('GOOGLE_MAPS_API_KEY');

// const API_KEY = googleMapsApiKey.value();
// // const API_KEY =
// //   functions.config().GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY;

// console.log('API_KEY', API_KEY);
const app = express();
configureMiddleware(app);
const port = 3001 || 8080; // Choose a port for your server\

// const  = admin.firestore();

// ********************************************************
// BEGIN MONITORING MESSAGES for CHANGES /
// SENDING SMS NOTIFICATIONS to PROVIDERS (or ADMINS)
// .....

// phone # cleanup for Twilio:
// format phone number in E.164 format before sending the SMS
//  -- adds the country code prefix (e.g., +1 for US numbers)
//  -- removes any non-digit characters.

// Function to handle new messages:
const handleNewMessage = async (doc) => {
  const twilioClient = await config.initTwilio();
  try {
    const messageData = doc.data();
    const msgTo = messageData.msgTo;
    const docId = doc.id;

    // ********** BEGIN VALIDATIONS **********

    // Validation:  Check if msgTo is null
    if (!msgTo) {
      console.log(
        'SERVER: `msgTo` is null for msgID ' + docId + '. Skipping message!'
      );
      return;
    }

    // Validation:  Skip any already notified...
    const SMSsent = messageData.msgNotified;
    if (SMSsent === 1) {
      return;
    }

    // Validation:  Message recipient must be a valid user...
    const userSnapshot = await db.collection('users').doc(msgTo).get();
    if (!userSnapshot.exists) {
      console.log('SERVER: User not found: ', msgTo);
      return;
    }

    const userData = userSnapshot.data();
    const userRole = userData.role;

    // Validation:  Recipient cannot be a "client" role...
    if (userRole === 'client') {
      return;
    }

    // Validation:  Recipient needs to have phone on file...
    let userPhone = userData.TelephoneNmbr;
    if (!userPhone) {
      console.log('SERVER: User phone number not found.');
      return;
    }
    // Validation:  Format the phone number to E.164
    userPhone = formatPhoneNumber(userPhone);

    // Validation:  Future logic TBD -- e.g., check if user has opted out of messaging

    // ********** END VALIDATIONS **********

    // Set the SMS (s/b short, I guess). Best practice is to include a full URL, like so:
    const smsMessage =
      'You have a new message on CareFinder! Visit https://www.carefinder.com to read/respond.';

    // Fetch or create the Messaging Service SID
    console.log('SERVER: FETCH TRILIO SERVICE ID...');
    const msgSvcSID = await getMessagingServiceSid();
    console.log(`SERVER: Using Twilio Service SID: ${msgSvcSID}`);

    twilioClient.messages
      .create({
        body: smsMessage,
        to: userPhone,
        messagingServiceSid: msgSvcSID,
      })
      .then(async (message) => {
        console.log(
          'SERVER: SMS sent to phone# ' + userPhone + ', ID: ',
          message.sid
        );

        // Update the msgNotified field to 1...
        // I think we definitely need to do this, as sometimes Firestore initially sends ALL
        // messages here. So, we want to skip any already-notified ones.
        console.log(`SERVER: Updating msgNotified for document ID: ${docId}`);
        await db.collection('messages').doc(docId).update({ msgNotified: 1 });
        console.log('SERVER: msgNotified field updated to 1');
      })
      .catch((error) =>
        console.error(
          'SERVER: Error sending SMS of messageID ' + docId + ' ... ERROR: ',
          error
        )
      );
  } catch (error) {
    console.error('SERVER: Error handling new message:', error);
  }
};

// Listen for new messages in Firestore
db.collection('messages').onSnapshot((snapshot) => {
  snapshot.docChanges().forEach((change) => {
    if (change.type === 'added') {
      handleNewMessage(change.doc);
    }
  });
});

// END MONITORING MESSAGES for CHANGES
// && SENDING SMS NOTIFICATIONS
// ********************************************************

// eslint-disable-next-line no-unused-vars
async function updateAPIDATA() {
  const snapshot = await db.collection('API_AFH_DATA').get();

  const updates = [];

  snapshot.forEach((doc) => {
    const { lat, lng } = doc.data().position; // Assuming your existing documents have a 'position' field with lat and lng
    const geoHash = geofire.geohashForLocation([lat, lng]);

    updates.push(
      db.collection('API_AFH_DATA').doc(doc.id).update({
        geoHash: geoHash,
      })
    );
  });

  await Promise.all(updates);

  console.log('All documents updated successfully.');
}

// updateAPIDATA();

async function getServiceSid() {
  const twilioClient = await config.initTwilio();
  try {
    const docRef = db.collection('twilio').doc('serviceSid');
    const doc = await docRef.get();
    if (doc.exists) {
      const serviceSid = doc.data().sid;
      // Check if the service SID is still valid by attempting to use it
      try {
        await twilioClient.verify.v2.services(serviceSid).fetch();
        return serviceSid; // Service SID is still valid
      } catch (error) {
        console.error('Error using stored service SID:', error);
        // If service SID is expired or invalid, create a new one
        const newService = await twilioClient.verify.v2.services.create({
          friendlyName: 'My First Verify Service',
        });
        const newServiceSid = newService.sid;
        // Store new service SID in Firestore
        await docRef.set({ sid: newServiceSid });
        return newServiceSid;
      }
    } else {
      // If service SID doesn't exist, create a new one
      const service = await twilioClient.verify.v2.services.create({
        friendlyName: 'My First Verify Service',
      });
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

async function getMessagingServiceSid() {
  const twilioClient = await config.initTwilio();
  try {
    const docRef = db.collection('twilio').doc('messagingServiceSid');
    const doc = await docRef.get();
    if (doc.exists) {
      const serviceSid = doc.data().sid;
      // Check if the service SID is still valid by attempting to use it
      try {
        await twilioClient.messaging.v1.services(serviceSid).fetch();
        return serviceSid; // Service SID is still valid
      } catch (error) {
        console.error('Error using stored Messaging Service SID:', error);
        // If service SID is expired or invalid, create a new one
        const newService = await twilioClient.messaging.v1.services.create({
          friendlyName: 'My Messaging Service',
        });
        const newServiceSid = newService.sid;
        // Store new service SID in Firestore
        await docRef.set({ sid: newServiceSid });
        return newServiceSid;
      }
    } else {
      // If service SID doesn't exist, create a new one
      const service = await twilioClient.messaging.v1.services.create({
        friendlyName: 'My Messaging Service',
      });
      const serviceSid = service.sid;
      // Store service SID in Firestore
      await docRef.set({ sid: serviceSid });
      return serviceSid;
    }
  } catch (error) {
    console.error('Error getting Messaging Service SID:', error);
    throw error;
  }
}

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.post('/updateUserData', async (req, res) => {
  try {
    const updatedUserData = req.body.updatedUserData;
    const currentUser = req.body.currentUser;
    const userDocRef = db.collection('users').doc(currentUser.uid);
    await userDocRef.update(updatedUserData);
    const updatedUserDocSnapshot = await userDocRef.get();
    console.log('updatedUserDocSnapshot', updatedUserDocSnapshot.data());
    res.json({ updatedUserData: updatedUserDocSnapshot.data() });
  } catch (error) {
    console.error('Error updating user data:', error);
  }
});

app.post('/matchUserWithHouses', async (req, res) => {
  // Async handler
  try {
    const surveyResponses = req.body;
    console.log(surveyResponses);

    // Fetch data from external API
    const response = await axios.get(
      'https://fortress.wa.gov/dshs/adsaapps/lookup/FacilityLookupJSON.aspx?factype=AF'
    );
    const data = response.data;

    // Filter the data by LocationCity === "Shoreline"
    const shorelineHomes = data.filter(
      (home) => home.LocationCity === 'Shoreline'
    );

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

app.post('/sendSurvey', async (req, res) => {
  const userId = req.body.userId;
  const surveyResponses = req.body.surveyResponses;
  const { acceptedTerms, ...surveyData } = surveyResponses;
  try {
    await db.collection('users').doc(userId).update({
      surveyData,
      submittedForm: true,
    });
    res.status(200).json({ message: 'Survey sent successfully' });
  } catch (error) {
    console.error('Error sending survey:', error);
    res.status(500).json({ error: 'Error sending survey' });
  }
});

app.post('/getSurvey', async (req, res) => {
  const userId = req.body.userId;
  console.log('hit survey');
  try {
    const userSnapshot = await db.collection('users').doc(userId).get();
    const userData = userSnapshot.data();
    res.status(200).json({ submittedForm: userData.submittedForm });
  } catch (error) {
    console.error('Error getting survey:', error);
    res.status(404).json({ error: 'Survey not found' });
  }
});

app.get('/getPlacesAutocomplete', async (req, res) => {
  const searchQuery = req.query.searchQuery;
  // const apiKey = await googleMapsApiKey.value();
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  try {
    const geocodeUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${searchQuery}&key=${apiKey}`;
    const geocodeResponse = await axios.get(geocodeUrl);
    const geocodeData = geocodeResponse.data;
    res.json({ places: geocodeData });
  } catch (error) {
    console.error('Error getting places autocomplete:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const generateCacheKey = (centerArray, zoomLevel) => {
  const threshold = 0.0001; // Precision threshold for bounds

  const latDiff = Math.round(centerArray[0] / threshold) * threshold;
  const lngDiff = Math.round(centerArray[1] / threshold) * threshold;

  // Get the current timestamp and round it to the nearest 5-minute mark (300 seconds)
  const timestamp = Math.floor(Date.now() / 1000); // Current timestamp in seconds
  const cacheTTL = 60 * 5; // Cache expires after 5 minutes
  const roundedTimestamp = timestamp - (timestamp % cacheTTL); // Round to 5-minute intervals

  // Create cache key combining rounded latitude, longitude, zoom level, and timestamp
  return `${latDiff},${lngDiff},${zoomLevel},${roundedTimestamp}`;
};

// Inside your map handler:
const geocodeCache = new Map(); // Key: lat,lng | Value: { cityName, zipCode }

app.post('/getProviders', async (req, res) => {
  console.log('hit getProviders');
  const bounds = req.body.bounds;
  const center = req.body.center;
  const radius = req.body.radius;
  const centerArray = Array.isArray(center) ? center : [center.lat, center.lng];
  // const apiKey = await googleMapsApiKey.value();
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const cacheKey = generateCacheKey(centerArray, req.body.zoomLevel);
  let currentZipCode = '';
  let cityName = '';

  console.log('cacheKey', cacheKey);
  console.log('Existing Keys in Cache:', [...geocodeCache.keys()]);

  if (geocodeCache.has(cacheKey)) {
    // Use cached data if available
    ({ cityName, currentZipCode } = geocodeCache.get(cacheKey));
    console.log('cached data', cityName, currentZipCode);
  } else {
    geocodeCache.set(cacheKey, { cityName, currentZipCode });
    try {
      console.log('no cached data');
      // Query the users collection for providers within the specified bounds
      const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${centerArray[0]},${centerArray[1]}&key=${apiKey}`;
      const geocodeResponse = await axios.get(geocodeUrl);
      const geocodeData = geocodeResponse.data;

      let nearbyBigCities = [];

      if (geocodeData.results.length > 0) {
        const addressComponents = geocodeData.results[0].address_components;
        currentZipCode =
          addressComponents.find((component) =>
            component.types.includes('postal_code')
          ).long_name || '';
        cityName =
          addressComponents.find((component) =>
            component.types.includes('locality')
          ).long_name || '';

        const bigCities = [
          { name: 'Seattle', lat: 47.6062, lng: -122.3321 },
          { name: 'Spokane', lat: 47.6588, lng: -117.426 },
          { name: 'Tacoma', lat: 47.2529, lng: -122.4443 },
          { name: 'Vancouver', lat: 45.6387, lng: -122.6615 },
          { name: 'Bellevue', lat: 47.6101, lng: -122.2015 },
          { name: 'Kent', lat: 47.3809, lng: -122.2348 },
          { name: 'Everett', lat: 47.978, lng: -122.2021 },
          { name: 'Renton', lat: 47.4829, lng: -122.2171 },
          { name: 'Spokane Valley', lat: 47.6732, lng: -117.2394 },
          { name: 'Federal Way', lat: 47.3223, lng: -122.3126 },
          { name: 'Yakima', lat: 46.6021, lng: -120.5059 },
          { name: 'Kirkland', lat: 47.6769, lng: -122.206 },
          { name: 'Bellingham', lat: 48.7519, lng: -122.4787 },
          { name: 'Kennewick', lat: 46.2112, lng: -119.1372 },
          { name: 'Auburn', lat: 47.3073, lng: -122.2285 },
          { name: 'Pasco', lat: 46.2396, lng: -119.1006 },
          { name: 'Marysville', lat: 48.0518, lng: -122.1771 },
          { name: 'Lakewood', lat: 47.1718, lng: -122.5185 },
          { name: 'Redmond', lat: 47.673, lng: -122.1215 },
          { name: 'Shoreline', lat: 47.7557, lng: -122.3415 },
          { name: 'Richland', lat: 46.2804, lng: -119.2752 },
          { name: 'Sammamish', lat: 47.6163, lng: -122.0356 },
          { name: 'Burien', lat: 47.4704, lng: -122.3468 },
          { name: 'Lynnwood', lat: 47.8279, lng: -122.305 },
          { name: 'Bothell', lat: 47.7623, lng: -122.2054 },
          { name: 'Puyallup', lat: 47.1854, lng: -122.2929 },
          { name: 'Olympia', lat: 47.0379, lng: -122.9007 },
          { name: 'Lacey', lat: 47.0343, lng: -122.8232 },
          { name: 'Edmonds', lat: 47.8107, lng: -122.3774 },
          { name: 'Bremerton', lat: 47.5673, lng: -122.6326 },
          { name: 'Tumwater', lat: 47.0073, lng: -122.9093 },
        ];
        // Calculate distances and sort big cities by distance
        nearbyBigCities = bigCities
          .map((city) => {
            const distanceInKm = geofire.distanceBetween(
              [city.lat, city.lng],
              centerArray
            );
            return { ...city, distanceInKm };
          })
          .sort((a, b) => a.distanceInKm - b.distanceInKm)
          .slice(0, 4);
      }

      console.log(bounds.south, bounds.west, bounds.north, bounds.east);

      const snapshot = await db
        .collection('users')
        .where('role', '==', 'provider')
        .where('position.lat', '>=', bounds.south)
        .where('position.lat', '<=', bounds.north)
        .where('position.lng', '>=', bounds.west)
        .where('position.lng', '<=', bounds.east)
        .get();

      const providersInBounds = snapshot.docs.map((doc) => doc.data());
      // console.log('providers in bounds', providersInBounds);
      // const results = await query.get();
      // console.log(
      // "results",
      // results.docs.map((doc) => doc.data())
      // );

      // Filter providers based on distance from the center and radius
      const filteredProviders = providersInBounds.filter((provider) => {
        const distanceInKm = geofire.distanceBetween(
          [provider.position.lat, provider.position.lng],
          centerArray
        );
        const distanceInM = distanceInKm * 1000;
        return distanceInM <= radius;
      });
      // console.log("filteredProviders", filteredProviders);

      if (filteredProviders.length > 0) {
        try {
          for (const provider of filteredProviders) {
            const userSnapshot = await db
              .collection('users')
              .doc(provider.userId)
              .get();

            if (userSnapshot.exists) {
              const listingsSnapshot = await userSnapshot.ref
                .collection('listings')
                // .doc(provider.LicenseNumber)
                .get();

              if (listingsSnapshot.docs.length > 0) {
                const roomsSnapshot = await listingsSnapshot.docs[0].ref
                  .collection('rooms')
                  .get();
                provider.roomsData = roomsSnapshot.docs.map((doc) =>
                  doc.data()
                );
              } else {
                provider.roomsData = [];
              }

              // for (const listingDoc of listingsSnapshot.docs) {
              //   console.log('listingDoc', listingDoc.data());
              // }

              provider.listingsData = listingsSnapshot.docs.reduce(
                (acc, doc) => {
                  return { ...acc, ...doc.data() };
                },
                {}
              );
              // console.log('provider.listingsData', provider.listingsData);
            } else {
              console.error(
                'User document not found for provider:',
                provider.userId
              );
            }
          }
          res.json({
            providers: filteredProviders,
            nearbyBigCities,
            currentZipCode,
            cityName,
          });
        } catch (error) {
          console.error('Error getting providers:', error);
          res.status(500).send('Internal Server Error');
        }
      } else {
        // eslint-disable-next-line max-len
        // If there are no providers from the users collection, query the API_AFH_DATA collection
        const snapshotAPI = await db
          .collection('API_AFH_DATA')
          .where(
            'geolocation',
            '>=',
            new admin.firestore.GeoPoint(bounds.south, bounds.west)
          )
          .where(
            'geolocation',
            '<=',
            new admin.firestore.GeoPoint(bounds.north, bounds.east)
          )
          .get();
        const providersInBoundsAPI = snapshotAPI.docs.map((doc) => doc.data());

        console.log(centerArray, radius);
        // eslint-disable-next-line max-len
        // Filter providers from API_AFH_DATA based on distance from the center and radius
        const filteredProvidersAPI = providersInBoundsAPI.filter((provider) => {
          const distanceInKm = geofire.distanceBetween(
            [provider.geolocation.latitude, provider.geolocation.longitude],
            centerArray
          );
          const distanceInM = distanceInKm * 1000;
          return distanceInM <= radius;
        });

        // Combine providers from users collection and API_AFH_DATA collection
        const allProviders = [...filteredProviders, ...filteredProvidersAPI];

        res.json({
          providers: allProviders,
          nearbyBigCities,
          currentZipCode,
          cityName,
        });
      }
    } catch (error) {
      console.error('Error getting providers:', error);
      res.status(500).send('Internal Server Error');
    }
  }
});

app.get('/getUser', async (req, res) => {
  const userId = req.query.userId;
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    } else {
      const userData = userDoc.data();
      return res.status(200).json(userData);
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/getProvider', async (req, res) => {
  const providerId = req.query.providerId;
  if (!providerId) {
    return res.status(400).json({ error: 'Provider ID is required' });
  }
  let provider;
  try {
    const providerSnapshot = await db.collection('users').doc(providerId).get();
    if (providerSnapshot.exists) {
      const listingsSnapshot = await providerSnapshot.ref
        .collection('listings')
        // .doc(provider.LicenseNumber)
        .get();
      provider = providerSnapshot.data();
      for (const listingDoc of listingsSnapshot.docs) {
        try {
          const roomsSnapshot = await listingDoc.ref
            .collection('rooms')
            .where('isAvailable', '==', true)
            .get();
          const roomData = roomsSnapshot.docs.map((doc) => doc.data());

          if (!provider.listingsData) {
            provider.listingsData = [];
          }
          provider.listingsData.push({
            listingId: listingDoc.id,
            roomData: roomData,
          });
          if (listingDoc.exists) {
            const homePhotos = listingDoc.data().homePhotos;
            if (homePhotos) {
              if (!provider.homePhotos) {
                provider.homePhotos = [];
              }
              provider.homePhotos.push(...homePhotos);
            }
          }
        } catch (error) {
          console.error('Error getting room data for listing:', error);
        }
      }
    } else {
      return res.status(404).json({ error: 'Provider not found' });
    }
    res.json({ provider: provider });
  } catch (error) {
    console.error('Error fetching provider:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// app.post('/getProviders' , async (req, res) => {

//   const bounds = req.body.bounds;
//   const center = req.body.center;
//   const radius = req.body.radius;
//   console.log(radius);
// eslint-disable-next-line max-len
//   const centerArray = Array.isArray(center) ? center : [center.lat, center.lng];

//   console.log(center.lat, center.lng);

//   //const radiusInM = 10000;
//   try {
//     console.log(typeof bounds.north);

//     const snapshot = await db.collection('API_AFH_DATA')
//     .where('geolocation', '>=', new admin.firestore.GeoPoint(bounds.south, bounds.west))
//     .where('geolocation', '<=', new admin.firestore.GeoPoint(bounds.north, bounds.east))
//     .get();
//     const providersInBounds = snapshot.docs.map(doc => doc.data());
//     //console.log(radius);
//     // for (const provider of providersInBounds) {
//     //   console.log(geofire.distanceBetween([provider.geolocation.latitude, provider.geolocation.longitude], centerArray) * 1000);
//     // }
//     console.log("provider Count:", providersInBounds.length);
//     const filteredProviders = providersInBounds.filter(provider => {
//       const distanceInKm = geofire.distanceBetween([provider.geolocation.latitude, provider.geolocation.longitude], centerArray);
//       const distanceInM = distanceInKm * 1000;

//       //console.log(distanceInM, radius, distanceInM <= radius);

//       return distanceInM <= radius;
//   });

//   console.log("Filtered Provider Count:", filteredProviders.length); // Log filtered provider count

//     res.json({ providers: filteredProviders });
//   } catch (error) {
//     console.error('Error getting providers:', error);
//     res.status(500).send('Internal Server Error');
//   }
// })

app.post('/findProvider', async (req, res) => {
  // Async handler
  try {
    const providerNumber = req.body.providerNumber;
    console.log(providerNumber);

    // Fetch data from external API
    const response = await axios.get(
      'https://fortress.wa.gov/dshs/adsaapps/lookup/FacilityLookupJSON.aspx?factype=AF'
    );
    const data = response.data;

    // Filter the data by LocationCity === "Shoreline"
    const providerInfo = data.filter(
      (home) => home.LicenseNumber === providerNumber
    );

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
// debug
const debugNumber = process.env.DEBUG_PHONE_NUMBER;
const debugMode = process.env.DEBUG_MODE;

app.post('/sendConfirmationText', async (req, res) => {
  const twilioClient = await config.initTwilio();
  const { phone } = req.body;
  console.log(phone);
  const numericPhoneNumber = phone.replace(/\D/g, '');

  // Prepend +1 to the numeric phone number
  const formattedPhoneNumber = '+1' + numericPhoneNumber;
  const phoneNumber = debugMode ? debugNumber : formattedPhoneNumber;

  const serviceSid = await getServiceSid();

  // Create a verification request
  twilioClient.verify.v2
    .services(serviceSid)
    .verifications.create({ to: phoneNumber, channel: 'sms' })
    .then((verification) => {
      console.log('Verification status:', verification.status);
      res.status(200).send('Confirmation text sent successfully');
    })
    .catch((error) => {
      console.error('Error sending confirmation text:', error);
      res.status(500).send('Error sending confirmation text');
    });
});

app.post('/verifyConfirmationCode', async (req, res) => {
  const twilioClient = await config.initTwilio();
  const { phoneNumber, code } = req.body;
  const numericPhoneNumber = phoneNumber.replace(/\D/g, '');

  // Prepend +1 to the numeric phone number
  const formattedPhoneNumber = '+1' + numericPhoneNumber;
  const phone = debugMode ? debugNumber : formattedPhoneNumber;

  const serviceSid = await getServiceSid();

  // Verify the code provided by the user
  twilioClient.verify.v2
    .services(serviceSid)
    .verificationChecks.create({ to: phone, code: code })
    .then((verificationCheck) => {
      console.log('Verification check status:', verificationCheck.status);
      if (verificationCheck.status === 'approved') {
        res.status(200).send('Confirmation code is valid');
      } else {
        res.status(400).send('Invalid confirmation code');
      }
    })
    .catch((error) => {
      console.error('Error verifying code:', error);
      res.status(500).send('Error verifying confirmation code');
    });
});

// geocoding address
async function geocodeAddress(address) {
  try {
    // const apiKey = googleMapsApiKey.value(); // Replace with your Google Maps API key
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    const encodedAddress = encodeURIComponent(address);
    // console.log('address in geofunc', address);
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`
    );
    const data = response.data;
    // console.log('this the data', data);
    // console.log(data.results);

    if (data.results && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      return { lat: location.lat, lng: location.lng };
    } else {
      console.log('address in geo func error ', address);
      throw new Error('No results found');
    }
  } catch (error) {
    console.error('Error geocoding address:', error);
    return null;
  }
}

app.post('/getAddress', async (req, res) => {
  const { address } = req.body;
  try {
    const geocoded = await geocodeAddress(address);
    console.log(geocoded);
    res.json({ address: geocoded });
  } catch (error) {
    console.error('Error geocoding address:', error);
  }
});

// IN PROGRESS
// app.post("/getAvailListings", async (req, res) => {
// // Async handler
// try {
// let listings = new Set();
// let listingPaths = new Set();
// let listingsData = [];
// const availableRoomsSnapshot = await db
// .collectionGroup("rooms")
// .where("isAvailable", "==", true)
// .get();
// 		availableRoomsSnapshot.forEach((doc) => {
// 			//we have all the available room data right here but currently only use it to get the parent listing.
// 			//it might be better to combine this method with the 'getRoomDataForListingPath' to return both the listing and room data in a single JSON object
// 			//console.log(doc.id, ' => ', doc.data());
// 			const listingId = doc.ref.parent.parent.id;
// 			const listingPath = doc.ref.parent.parent.path;
// 			listings.add(listingId);
// 			listingPaths.add(listingPath);
// 		});
// 		const arrListingPaths = Array.from(listingPaths);
// 		console.log(arrListingPaths);
// 		await Promise.all(
// 			arrListingPaths.map((path) => {
// 				return db
// 					.doc(path)
// 					.get()
// 					.then((doc) => {
// 						console.log(doc.data());
// 						listingsData.push(doc.data());
// 					});
// 			})
// 		);
// 		console.log(listings);
// 		res.json({ listingsData: listingsData, listingPaths: arrListingPaths });
// 	} catch (error) {
// 		console.error("Error getting listings with availability", error);
// 		res.status(500).send("Internal Server Error");
// 	}
// });

// app.post("/getRoomDataForListingPath", async (req, res) => {
// 	// Async handler
// 	try {
// 		const listingPath = req.body.listingPath;
// 		const roomCollectionPath = `${listingPath}/rooms`;
// 		const roomsSnapshot = await db
// 			.collection(roomCollectionPath)
// 			.where("isAvailable", "==", true)
// 			.get();
// 		const roomData = roomsSnapshot.docs.map((doc) => doc.data());
// 		console.log(roomData);
// 		res.json({ roomData: roomData });
// 	} catch (error) {
// 		console.error("Error getting room data for listing", error);
// 		res.status(500).send("Internal Server Error");
// 	}
// });

// eslint-disable-next-line no-unused-vars
const fetchDataAndStoreInFirestore = async () => {
  try {
    const response = await axios.get(
      'https://fortress.wa.gov/dshs/adsaapps/lookup/FacilityLookupJSON.aspx?factype=AF'
    );
    const data = response.data;

    // Iterate over each item in the data array
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
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

      const existingDoc = await db
        .collection('API_AFH_DATA')
        .doc(LicenseNumber)
        .get();
      if (
        existingDoc.exists &&
        existingDoc.LocationAddress === LocationAddress
      ) {
        console.log('document exists');
        continue;
      }

      const address = `${LocationAddress}, ${LocationCity}, ${LocationState}`;

      // Geocode the address to get the position
      let position;
      try {
        position = await geocodeAddress(address);
      } catch (error) {
        console.log('this is the address', address);
        return;
      }

      // Return the provider object with the position field added

      // Extract lat and lng from the LocationAddress or any other source
      const { lat, lng } = position;
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
      await db.collection('API_AFH_DATA').doc(LicenseNumber).set(afhData);

      // Optionally, link the data to the user account based on the license number
      // Here, you would need to implement a way to associate the user with the data
      // For example, if the user document contains a field called 'providers', you can add the LicenseNumber to it
      // await db.collection('users').doc(userId).collection('providers').doc(LicenseNumber).set(afhData);
    }

    console.log('Data stored successfully');
  } catch (error) {
    console.error('Error fetching or storing data:', error);
  }
};

app.post('/getCoordinates', async (req, res) => {
  const { address } = req.body;
  console.log(address);

  let position;
  try {
    position = await geocodeAddress(address);
  } catch (error) {
    console.error('error geocoding address', address);
  }
  const { lat, lng } = position;
  const geolocation = new admin.firestore.GeoPoint(lat, lng);

  // Serialize the GeoPoint object before sending it to the frontend
  const serializedGeolocation = {
    latitude: geolocation.latitude,
    longitude: geolocation.longitude,
  };

  const locationData = {
    position: { lat, lng },
    geolocation: serializedGeolocation,
  };
  res.json({ locationData });
});

app.post('/create-reservation', async (req, res) => {
  try {
    // Create a PaymentIntent on Stripe with the capture_method set to manual
    const stripe = await config.initStripe();

    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1500, // Replace with the actual deposit amount
      currency: 'usd', // Replace with the desired currency
      capture_method: 'manual',
    });

    // Return the client secret
    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating PaymentIntent:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/create-setup-intent', async (req, res) => {
  const stripe = await config.initStripe();
  console.log('create-setup-intent endpoint hit');
  const { paymentMethodId, userId } = req.body;
  console.log('Payment Method ID:', paymentMethodId);

  const user = await db.collection('users').doc(userId).get();
  let stripeCustomerId;
  console.log('cusotmerId', user.stripeCustomerId);
  if (!user.stripeCustomerId) {
    stripeCustomerId = await stripe.customers
      .create({
        // Replace with the user's email
        name: user.displayName || '',
        email: user.email,
      })
      .then((res) => res.id);
    await db.collection('users').doc(userId).update({
      stripeCustomerId: stripeCustomerId,
    });
  } else {
    stripeCustomerId = user.stripeCustomerId;
  }
  console.log('added customer id to user');

  try {
    const setupIntent = await stripe.setupIntents.create({
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never',
      },
      customer: stripeCustomerId,
      payment_method: paymentMethodId,
      confirm: true,
      usage: 'off_session',
    });
    console.log('Setup Intent created:', setupIntent.id);

    // Update Firestore with the Setup Intent ID

    res.send({
      clientSecret: setupIntent.client_secret,
      setupIntentId: setupIntent.id,
    });
  } catch (error) {
    console.error('Error creating Setup Intent:', error);
    res.status(500).send({ error: error.message });
  }
});

app.post('/create-provider-setup-intent', async (req, res) => {
  const stripe = await config.initStripe();
  console.log('create-setup-intent endpoint hit', stripe);
  const { paymentMethodId, displayName, email } = req.body;
  console.log('Payment Method ID:', paymentMethodId);

  const stripeCustomerId = await stripe.customers
    .create({
      // Replace with the user's email
      name: displayName || '',
      email: email,
    })
    .then((res) => res.id);
  try {
    const setupIntent = await stripe.setupIntents.create({
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never',
      },
      customer: stripeCustomerId,
      payment_method: paymentMethodId,
      confirm: true,
      usage: 'off_session',
    });
    console.log('Setup Intent created:', setupIntent.id);

    // Update Firestore with the Setup Intent ID

    res.send({
      clientSecret: setupIntent.client_secret,
      setupIntentId: setupIntent.id,
      customerId: stripeCustomerId,
    });
  } catch (error) {
    console.error('Error creating Setup Intent:', error);
    res.status(500).send({ error: error.message });
  }
});

app.post('/confirm-setup-intent', async (req, res) => {
  const stripe = await config.initStripe();
  const { setupIntentId, userId } = req.body;
  const setup = await stripe.setupIntents.retrieve(setupIntentId);

  const customerId = await db
    .collection('users')
    .doc(userId)
    .get()
    .then((doc) => {
      return doc.data().stripeCustomerId;
    });

  if (!customerId) {
    console.error('No customer ID found for user:', userId);
    res.status(400).json({ error: 'No customer ID found for user' });
  }

  await stripe.paymentMethods.attach(setup.payment_method, {
    customer: customerId,
  });

  await stripe.customers.update(setup.customer, {
    invoice_settings: {
      default_payment_method: setup.payment_method,
    },
  });

  await db.collection('users').doc(userId).update({
    setupIntentId: setupIntentId,
  });
  res.status(200).json({ message: 'Setup Intent confirmed successfully' });
});

app.post('/create-subscription', async (req, res) => {
  const stripe = await config.initStripe();
  const { userId, priceId } = req.body;

  try {
    const userDoc = await db.collection('users').doc(userId).get();
    const user = userDoc.data();
    const setupIntentId = user.setupIntentId;

    if (!setupIntentId) {
      throw new Error('No setup intent ID found for user');
    }

    const setupIntent = await stripe.setupIntents.retrieve(setupIntentId);

    const subscription = await stripe.subscriptions.create({
      customer: user.customerId,
      items: [{ price: priceId }], // Replace with your price ID
      default_payment_method: setupIntent.payment_method,
      // trial_period_days: 30, // Set trial period of 30 days
      // billing_cycle_anchor: "now", // Start billing cycle immediately after trial
    });

    await db.collection('users').doc(userId).update({
      subscriptionId: subscription.id,
    });

    res.status(200).json({ message: 'Success' });
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).send({ error: error.message });
  }
});

app.post('/confirm-provider-setup-intent', async (req, res) => {
  const stripe = await config.initStripe();
  const { setupIntentId, customerId } = req.body;
  const setup = await stripe.setupIntents.retrieve(setupIntentId);

  if (!customerId) {
    res.status(400).json({ error: 'No customer ID found for user' });
  }

  await stripe.paymentMethods.attach(setup.payment_method, {
    customer: customerId,
  });

  await stripe.customers.update(setup.customer, {
    invoice_settings: {
      default_payment_method: setup.payment_method,
    },
  });

  res.status(200).json({ message: 'Setup Intent confirmed successfully' });
});

app.post('/get-list-of-payments', async (req, res) => {
  const stripe = await config.initStripe();
  const userId = req.body.userId;
  const userDoc = await db.collection('users').doc(userId).get();
  const stripeCustomerId = userDoc.data().stripeCustomerId;
  if (stripeCustomerId) {
    const cards = await stripe.paymentMethods.list({
      customer: stripeCustomerId,
      type: 'card',
    });
    const customer = await stripe.customers.retrieve(stripeCustomerId);
    if (customer.deleted) {
      res.status(400).json({ error: 'Customer not found' });
    }
    res.status(200).json({
      cards: cards.data,
      defaultPaymentMethod: customer.invoice_settings.default_payment_method,
    });
  } else {
    res.status(400).json({ error: 'Customer not found' });
  }
});

app.post('/charge-customer', async (req, res) => {
  const stripe = await config.initStripe();
  const { amount, currency, userId } = req.body;

  try {
    const userDoc = await db.collection('users').doc(userId).get();
    const user = userDoc.data();
    const customerId = user.stripeCustomerId;

    if (!customerId) {
      throw new Error('Customer ID not found for user');
    }

    const customer = await stripe.customers.retrieve(customerId);
    const defaultPaymentMethod =
      customer.invoice_settings.default_payment_method;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // amount in cents
      currency: currency,
      customer: customerId,
      payment_method: defaultPaymentMethod, // We don't need to set this explicitly if the customer has a default payment method
      off_session: true,
      confirm: true,
    });

    res.status(200).json({
      message: 'Payment Intent created and confirmed successfully',
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Error creating Payment Intent:', error);
    res.status(500).send({ error: error.message });
  }
});

app.post('/capture-payment', async (req, res) => {
  const stripe = await config.initStripe();
  try {
    const { paymentIntentId } = req.body;

    // Capture the payment
    const paymentIntent = await stripe.paymentIntents.capture(paymentIntentId);

    console.log('Payment captured:', paymentIntent);
    res.status(200).json({ message: 'Payment captured successfully' });
  } catch (error) {
    console.error('Error capturing payment:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/cancel-payment', async (req, res) => {
  const stripe = await config.initStripe();
  try {
    const { paymentIntentId } = req.body;

    // Cancel the payment
    const paymentIntent = await stripe.paymentIntents.cancel(paymentIntentId);

    console.log('Payment canceled:', paymentIntent);
    res.status(200).json({ message: 'Payment canceled successfully' });
  } catch (error) {
    console.error('Error canceling payment:', error);
    res.status(500).json({ error: error.message });
  }
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is running on port ${port} hi`);
  });
}

module.exports = app;
