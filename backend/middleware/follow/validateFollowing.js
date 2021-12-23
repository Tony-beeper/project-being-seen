import { StatusCodes } from "http-status-codes";
import { createTextMessage } from "../../utils/defaultMessages.js";
import userRoles from "../../utils/userRoles.js";
import User from "../../models/User.js";

// Middleware to validate required parameters for the donor following endpoint
// (youth) are present and valid
const validateProductDelete = async (req, res, next) => {
  // Fields to validate
  const youthUsername = req.body.youth;

  // Validate youth
  if (!youthUsername) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send(createTextMessage("Youth username is empty"));
  } else if (
    !(await User.exists({ username: youthUsername, role: userRoles.youth }))
  ) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .send(createTextMessage("Youth account does not exist"));
  }

  next();
};

export default validateProductDelete;
