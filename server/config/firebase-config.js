var admin = require('firebase-admin');
const { GeoFirestore } = require('geofirestore');

var serviceAccount = require('./serviceAccount.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // storageBucket: 'gs://carefinder-development.appspot.com'
  databaseURL: 'https://carefinder-4c036-default-rtdb.firebaseio.com/',
});

const geofirestore = new GeoFirestore(admin.firestore());
const geocollection = geofirestore.collection('users');

module.exports = { admin, geofirestore, geocollection };
