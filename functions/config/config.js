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
    // eslint-disable-next-line max-len
    const stripeKey = await stripeTestSecretKey.value(); // Access secret at runtime
    return require('stripe')(stripeKey);
  },

  async initTwilio() {
    const sid = await twilioAccountSid.value(); // Access secret at runtime
    const token = await twilioAuthToken.value(); // Access secret at runtime
    return require('twilio')(sid, token);
  },
};

module.exports = config;
