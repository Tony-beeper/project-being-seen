import { StatusCodes } from "http-status-codes";
import { createTextMessage } from "../../utils/defaultMessages.js";
import { decodeUserToken } from "../../utils/jwtHelpers.js";
import Product from "../../models/Product.js";
import productCategories from "../../utils/productCategories.js";

// Middleware to validate required parameters for the product update endpoint
// (old_name, new_name, description, price, category) are present and valid
// (note: token must be validated before calling this)
const validateProductUpdate = async (req, res, next) => {
  const decodedMerchant = decodeUserToken(req.headers.authorization);

  // Fields to validate
  const oldProductName = req.body.old_name;
  const newProductName = req.body.new_name;
  const productDescription = req.body.description;
  const productPriceString = req.body.price;
  const productPrice = +productPriceString;
  const productCategory = req.body.category;

  // Validate product name
  if (!oldProductName || !newProductName) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send(createTextMessage("Product name field is empty"));
  } else if (
    !(await Product.exists({
      name: oldProductName,
      merchant: decodedMerchant.username,
    }))
  ) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .send(createTextMessage("Product does not exist"));
  } else if (
    oldProductName !== newProductName &&
    (await Product.exists({ name: newProductName }))
  ) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send(
        createTextMessage("Another product with the same name already exists")
      );
  }

  // Validate product description
  if (!productDescription) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send(createTextMessage("Description field is empty"));
  }

  // Validate product price
  if (!productPriceString) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send(createTextMessage("Price field is empty"));
  } else if (isNaN(productPrice)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send(createTextMessage("Price field must be a number"));
  } else if (productPrice < 0) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send(createTextMessage("Price field cannot be negative"));
  }

  // Validate product category
  if (!productCategory) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send(createTextMessage("Category field is empty"));
  } else if (!productCategories.includes(productCategory)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send(createTextMessage("Category field is not acceptable"));
  }

  next();
};

export default validateProductUpdate;
