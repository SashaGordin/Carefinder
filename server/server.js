const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios'); // Import axios
const cors = require('cors'); // Import the cors package


const app = express();
const port = 3001; // Choose a port for your server

app.use(bodyParser.json());
app.use(cors());


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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});