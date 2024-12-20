const { defineSecret } = require('firebase-functions/params');
const admin = require('firebase-admin');

const stripeTestSecretKey = defineSecret('STRIPE_TEST_SECRET_KEY');
const twilioAccountSid = defineSecret('TWILIO_ACCOUNT_SID');
const twilioAuthToken = defineSecret('TWILIO_AUTH_TOKEN');

const config = {
  initFirebase() {
    if (!admin.apps.length) {
      admin.initializeApp();
    }
    return admin.firestore();
  },

  async initStripe() {
    // Access the secret only at runtime
    const stripeKey = await stripeTestSecretKey.value();
    return require('stripe')(stripeKey);
  },

  async initTwilio() {
    // Access the secrets only at runtime
    const sid = await twilioAccountSid.value();
    const token = await twilioAuthToken.value();
    return require('twilio')(sid, token);
  },
};

module.exports = config;
