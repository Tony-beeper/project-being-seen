import { StatusCodes } from "http-status-codes";
import { createTextMessage } from "../../utils/defaultMessages.js";

// Middleware to validate required parameters unique to the merchant signup
// endpoint (store_name, store_location, email) are present and valid
const validateMerchantSignup = (req, res, next) => {
  // Fields to validate
  const storeName = req.body.store_name;
  const storeLocation = req.body.store_location;
  const payPalEmail = req.body.email;

  // Validate store name
  if (!storeName) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send(createTextMessage("Store name field is empty"));
  }

  // Validate store location
  if (!storeLocation) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send(createTextMessage("Store location field is empty"));
  }

  // Validate PayPal email
  if (!payPalEmail) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send(createTextMessage("Email field is empty"));
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payPalEmail)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send(createTextMessage("Invalid email address provided"));
  }

  next();
};

export default validateMerchantSignup;
