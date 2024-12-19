const admin = require('firebase-admin');

const serviceAccount = require('./serviceAccount.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // storageBucket: "gs://carefinder-development.appspot.com",
  databaseURL: 'https://carefinder-4c036-default-rtdb.firebaseio.com/',
});

module.exports = admin;
