import { StatusCodes } from "http-status-codes";
import { createTextMessage } from "../../utils/defaultMessages.js";
import Product from "../../models/Product.js";

// Middleware to validate required parameters for the purchase endpoint
// (product) are present and valid
const validatePurchase = async (req, res, next) => {
  // Fields to validate
  const productName = req.body.name;

  // Validate product name
  if (!productName) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send(createTextMessage("Product name is empty"));
  } else if (!(await Product.exists({ name: productName }))) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .send(createTextMessage("Product does not exist"));
  }

  next();
};

export default validatePurchase;
