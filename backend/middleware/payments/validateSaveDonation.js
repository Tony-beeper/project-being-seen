import { StatusCodes } from "http-status-codes";
import { createTextMessage } from "../../utils/defaultMessages.js";
import PendingDonation from "../../models/PendingDonation.js";
import Donation from "../../models/Donation.js";

// Middleware to validate required parameters for the save donation endpoint
// (order_id) are present and valid
const validateSaveDonation = async (req, res, next) => {
  // Fields to validate
  const orderId = req.body.order_id;

  // Validate order ID
  if (!orderId) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send(createTextMessage("Order ID is empty"));
  } else if (!(await PendingDonation.exists({ order_id: orderId }))) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .send(createTextMessage("Order ID cannot be found"));
  } else if (await Donation.exists({ order_id: orderId })) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send(createTextMessage("Donation has been processed already"));
  }

  next();
};

export default validateSaveDonation;
