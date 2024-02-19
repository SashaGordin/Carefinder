const admin = require("./config/firebase-config");
require('dotenv').config({ path: '.env.local' });
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios'); // Import axios
const cors = require('cors'); // Import the cors package
const path = require('path');
//const db = admin.firestore();


const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = require('twilio')(accountSid, authToken);

const app = express();
const port = 3001; // Choose a port for your server

app.use(bodyParser.json());
app.use(cors());

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

// let serviceSid;
// client.verify.v2.services
//   .create({ friendlyName: 'My First Verify Service' })
//   .then(service => {
//     console.log('Verify service SID:', service.sid);
//     serviceSid = service.sid;
//     // Now you can use service.sid to perform verification requests and checks
//   })
//   .catch(error => {
//     console.error('Error creating Verify service:', error);
//   });


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

  app.post('/sendConfirmationText', async (req, res) => {
    const { phone } = req.body;
    console.log(phone);
    const numericPhoneNumber = phone.replace(/\D/g, '');

// Prepend +1 to the numeric phone number
    const formattedPhoneNumber = '+1' + numericPhoneNumber;
    const phoneNumber = "+12066186280";
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
    const phone = "+12066186280";

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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});