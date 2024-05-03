// already generated and stored in .env.local as:
// NODE_FORGE_MASTERKEY and NODE_FORGE_MASTERIV
// these can never change, or we'd have to use the old keys to
// programmatically unencrypt and then re-encrypt with new keys.

const crypto = require('crypto');

// Generate a random master key (32 bytes for AES-256 -- will be 64 chars long)
const masterKey = crypto.randomBytes(32).toString('hex');
console.log('Master Key:', masterKey);

// Generate a random IV (16 bytes for AES -- will be 32 chars long)
const masterIV = crypto.randomBytes(16).toString('hex');
console.log('Master IV:', masterIV);
