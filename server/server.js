const Stripe = require("stripe");
const admin = require("./config/firebase-config");
require("dotenv").config({ path: ".env.local" });
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios"); // Import axios
const cors = require("cors"); // Import the cors package
const path = require("path");
const db = admin.firestore();
const geohash = require("geohash");
const geofire = require("geofire-common");

const stripe = new Stripe(process.env.STRIPE_TEST_SECRET_KEY);

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const client = require("twilio")(accountSid, authToken);

const app = express();
const port = 3001; // Choose a port for your server

app.use(bodyParser.json());
app.use(cors());

async function updateAPIDATA() {
	const snapshot = await admin.firestore().collection("API_AFH_DATA").get();

	const updates = [];

	snapshot.forEach((doc) => {
		const { lat, lng } = doc.data().position; // Assuming your existing documents have a 'position' field with lat and lng
		const geoHash = geofire.geohashForLocation([lat, lng]);

		updates.push(
			admin.firestore().collection("API_AFH_DATA").doc(doc.id).update({
				geoHash: geoHash,
			})
		);
	});

	await Promise.all(updates);

	console.log("All documents updated successfully.");
}

// updateAPIDATA();

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
				await docRef.set({ sid: newServiceSid });
				return newServiceSid;
			}
		} else {
			// If service SID doesn't exist, create a new one
			const service = await client.verify.v2.services.create({
				friendlyName: "My First Verify Service",
			});
			const serviceSid = service.sid;
			// Store service SID in Firestore
			await docRef.set({ sid: serviceSid });
			return serviceSid;
		}
	} catch (error) {
		console.error("Error getting service SID:", error);
		throw error;
	}
}

app.post("/matchUserWithHouses", async (req, res) => {
	// Async handler
	try {
		const surveyResponses = req.body;
		console.log(surveyResponses);

		// Fetch data from external API
		const response = await axios.get(
			"https://fortress.wa.gov/dshs/adsaapps/lookup/FacilityLookupJSON.aspx?factype=AF"
		);
		const data = response.data;

		// Filter the data by LocationCity === "Shoreline"
		const shorelineHomes = data.filter(
			(home) => home.LocationCity === "Shoreline"
		);

		console.log(shorelineHomes);
		// Process filtered data here

		// Implement your matching logic here
		// ...

		// Return matched houses to the client
		res.json({ matchedHouses: shorelineHomes });
	} catch (error) {
		console.error("Error matching houses:", error);
		res.status(500).send("Internal Server Error");
	}
});

app.post("/getProviders", async (req, res) => {
	const bounds = req.body.bounds;
	const center = req.body.center;
	const radius = req.body.radius;
	const centerArray = Array.isArray(center) ? center : [center.lat, center.lng];

	try {
		// Query the users collection for providers within the specified bounds
		const snapshot = await admin
			.firestore()
			.collection("users")
			.where("role", "==", "provider")
			.where(
				"geolocation",
				">=",
				new admin.firestore.GeoPoint(bounds.south, bounds.west)
			)
			.where(
				"geolocation",
				"<=",
				new admin.firestore.GeoPoint(bounds.north, bounds.east)
			)
			.get();

		const providersInBounds = snapshot.docs.map((doc) => doc.data());

		// Filter providers based on distance from the center and radius
		const filteredProviders = providersInBounds.filter((provider) => {
			const distanceInKm = geofire.distanceBetween(
				[provider.geolocation.latitude, provider.geolocation.longitude],
				centerArray
			);
			const distanceInM = distanceInKm * 1000;
			return distanceInM <= radius;
		});

		console.log("Provider Count:", filteredProviders.length); // Log filtered provider count

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
							provider.userId
						);
					}
				}
				res.json({ providers: filteredProviders });
			} catch (error) {
				console.error("Error getting providers:", error);
				res.status(500).send("Internal Server Error");
			}
		} else {
			// If there are no providers from the users collection, query the API_AFH_DATA collection
			const snapshotAPI = await admin
				.firestore()
				.collection("API_AFH_DATA")
				.where(
					"geolocation",
					">=",
					new admin.firestore.GeoPoint(bounds.south, bounds.west)
				)
				.where(
					"geolocation",
					"<=",
					new admin.firestore.GeoPoint(bounds.north, bounds.east)
				)
				.get();
			const providersInBoundsAPI = snapshotAPI.docs.map((doc) => doc.data());

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

			res.json({ providers: allProviders });
		}
	} catch (error) {
		console.error("Error getting providers:", error);
		res.status(500).send("Internal Server Error");
	}
});

app.get("/getUser", async (req, res) => {
	const userId = req.query.userId;
	if (!userId) {
		return res.status(400).json({ error: "User ID is required" });
	}

	try {
		const userDoc = await db.collection("users").doc(userId).get();
		if (!userDoc.exists) {
			return res.status(404).json({ error: "User not found" });
		} else {
			const userData = userDoc.data();
			return res.status(200).json(userData);
		}
	} catch (error) {
		console.error("Error fetching user:", error);
		return res.status(500).json({ error: "Internal Server Error" });
	}
});

app.get("/getProvider", async (req, res) => {
	const providerId = req.query.providerId;
	if (!providerId) {
		return res.status(400).json({ error: "Provider ID is required" });
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
			return res.status(404).json({ error: "Provider not found" });
		}
		res.json({ provider: provider });
	} catch (error) {
		console.error("Error fetching provider:", error);
		return res.status(500).json({ error: "Internal Server Error" });
	}
});

// app.post('/getProviders' , async (req, res) => {

//   const bounds = req.body.bounds;
//   const center = req.body.center;
//   const radius = req.body.radius;
//   console.log(radius);
//   const centerArray = Array.isArray(center) ? center : [center.lat, center.lng];

//   console.log(center.lat, center.lng);

//   //const radiusInM = 10000;
//   try {
//     console.log(typeof bounds.north);

//     const snapshot = await admin.firestore().collection('API_AFH_DATA')
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

app.post("/findProvider", async (req, res) => {
	// Async handler
	try {
		const providerNumber = req.body.providerNumber;
		console.log(providerNumber);

		// Fetch data from external API
		const response = await axios.get(
			"https://fortress.wa.gov/dshs/adsaapps/lookup/FacilityLookupJSON.aspx?factype=AF"
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
		console.error("Error matching houses:", error);
		res.status(500).send("Internal Server Error");
	}
});
//debug
const debugNumber = process.env.DEBUG_PHONE_NUMBER;
const debugMode = process.env.DEBUG_MODE;

app.post("/sendConfirmationText", async (req, res) => {
	const { phone } = req.body;
	console.log(phone);
	const numericPhoneNumber = phone.replace(/\D/g, "");

	// Prepend +1 to the numeric phone number
	const formattedPhoneNumber = "+1" + numericPhoneNumber;
	let phoneNumber = debugMode ? debugNumber : formattedPhoneNumber;

	const serviceSid = await getServiceSid();

	// Create a verification request
	client.verify.v2
		.services(serviceSid)
		.verifications.create({ to: phoneNumber, channel: "sms" })
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
	const { phoneNumber, code } = req.body;
	const numericPhoneNumber = phoneNumber.replace(/\D/g, "");

	// Prepend +1 to the numeric phone number
	const formattedPhoneNumber = "+1" + numericPhoneNumber;
	let phone = debugMode ? debugNumber : formattedPhoneNumber;

	const serviceSid = await getServiceSid();

	// Verify the code provided by the user
	client.verify.v2
		.services(serviceSid)
		.verificationChecks.create({ to: phone, code: code })
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

async function geocodeAddress(address) {
	try {
		const apiKey = API_KEY; // Replace with your Google Maps API key
		const encodedAddress = encodeURIComponent(address);
		console.log("address in geofunc", address);
		const response = await axios.get(
			`https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`
		);
		const data = response.data;
		console.log("this the data", data);
		//console.log(data.results);

		if (data.results && data.results.length > 0) {
			const location = data.results[0].geometry.location;
			return { lat: location.lat, lng: location.lng };
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
	const { address } = req.body;
	try {
		const geocoded = await geocodeAddress(address);
		console.log(geocoded);
		res.json({ address: geocoded });
	} catch (error) {
		console.error("Error geocoding address:", error);
	}
});

//IN PROGRESS
// app.post("/getAvailListings", async (req, res) => {
// 	// Async handler
// 	try {
// 		let listings = new Set();
// 		let listingPaths = new Set();
// 		let listingsData = [];
// 		const availableRoomsSnapshot = await admin
// 			.firestore()
// 			.collectionGroup("rooms")
// 			.where("isAvailable", "==", true)
// 			.get();
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
// 				return admin
// 					.firestore()
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
// 		const roomsSnapshot = await admin
// 			.firestore()
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

const fetchDataAndStoreInFirestore = async () => {
	try {
		const response = await axios.get(
			"https://fortress.wa.gov/dshs/adsaapps/lookup/FacilityLookupJSON.aspx?factype=AF"
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

			const existingDoc = await admin
				.firestore()
				.collection("API_AFH_DATA")
				.doc(LicenseNumber)
				.get();
			if (
				existingDoc.exists &&
				existingDoc.LocationAddress === LocationAddress
			) {
				console.log("document exists");
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
			await admin
				.firestore()
				.collection("API_AFH_DATA")
				.doc(LicenseNumber)
				.set(afhData);

			// Optionally, link the data to the user account based on the license number
			// Here, you would need to implement a way to associate the user with the data
			// For example, if the user document contains a field called 'providers', you can add the LicenseNumber to it
			// await db.collection('users').doc(userId).collection('providers').doc(LicenseNumber).set(afhData);
		}

		console.log("Data stored successfully");
	} catch (error) {
		console.error("Error fetching or storing data:", error);
	}
};

app.post("/getCoordinates", async (req, res) => {
	const { address } = req.body;
	console.log(address);

	let position;
	try {
		position = await geocodeAddress(address);
	} catch {
		console.error("error geocoding address", address);
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

app.post("/create-reservation", async (req, res) => {
	try {
		// Create a PaymentIntent on Stripe with the capture_method set to manual
		const paymentIntent = await stripe.paymentIntents.create({
			amount: 1500, // Replace with the actual deposit amount
			currency: "usd", // Replace with the desired currency
			capture_method: "manual",
		});

		// Return the client secret
		res.status(200).json({ clientSecret: paymentIntent.client_secret });
	} catch (error) {
		console.error("Error creating PaymentIntent:", error);
		res.status(500).json({ error: error.message });
	}
});

app.post("/create-setup-intent", async (req, res) => {
	console.log("create-setup-intent endpoint hit");
	const { paymentMethodId, userId } = req.body;
	console.log("Payment Method ID:", paymentMethodId);

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
		res.status(500).send({ error: error.message });
	}
});

app.post("/confirm-setup-intent", async (req, res) => {
	const { setupIntentId, userId } = req.body;
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
		res.status(400).json({ error: "No customer ID found for user" });
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
	res.status(200).json({ message: "Setup Intent confirmed successfully" });
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
			res.status(400).json({ error: "Customer not found" });
		}
		res.status(200).json({
			cards: cards.data,
			defaultPaymentMethod: customer.invoice_settings.default_payment_method,
		});
	} else {
		res.status(400).json({ error: "Customer not found" });
	}
});

app.post("/charge-customer", async (req, res) => {
	const { amount, currency, userId } = req.body;

	try {
		const userDoc = await db.collection("users").doc(userId).get();
		const user = userDoc.data();
		const customerId = user.stripeCustomerId;

		if (!customerId) {
			throw new Error("Customer ID not found for user");
		}

		const customer = await stripe.customers.retrieve(customerId);
		const defaultPaymentMethod = customer.invoice_settings.default_payment_method;

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
		res.status(500).send({ error: error.message });
	}
});

app.post("/capture-payment", async (req, res) => {
	try {
		const { paymentIntentId } = req.body;

		// Capture the payment
		const paymentIntent = await stripe.paymentIntents.capture(paymentIntentId);

		console.log("Payment captured:", paymentIntent);
		res.status(200).json({ message: "Payment captured successfully" });
	} catch (error) {
		console.error("Error capturing payment:", error);
		res.status(500).json({ error: error.message });
	}
});

app.post("/cancel-payment", async (req, res) => {
	try {
		const { paymentIntentId } = req.body;

		// Cancel the payment
		const paymentIntent = await stripe.paymentIntents.cancel(paymentIntentId);

		console.log("Payment canceled:", paymentIntent);
		res.status(200).json({ message: "Payment canceled successfully" });
	} catch (error) {
		console.error("Error canceling payment:", error);
		res.status(500).json({ error: error.message });
	}
});

async function findSpokaneHouse() {
	const address = "8211 N Standard St"; // Specify the address you want to search for
	console.log("hi");

	// Query the collection for the document with the specified address
	const snapshot = await admin
		.firestore()
		.collection("API_AFH_DATA")
		.where("LocationAddress", "==", address)
		.get();

	// Check if any documents were found
	if (snapshot.empty) {
		console.log("No house found with the specified address.");
		return;
	}

	// Log the data of the found house
	snapshot.forEach((doc) => {
		console.log("House data:", doc.data());
	});
}

// Call the function to fetch data and store it in Firestore
// fetchDataAndStoreInFirestore();

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
