import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import userRoles from "./userRoles.js";

dotenv.config();

// Remove the "Bearer " prefix from a given string (authorization headers that
// follow the bearer scheme will have this prefix). If not, return string as is.
const stripAuthBearer = (authorizationHeader) =>
  authorizationHeader.replace(/^Bearer\s/, "");

// Create a signed JWT token that encapsulates the a username to later identify
// the user and a role to determine authorization. An expiration time is also
// included to prevent lifelong tokens.
const createUserToken = (username, role, remember) =>
  jwt.sign(
    {
      role: role,
      username: username,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: remember ? "30d" : "7d",
    }
  );

// Decode a given token (or authorization header value following bearer scheme)
// and determine validity according to our JWT secret (from environment file).
// Return the decoded token (if decoded and valid) or null otherwise.
const decodeUserToken = (token) => {
  token = stripAuthBearer(token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (
      decoded.role &&
      decoded.username &&
      Object.values(userRoles).includes(decoded.role)
    ) {
      return decoded;
    }
    console.log("Decoded token is not valid: " + JSON.stringify(decoded));
  } catch (err) {
    console.log(`Token is not valid (${err.message})`);
  }

  return null;
};

export { createUserToken, decodeUserToken };
