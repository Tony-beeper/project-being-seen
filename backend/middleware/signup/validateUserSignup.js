import moment from "moment";
import { StatusCodes } from "http-status-codes";
import { createTextMessage } from "../../utils/defaultMessages.js";
import User from "../../models/User.js";

// Middleware to validate required parameters associated with all user signup
// endpoints (name, username, password, date_of_birth) are present and valid
const validateUser = async (req, res, next) => {
  // Fields to validate
  const name = req.body.name;
  const username = req.body.username;
  const password = req.body.password;
  const dateOfBirth = req.body.date_of_birth;

  // Validate name
  if (!name) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send(createTextMessage("Name field is empty"));
  }

  // Validate username
  if (!username) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send(createTextMessage("Username field is empty"));
  } else if (/\s/.test(username)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send(createTextMessage("Username cannot contain whitespace"));
  } else if (await User.exists({ username: username })) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send(createTextMessage("Username is already taken"));
  }

  // Validate password
  if (!password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send(createTextMessage("Password field is empty"));
  }

  // Validate date of birth
  if (!dateOfBirth || !moment(dateOfBirth, moment.ISO_8601, true).isValid()) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send(createTextMessage("Date of birth is invalid"));
  } else if (moment(dateOfBirth).isAfter(moment())) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send(createTextMessage("Date of birth cannot be in the future"));
  }

  next();
};

export default validateUser;
