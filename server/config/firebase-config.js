var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://carefinder-4c036-default-rtdb.firebaseio.com",
});

module.exports = admin;