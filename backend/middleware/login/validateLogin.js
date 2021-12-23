import { StatusCodes } from "http-status-codes";
import { createTextMessage } from "../../utils/defaultMessages.js";

// Middleware to validate required parameters for the login endpoint
// (username, password) are present and valid
const validateLogin = (req, res, next) => {
  // Fields to validate
  const username = req.body.username;
  const password = req.body.password;

  // Validate username
  if (!username) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send(createTextMessage("Username field is empty"));
  }

  // Validate password
  if (!password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send(createTextMessage("Password field is empty"));
  }

  next();
};

export default validateLogin;
