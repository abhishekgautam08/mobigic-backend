const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

/**
 *
 * @param {Record<string, any>} payload payload to store in the token
 * @param {string | number | undefined} expiry
 * @returns {string} jwt signed token
 */
const generateJwtToken = (payload, expiry = undefined) =>
  jwt.sign(payload, JWT_SECRET, {
    ...(expiry && { expiresIn: expiry }),
  });

/**
 *
 * @param {string} token jwt token to verify
 * @returns
 */
const verifyJwtToken = (token) => jwt.verify(token, JWT_SECRET);

module.exports = {
  generateJwtToken,
  verifyJwtToken,
};
