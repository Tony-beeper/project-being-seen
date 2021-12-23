// Define structure of a generic message back to the caller (used to indicate
// validation errors, authorization errors, server errors, etc.)
export const createTextMessage = (message) => ({
  message: message,
});

// Define structure of a JWT token back to the caller (used to pass back JWT
// tokens to the caller)
export const createJwtMessage = (token) => ({
  jwt: token,
});
