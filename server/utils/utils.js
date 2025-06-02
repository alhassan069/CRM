const {createHash, randomBytes, scryptSync } =  require('crypto');

// Pass the password string and get hashed password back
// ( and store only the hashed string in your database)
const encryptPassword = (password, salt) => {
  return scryptSync(password, salt, 32).toString('hex');
};

/**
 * Hash password with random salt
 * @return {string} password hash followed by salt
 *  XXXX till 64 XXXX till 32
 *
 */
const hashPassword = (password) => {
  // Any random string here (ideally should be at least 16 bytes)
  const salt = randomBytes(16).toString('hex');
  return encryptPassword(password, salt) + salt;
};

// fetch the user from your db and then use this function

/**
 * Match password against the stored hash
 */
const matchPassword = (password, hash) => {
  // extract salt from the hashed string
  // our hex password length is 32*2 = 64
  const salt = hash.slice(64);
  const originalPassHash = hash.slice(0, 64);
  const currentPassHash = encryptPassword(password, salt);
  return originalPassHash === currentPassHash;
};

/**
 * Hash token
 * @param {string} token
 * @return {string} hashed token
 */
const hashToken = (token) => {
  return createHash('sha256').update(token).digest('hex');
}


module.exports = {hashPassword, matchPassword, hashToken}