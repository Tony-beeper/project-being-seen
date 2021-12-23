import { StatusCodes } from "http-status-codes";

import { createTextMessage } from "../../utils/defaultMessages.js";

// Middleware to validate required parameters for the update merchant
// endpoint (name, store_name, location, email) are present and valid
const validateUpdateMerchant = async (req, res, next) => {
  // Fields to validate
  const name = req.body.name;
  const storeName = req.body.store_name;
  const storeLocation = req.body.store_location;
  const payPalEmail = req.body.email;

  // Validate name
  if (!name) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send(createTextMessage("Name field cannot be empty"));
  }

  // Validate store name
  if (!storeName) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send(createTextMessage("Store Name field cannot be empty"));
  }

  // Validate store location
  if (!storeLocation) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send(createTextMessage("Location field cannot be empty"));
  }

  // Validate PayPal email
  if (!payPalEmail) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send(createTextMessage("Email field cannot be empty"));
  }

  next();
};

export default validateUpdateMerchant;
