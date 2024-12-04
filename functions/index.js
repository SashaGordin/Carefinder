/* eslint-disable max-len */
/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-tabs */
/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");
const express = require("express");


const app = express();

const admin = require("./config/firebase-config");
require("dotenv").config({path: ".env.local"});
const bodyParser = require("body-parser");
const axios = require("axios"); // Import axios
// const functions = require("firebase-functions");
const cors = require("cors"); // Import the cors package
const db = admin.firestore();
const geofire = require("geofire-common");
// const functions = require("firebase-functions");
const {defineSecret} = require("firebase-functions/params");
const stripeTestSecretKey = defineSecret("STRIPE_TEST_SECRET_KEY");
const twilioAccountSid = defineSecret("TWILIO_ACCOUNT_SID");
const twilioAuthToken = defineSecret("TWILIO_AUTH_TOKEN");
const googleMapsApiKey = defineSecret("GOOGLE_MAPS_API_KEY");
const {onInit} = require("firebase-functions/v2/core");


// const stripe = require("stripe")(stripeTestSecretKey.value());

// const accountSid = functions.config().twilio.account_sid;
// const authToken = functions.config().twilio.auth_token;
// const API_KEY = functions.config().googlemaps.api_key;

let stripe;
let client;
onInit(() => {
  stripe = require("stripe")(stripeTestSecretKey.value());
  client = require("twilio")(twilioAccountSid.value(), twilioAuthToken.value());
});

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
// app.use(cors({origin: true})); // Allows all origins, you can specify specific origins if needed

const corsOptions = {
  origin: "https://carefinder-4c036.web.app", // Replace with your frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allow these headers
};

app.use(cors(corsOptions));

// ********************************************************
// BEGIN MONITORING MESSAGES for CHANGES /
// SENDING SMS NOTIFICATIONS to PROVIDERS (or ADMINS)
// .....

// phone # cleanup for Twilio:
// format phone number in E.164 format before sending the SMS
//  -- adds the country code prefix (e.g., +1 for US numbers)
//  -- removes any non-digit characters.
const formatPhoneNumber = (phone) => {
  // Assuming US phone numbers, add country code +1
  if (!phone.startsWith("+")) {
    return `+1${phone.replace(/\D/g, "")}`;
  }
  return phone.replace(/\D/g, "");
};
// eslint-disable-next-line require-jsdoc
// async function createTwilioClient() {
//   const accountSid = await twilioAccountSid();
//   const authToken = await twilioAuthToken();
//   return require("twilio")(accountSid, authToken);
// }

// // eslint-disable-next-line require-jsdoc
// async function getGoogleMapsApiKey() {
//   try {
//     return await googleMapsApiKey.value();
//   } catch (error) {
//     console.error("Error getting Google Maps API key:", error);
//     throw new Error("Failed to retrieve Google Maps API key.");
//   }
// }

// // eslint-disable-next-line require-jsdoc
// async function getStripeTestSecretKey() {
//   try {
//     return await stripeTestSecretKey();
//   } catch (error) {
//     console.error("Error getting Stripe Test Secret Key:", error);
//     throw new Error("Failed to retrieve Stripe Test Secret Key.");
//   }
// }

// Function to handle new messages:
const handleNewMessage = async (doc) => {
  try {
    const messageData = doc.data();
    const msgTo = messageData.msgTo;
    const docId = doc.id;
    // console.log(`SERVER: Work w/ document ID: ${docId}`);

    // ********** BEGIN VALIDATIONS **********

    // Validation:  Check if msgTo is null
    if (!msgTo) {
      // console.log(
      //     "SERVER: `msgTo` is null for msgID " + docId + ". Skipping message!",
      // );
      return;
    }

    // Validation:  Skip any already notified...
    const SMSsent = messageData.msgNotified;
    if (SMSsent === 1) {
      // console.log("SERVER: Response already sent to: ", docId);
      return;
    }

    // Validation:  Message recipient must be a valid user...
    const userSnapshot = await db.collection("users").doc(msgTo).get();
    if (!userSnapshot.exists) {
      // console.log("SERVER: User not found: ", msgTo);
      return;
    }

    const userData = userSnapshot.data();
    const userRole = userData.role;

    // Validation:  Recipient cannot be a "client" role...
    if (userRole === "client") {
      // console.log(
      //     "SERVER: We are not sending notifications to role: ",
      //     userRole,
      // );
      return;
    }

    // Validation:  Recipient needs to have phone on file...
    let userPhone = userData.TelephoneNmbr;
    if (!userPhone) {
      // console.log("SERVER: User phone number not found.");
      return;
    }
    // Validation:  Format the phone number to E.164
    userPhone = formatPhoneNumber(userPhone);

    // Validation:  Future logic TBD -- e.g., check if user has opted out of messaging

    // ********** END VALIDATIONS **********

    // Set the SMS (s/b short, I guess). Best practice is to include a full URL, like so:
    const smsMessage =
			"You have a new message on CareFinder! Visit https://www.carefinder.com to read/respond.";

    // Fetch or create the Messaging Service SID
    // console.log("SERVER: FETCH TRILIO SERVICE ID...");
    const msgSvcSID = await getMessagingServiceSid();
    // console.log(`SERVER: Using Twilio Service SID: ${msgSvcSID}`);


    client.messages
        .create({
          body: smsMessage,
          to: userPhone,
          messagingServiceSid: msgSvcSID,
        })
        .then(async (message) => {
          // console.log(
          //     "SERVER: SMS sent to phone# " + userPhone + ", ID: ",
          //     message.sid,
          // );

          // Update the msgNotified field to 1...
          // I think we definitely need to do this, as sometimes Firestore initially sends ALL
          // messages here. So, we want to skip any already-notified ones.
          // console.log(`SERVER: Updating msgNotified for document ID: ${docId}`);
          await db.collection("messages").doc(docId).update({msgNotified: 1});
          // console.log("SERVER: msgNotified field updated to 1");
        })
        .catch((error) =>
          console.error(
              "SERVER: Error sending SMS of messageID " + docId + " ... ERROR: ",
              error,
          ),
        );
  } catch (error) {
    console.error("SERVER: Error handling new message:", error);
  }
};

// Listen for new messages in Firestore
db.collection("messages").onSnapshot((snapshot) => {
  snapshot.docChanges().forEach((change) => {
    if (change.type === "added") {
      handleNewMessage(change.doc);
    }
  });
});

// END MONITORING MESSAGES for CHANGES
// && SENDING SMS NOTIFICATIONS
// ********************************************************

// eslint-disable-next-line require-jsdoc
async function getServiceSid() {
  try {
    const docRef = admin.firestore().collection("twilio").doc("serviceSid");
    const doc = await docRef.get();
    if (doc.exists) {
      const serviceSid = doc.data().sid;
      // Check if the service SID is still valid by attempting to use it
      try {
        await client.verify.v2.services(serviceSid).fetch();
        return serviceSid; // Service SID is still valid
      } catch (error) {
        console.error("Error using stored service SID:", error);
        // If service SID is expired or invalid, create a new one
        const newService = await client.verify.v2.services.create({
          friendlyName: "My First Verify Service",
        });
        const newServiceSid = newService.sid;
        // Store new service SID in Firestore
        await docRef.set({sid: newServiceSid});
        return newServiceSid;
      }
    } else {
      // If service SID doesn't exist, create a new one
      const service = await client.verify.v2.services.create({
        friendlyName: "My First Verify Service",
      });
      const serviceSid = service.sid;
      // Store service SID in Firestore
      await docRef.set({sid: serviceSid});
      return serviceSid;
    }
  } catch (error) {
    console.error("Error getting service SID:", error);
    throw error;
  }
}

// eslint-disable-next-line require-jsdoc
async function getMessagingServiceSid() {
  try {
    const docRef = admin
        .firestore()
        .collection("twilio")
        .doc("messagingServiceSid");
    const doc = await docRef.get();
    if (doc.exists) {
      const serviceSid = doc.data().sid;
      // Check if the service SID is still valid by attempting to use it
      try {
        await client.messaging.v1.services(serviceSid).fetch();
        return serviceSid; // Service SID is still valid
      } catch (error) {
        console.error("Error using stored Messaging Service SID:", error);
        // If service SID is expired or invalid, create a new one
        const newService = await client.messaging.v1.services.create({
          friendlyName: "My Messaging Service",
        });
        const newServiceSid = newService.sid;
        // Store new service SID in Firestore
        await docRef.set({sid: newServiceSid});
        return newServiceSid;
      }
    } else {
      // If service SID doesn't exist, create a new one
      const service = await client.messaging.v1.services.create({
        friendlyName: "My Messaging Service",
      });
      const serviceSid = service.sid;
      // Store service SID in Firestore
      await docRef.set({sid: serviceSid});
      return serviceSid;
    }
  } catch (error) {
    console.error("Error getting Messaging Service SID:", error);
    throw error;
  }
}

app.post("/getProviders", async (req, res) => {
  const bounds = req.body.bounds;
  const center = req.body.center;
  const radius = req.body.radius;
  const centerArray = Array.isArray(center) ? center : [center.lat, center.lng];
  const apiKey = googleMapsApiKey.value(); // Replace with your Google Maps API key

  try {
    // Query the users collection for providers within the specified bounds
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${centerArray[0]},${centerArray[1]}&key=${apiKey}`;
    const geocodeResponse = await axios.get(geocodeUrl);
    const geocodeData = geocodeResponse.data;

    let currentZipCode = "";
    let cityName = "";
    let nearbyBigCities = [];

    if (geocodeData.results.length > 0) {
      const addressComponents = geocodeData.results[0].address_components;
      currentZipCode =
				addressComponents.find((component) =>
				  component.types.includes("postal_code"),
				)?.long_name || "";
      cityName =
				addressComponents.find((component) =>
				  component.types.includes("locality"),
				)?.long_name || "";

      const bigCities = [
        {name: "Seattle", lat: 47.6062, lng: -122.3321},
        {name: "Spokane", lat: 47.6588, lng: -117.426},
        {name: "Tacoma", lat: 47.2529, lng: -122.4443},
        {name: "Vancouver", lat: 45.6387, lng: -122.6615},
        {name: "Bellevue", lat: 47.6101, lng: -122.2015},
        {name: "Kent", lat: 47.3809, lng: -122.2348},
        {name: "Everett", lat: 47.978, lng: -122.2021},
        {name: "Renton", lat: 47.4829, lng: -122.2171},
        {name: "Spokane Valley", lat: 47.6732, lng: -117.2394},
        {name: "Federal Way", lat: 47.3223, lng: -122.3126},
        {name: "Yakima", lat: 46.6021, lng: -120.5059},
        {name: "Kirkland", lat: 47.6769, lng: -122.206},
        {name: "Bellingham", lat: 48.7519, lng: -122.4787},
        {name: "Kennewick", lat: 46.2112, lng: -119.1372},
        {name: "Auburn", lat: 47.3073, lng: -122.2285},
        {name: "Pasco", lat: 46.2396, lng: -119.1006},
        {name: "Marysville", lat: 48.0518, lng: -122.1771},
        {name: "Lakewood", lat: 47.1718, lng: -122.5185},
        {name: "Redmond", lat: 47.673, lng: -122.1215},
        {name: "Shoreline", lat: 47.7557, lng: -122.3415},
        {name: "Richland", lat: 46.2804, lng: -119.2752},
        {name: "Sammamish", lat: 47.6163, lng: -122.0356},
        {name: "Burien", lat: 47.4704, lng: -122.3468},
        {name: "Lynnwood", lat: 47.8279, lng: -122.305},
        {name: "Bothell", lat: 47.7623, lng: -122.2054},
        {name: "Puyallup", lat: 47.1854, lng: -122.2929},
        {name: "Olympia", lat: 47.0379, lng: -122.9007},
        {name: "Lacey", lat: 47.0343, lng: -122.8232},
        {name: "Edmonds", lat: 47.8107, lng: -122.3774},
        {name: "Bremerton", lat: 47.5673, lng: -122.6326},
        {name: "Tumwater", lat: 47.0073, lng: -122.9093},
      ];
      // Calculate distances and sort big cities by distance
      nearbyBigCities = bigCities
          .map((city) => {
            const distanceInKm = geofire.distanceBetween(
                [city.lat, city.lng],
                centerArray,
            );
            return {...city, distanceInKm};
          })
          .sort((a, b) => a.distanceInKm - b.distanceInKm)
          .slice(0, 4);
    }

    const snapshot = await admin
        .firestore()
        .collection("users")
        .where("role", "==", "provider")
        .where(
            "geolocation",
            ">=",
            new admin.firestore.GeoPoint(bounds.south, bounds.west),
        )
        .where(
            "geolocation",
            "<=",
            new admin.firestore.GeoPoint(bounds.north, bounds.east),
        )
        .get();

    const providersInBounds = snapshot.docs.map((doc) => doc.data());
    console.log("providers in bounds", providersInBounds);

    // Filter providers based on distance from the center and radius
    const filteredProviders = providersInBounds.filter((provider) => {
      const distanceInKm = geofire.distanceBetween(
          [provider.geolocation.latitude, provider.geolocation.longitude],
          centerArray,
      );
      const distanceInM = distanceInKm * 1000;
      return distanceInM <= radius;
    });

    if (filteredProviders.length > 0) {
      try {
        for (const provider of filteredProviders) {
          const userSnapshot = await admin
              .firestore()
              .collection("users")
              .doc(provider.userId)
              .get();

          if (userSnapshot.exists) {
            const listingsSnapshot = await userSnapshot.ref
                .collection("listings")
            // .doc(provider.LicenseNumber)
                .get();

            for (const listingDoc of listingsSnapshot.docs) {
              try {
                const roomsSnapshot = await listingDoc.ref
                    .collection("rooms")
                    .where("isAvailable", "==", true)
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
                console.error("Error getting room data for listing:", error);
              }
            }
          } else {
            console.error(
                "User document not found for provider:",
                provider.userId,
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
        console.error("Error getting providers:", error);
        res.status(500).send("Internal Server Error", error);
      }
    } else {
      // If there are no providers from the users collection, query the API_AFH_DATA collection
      const snapshotAPI = await admin
          .firestore()
          .collection("API_AFH_DATA")
          .where(
              "geolocation",
              ">=",
              new admin.firestore.GeoPoint(bounds.south, bounds.west),
          )
          .where(
              "geolocation",
              "<=",
              new admin.firestore.GeoPoint(bounds.north, bounds.east),
          )
          .get();
      const providersInBoundsAPI = snapshotAPI.docs.map((doc) => doc.data());

      console.log(centerArray, radius);
      // Filter providers from API_AFH_DATA based on distance from the center and radius
      const filteredProvidersAPI = providersInBoundsAPI.filter((provider) => {
        const distanceInKm = geofire.distanceBetween(
            [provider.geolocation.latitude, provider.geolocation.longitude],
            centerArray,
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
    console.error("Error getting providers:", error);
    res.status(500).send("Internal Server Error", error);
  }
});

app.get("/getUser", async (req, res) => {
  const userId = req.query.userId;
  if (!userId) {
    return res.status(400).json({error: "User ID is required"});
  }

  try {
    const userDoc = await db.collection("users").doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({error: "User not found"});
    } else {
      const userData = userDoc.data();
      return res.status(200).json(userData);
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({error: "Internal Server Error"});
  }
});

app.get("/getProvider", async (req, res) => {
  const providerId = req.query.providerId;
  if (!providerId) {
    return res.status(400).json({error: "Provider ID is required"});
  }
  let provider;
  try {
    const providerSnapshot = await db.collection("users").doc(providerId).get();
    if (providerSnapshot.exists) {
      const listingsSnapshot = await providerSnapshot.ref
          .collection("listings")
      // .doc(provider.LicenseNumber)
          .get();
      provider = providerSnapshot.data();
      for (const listingDoc of listingsSnapshot.docs) {
        try {
          const roomsSnapshot = await listingDoc.ref
              .collection("rooms")
              .where("isAvailable", "==", true)
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
          console.error("Error getting room data for listing:", error);
        }
      }
    } else {
      return res.status(404).json({error: "Provider not found"});
    }
    res.json({provider: provider});
  } catch (error) {
    console.error("Error fetching provider:", error);
    return res.status(500).json({error: "Internal Server Error"});
  }
});

app.post("/findProvider", async (req, res) => {
  // Async handler
  try {
    const providerNumber = req.body.providerNumber;
    console.log(providerNumber);

    // Fetch data from external API
    const response = await axios.get(
        "https://fortress.wa.gov/dshs/adsaapps/lookup/FacilityLookupJSON.aspx?factype=AF",
    );
    const data = response.data;

    // Filter the data by LocationCity === "Shoreline"
    const providerInfo = data.filter(
        (home) => home.LicenseNumber === providerNumber,
    );

    console.log(providerInfo);
    // Process filtered data here

    // Implement your matching logic here
    // ...

    // Return matched houses to the client
    res.json({providerInfo: providerInfo});
  } catch (error) {
    console.error("Error matching houses:", error);
    res.status(500).send("Internal Server Error");
  }
});
// debug
const debugNumber = process.env.DEBUG_PHONE_NUMBER;
const debugMode = process.env.DEBUG_MODE;

app.post("/sendConfirmationText", async (req, res) => {
  const {phone} = req.body;
  console.log(phone);
  const numericPhoneNumber = phone.replace(/\D/g, "");

  // Prepend +1 to the numeric phone number
  const formattedPhoneNumber = "+1" + numericPhoneNumber;
  const phoneNumber = debugMode ? debugNumber : formattedPhoneNumber;

  const serviceSid = await getServiceSid();

  // Create a verification request
  client.verify.v2
      .services(serviceSid)
      .verifications.create({to: phoneNumber, channel: "sms"})
      .then((verification) => {
        console.log("Verification status:", verification.status);
        res.status(200).send("Confirmation text sent successfully");
      })
      .catch((error) => {
        console.error("Error sending confirmation text:", error);
        res.status(500).send("Error sending confirmation text");
      });
});

app.post("/verifyConfirmationCode", async (req, res) => {
  const {phoneNumber, code} = req.body;
  const numericPhoneNumber = phoneNumber.replace(/\D/g, "");


  // Prepend +1 to the numeric phone number
  const formattedPhoneNumber = "+1" + numericPhoneNumber;
  const phone = debugMode ? debugNumber : formattedPhoneNumber;

  const serviceSid = await getServiceSid();

  // Verify the code provided by the user
  client.verify.v2
      .services(serviceSid)
      .verificationChecks.create({to: phone, code: code})
      .then((verificationCheck) => {
        console.log("Verification check status:", verificationCheck.status);
        if (verificationCheck.status === "approved") {
          res.status(200).send("Confirmation code is valid");
        } else {
          res.status(400).send("Invalid confirmation code");
        }
      })
      .catch((error) => {
        console.error("Error verifying code:", error);
        res.status(500).send("Error verifying confirmation code");
      });
});

// eslint-disable-next-line require-jsdoc
async function geocodeAddress(address) {
  try {
    const apiKey = googleMapsApiKey.value(); // Replace with your Google Maps API key
    const encodedAddress = encodeURIComponent(address);
    console.log("address in geofunc", address);
    const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`,
    );
    const data = response.data;
    console.log("this the data", data);
    // console.log(data.results);

    if (data.results && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      return {lat: location.lat, lng: location.lng};
    } else {
      console.log("address in geo func error ", address);
      throw new Error("No results found");
    }
  } catch (error) {
    console.error("Error geocoding address:", error);
    return null;
  }
}

app.post("/getAddress", async (req, res) => {
  const {address} = req.body;
  try {
    const geocoded = await geocodeAddress(address);
    console.log(geocoded);
    res.json({address: geocoded});
  } catch (error) {
    console.error("Error geocoding address:", error);
  }
});

app.options("/getAddress", cors(corsOptions)); // This will handle the preflight request


app.post("/getCoordinates", async (req, res) => {
  const {address} = req.body;
  console.log(address);

  let position;
  try {
    position = await geocodeAddress(address);
  } catch {
    console.error("error geocoding address", address);
  }
  const {lat, lng} = position;
  const geolocation = new admin.firestore.GeoPoint(lat, lng);

  // Serialize the GeoPoint object before sending it to the frontend
  const serializedGeolocation = {
    latitude: geolocation.latitude,
    longitude: geolocation.longitude,
  };

  const locationData = {
    position: {lat, lng},
    geolocation: serializedGeolocation,
  };
  res.json({locationData});
});

app.post("/create-reservation", async (req, res) => {
  try {
    // Create a PaymentIntent on Stripe with the capture_method set to manual
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1500, // Replace with the actual deposit amount
      currency: "usd", // Replace with the desired currency
      capture_method: "manual",
    });

    // Return the client secret
    res.status(200).json({clientSecret: paymentIntent.client_secret});
  } catch (error) {
    console.error("Error creating PaymentIntent:", error);
    res.status(500).json({error: error.message});
  }
});

app.post("/create-setup-intent", async (req, res) => {
  const {paymentMethodId, userId} = req.body;
  const user = await db.collection("users").doc(userId).get();
  let stripeCustomerId;
  console.log("cusotmerId", user.stripeCustomerId);
  if (!user.stripeCustomerId) {
    stripeCustomerId = await stripe.customers
        .create({
          // Replace with the user's email
          name: user.displayName || "",
          email: user.email,
        })
        .then((res) => res.id);
    await db.collection("users").doc(userId).update({
      stripeCustomerId: stripeCustomerId,
    });
  } else {
    stripeCustomerId = user.stripeCustomerId;
  }
  console.log("added customer id to user");

  try {
    const setupIntent = await stripe.setupIntents.create({
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never",
      },
      customer: stripeCustomerId,
      payment_method: paymentMethodId,
      confirm: true,
      usage: "off_session",
    });
    console.log("Setup Intent created:", setupIntent.id);

    // Update Firestore with the Setup Intent ID

    res.send({
      clientSecret: setupIntent.client_secret,
      setupIntentId: setupIntent.id,
    });
  } catch (error) {
    console.error("Error creating Setup Intent:", error);
    res.status(500).send({error: error.message});
  }
});

app.post("/create-provider-setup-intent", async (req, res) => {
  const {paymentMethodId, displayName, email} = req.body;
  const stripeCustomerId = await stripe.customers
      .create({
        // Replace with the user's email
        name: displayName || "",
        email: email,
      })
      .then((res) => res.id);
  try {
    const setupIntent = await stripe.setupIntents.create({
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never",
      },
      customer: stripeCustomerId,
      payment_method: paymentMethodId,
      confirm: true,
      usage: "off_session",
    });
    console.log("Setup Intent created:", setupIntent.id);

    // Update Firestore with the Setup Intent ID

    res.send({
      clientSecret: setupIntent.client_secret,
      setupIntentId: setupIntent.id,
      customerId: stripeCustomerId,
    });
  } catch (error) {
    console.error("Error creating Setup Intent:", error);
    res.status(500).send({error: error.message});
  }
});

app.post("/confirm-setup-intent", async (req, res) => {
  const {setupIntentId, userId} = req.body;
  const setup = await stripe.setupIntents.retrieve(setupIntentId);
  const customerId = await db
      .collection("users")
      .doc(userId)
      .get()
      .then((doc) => {
        return doc.data().stripeCustomerId;
      });

  if (!customerId) {
    console.error("No customer ID found for user:", userId);
    res.status(400).json({error: "No customer ID found for user"});
  }

  await stripe.paymentMethods.attach(setup.payment_method, {
    customer: customerId,
  });

  await stripe.customers.update(setup.customer, {
    invoice_settings: {
      default_payment_method: setup.payment_method,
    },
  });

  await db.collection("users").doc(userId).update({
    setupIntentId: setupIntentId,
  });
  res.status(200).json({message: "Setup Intent confirmed successfully"});
});

app.post("/create-subscription", async (req, res) => {
  const {userId, priceId} = req.body;
  try {
    const userDoc = await db.collection("users").doc(userId).get();
    const user = userDoc.data();
    const setupIntentId = user.setupIntentId;

    if (!setupIntentId) {
      throw new Error("No setup intent ID found for user");
    }

    const setupIntent = await stripe.setupIntents.retrieve(setupIntentId);

    const subscription = await stripe.subscriptions.create({
      customer: user.customerId,
      items: [{price: priceId}], // Replace with your price ID
      default_payment_method: setupIntent.payment_method,
      // trial_period_days: 30, // Set trial period of 30 days
      // billing_cycle_anchor: "now", // Start billing cycle immediately after trial
    });

    await db.collection("users").doc(userId).update({
      subscriptionId: subscription.id,
    });

    res.status(200).json({message: "Success"});
  } catch (error) {
    console.error("Error creating subscription:", error);
    res.status(500).send({error: error.message});
  }
});

app.post("/confirm-provider-setup-intent", async (req, res) => {
  const {setupIntentId, customerId} = req.body;
  const setup = await stripe.setupIntents.retrieve(setupIntentId);
  if (!customerId) {
    res.status(400).json({error: "No customer ID found for user"});
  }
  await stripe.paymentMethods.attach(setup.payment_method, {
    customer: customerId,
  });

  await stripe.customers.update(setup.customer, {
    invoice_settings: {
      default_payment_method: setup.payment_method,
    },
  });

  res.status(200).json({message: "Setup Intent confirmed successfully"});
});

app.post("/get-list-of-payments", async (req, res) => {
  const userId = req.body.userId;
  const userDoc = await db.collection("users").doc(userId).get();
  const stripeCustomerId = userDoc.data().stripeCustomerId;
  if (stripeCustomerId) {
    const cards = await stripe.paymentMethods.list({
      customer: stripeCustomerId,
      type: "card",
    });
    const customer = await stripe.customers.retrieve(stripeCustomerId);
    if (customer.deleted) {
      res.status(400).json({error: "Customer not found"});
    }
    res.status(200).json({
      cards: cards.data,
      defaultPaymentMethod: customer.invoice_settings.default_payment_method,
    });
  } else {
    res.status(400).json({error: "Customer not found"});
  }
});

app.post("/charge-customer", async (req, res) => {
  const {amount, currency, userId} = req.body;
  try {
    const userDoc = await db.collection("users").doc(userId).get();
    const user = userDoc.data();
    const customerId = user.stripeCustomerId;

    if (!customerId) {
      throw new Error("Customer ID not found for user");
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
      message: "Payment Intent created and confirmed successfully",
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error("Error creating Payment Intent:", error);
    res.status(500).send({error: error.message});
  }
});

app.post("/capture-payment", async (req, res) => {
  try {
    const {paymentIntentId} = req.body;
    // Capture the payment
    const paymentIntent = await stripe.paymentIntents.capture(paymentIntentId);

    console.log("Payment captured:", paymentIntent);
    res.status(200).json({message: "Payment captured successfully"});
  } catch (error) {
    console.error("Error capturing payment:", error);
    res.status(500).json({error: error.message});
  }
});

app.post("/cancel-payment", async (req, res) => {
  try {
    const {paymentIntentId} = req.body;
    // Cancel the payment
    const paymentIntent = await stripe.paymentIntents.cancel(paymentIntentId);

    console.log("Payment canceled:", paymentIntent);
    res.status(200).json({message: "Payment canceled successfully"});
  } catch (error) {
    console.error("Error canceling payment:", error);
    res.status(500).json({error: error.message});
  }
});
// const port = 8080;
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

exports.api = onRequest(
    {secrets: [googleMapsApiKey, stripeTestSecretKey, twilioAccountSid, twilioAuthToken]}, // Bind secrets here
    app,
);
// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
