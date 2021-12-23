import { StatusCodes } from "http-status-codes";
import { createTextMessage } from "../../utils/defaultMessages.js";
import userRoles from "../../utils/userRoles.js";
import User from "../../models/User.js";

// Middleware to validate required parameters for the create donation endpoint
// (amount, youth, donor) are present and valid
const validateCreateDonation = async (req, res, next) => {
  const validAmounts = [5, 10, 25, 100];

  // Fields to validate
  const youthUsername = req.body.youth;
  const donorUsername = req.body.donor;
  const donationAmount = +req.body.amount;

  // Validate donation amount
  if (!donationAmount) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send(createTextMessage("Donation amount is empty"));
  } else if (!validAmounts.includes(donationAmount)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send(createTextMessage("Donation amount is invalid"));
  }

  // Validate youth username
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

  // Validate donor username
  if (!donorUsername) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send(createTextMessage("Donor username is empty"));
  } else if (
    !(await User.exists({ username: donorUsername, role: userRoles.donor }))
  ) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .send(createTextMessage("Donor account does not exist"));
  }

  next();
};

export default validateCreateDonation;
