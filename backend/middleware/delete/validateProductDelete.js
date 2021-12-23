import { StatusCodes } from "http-status-codes";
import { createTextMessage } from "../../utils/defaultMessages.js";
import { decodeUserToken } from "../../utils/jwtHelpers.js";
import Product from "../../models/Product.js";

// Middleware to validate required parameters for the product delete endpoint
// (product) are present (note: token should be validated before calling this)
const validateProductDelete = async (req, res, next) => {
  const decodedMerchant = decodeUserToken(req.headers.authorization);

  // Fields to validate
  const productName = req.body.name;

  // Validate product name
  if (!productName) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send(createTextMessage("Product name field is empty"));
  } else if (
    !(await Product.exists({
      name: productName,
      merchant: decodedMerchant.username,
    }))
  ) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .send(createTextMessage("Product does not exist"));
  }

  next();
};

export default validateProductDelete;
