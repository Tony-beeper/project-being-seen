import { StatusCodes } from "http-status-codes";
import { createTextMessage } from "../../utils/defaultMessages.js";
import { decodeUserToken } from "../../utils/jwtHelpers.js";
import User from "../../models/User.js";

// Returns middleware to validate whether an authorization header was passed and
// matches the role passed (user existence is also checked)
const verifyAuthHeader = (role) => async (req, res, next) => {
  if (!req.headers.authorization) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .send(createTextMessage("No authorization header found"));
  }

  const decodedUser = decodeUserToken(req.headers.authorization);
  if (!decodedUser || decodedUser.role !== role) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .send(createTextMessage("JWT passed is not valid"));
  }

  if (!(await User.exists({ username: decodedUser.username, role: role }))) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .send(createTextMessage("User does not exist with that role"));
  }

  next();
};

export default verifyAuthHeader;
