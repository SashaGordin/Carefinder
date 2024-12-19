const admin = require('../config/firebase-config');

// eslint-disable-next-line require-jsdoc
class Middleware {
  /**
   * Decode the token from the request headers and attach it to the request
   * object.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @param {Function} next - The next middleware function.
   * @return {Promise<void>}
   */
  async decodeToken(req, res, next) {
    const authHeader = req.headers.authorization;

    // Check if the Authorization header exists
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // eslint-disable-next-line max-len
      return res
        .status(401)
        .json({ message: 'Unauthorized: Missing or invalid token' });
    }

    const token = authHeader.split(' ')[1]; // Extract the token

    try {
      // Verify the token with Firebase Admin SDK
      const decodeValue = await admin.auth().verifyIdToken(token);

      if (decodeValue) {
        // eslint-disable-next-line max-len
        req.user = decodeValue; // Attach the decoded token to the request object
        return next();
      }

      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    } catch (error) {
      console.error('Token verification error:', error.message);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}

module.exports = new Middleware();
