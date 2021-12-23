import express from "express";
import { StatusCodes } from "http-status-codes";

import verifyAuthHeader from "../middleware/security/verifyAuthHeader.js";
import validateUserSignup from "../middleware/signup/validateUserSignup.js";
import validateMerchantSignup from "../middleware/signup/validateMerchantSignup.js";
import validateProductUpload from "../middleware/upload/validateProductUpload.js";
import validateProductDelete from "../middleware/delete/validateProductDelete.js";
import validateUpdateMerchant from "../middleware/update/validateUpdateMerchant.js";
import validateProductUpdate from "../middleware/update/validateProductUpdate.js";

import { createUserToken, decodeUserToken } from "../utils/jwtHelpers.js";
import { parseRetrievedMerchant } from "../utils/parseModelObjects.js";
import { parseRetrievedProduct } from "../utils/parseModelObjects.js";
import { createTextMessage } from "../utils/defaultMessages.js";
import { createJwtMessage } from "../utils/defaultMessages.js";
import userRoles from "../utils/userRoles.js";

import Merchant from "../models/Merchant.js";
import User from "../models/User.js";
import Product from "../models/Product.js";

const router = express.Router();

// api/v1/user/merchant/signup
router.use("/signup", [validateUserSignup, validateMerchantSignup]);
router.post("/signup", async (req, res) => {
  // Required fields
  const name = req.body.name;
  const username = req.body.username;
  const password = req.body.password;
  const dateOfBirth = req.body.date_of_birth;
  const storeLocation = req.body.store_location;
  const storeName = req.body.store_name;
  const payPalEmail = req.body.email;

  // Optional fields
  const profilePicture = req.body.profile_picture;

  const newUser = new User({
    role: userRoles.merchant,
    username: username,
    password: password,
  });

  const newMerchant = new Merchant({
    name: name,
    username: username,
    date_of_birth: dateOfBirth,
    profile_picture: profilePicture || "#",
    store_location: storeLocation,
    store_name: storeName,
    email: payPalEmail,
  });

  try {
    await newUser.save();
    await newMerchant.save();
    const jwtToken = createUserToken(username, userRoles.merchant);
    return res.status(StatusCodes.CREATED).send(createJwtMessage(jwtToken));
  } catch (err) {
    console.log(err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(createTextMessage("Error saving merchant to database"));
  }
});

// api/v1/user/merchant/products/upload
router.use("/products/upload", [
  verifyAuthHeader(userRoles.merchant),
  validateProductUpload,
]);
router.post("/products/upload", async (req, res) => {
  const decodedMerchant = decodeUserToken(req.headers.authorization);

  // Required fields
  const productName = req.body.name;
  const productDescription = req.body.description;
  const productPrice = +req.body.price;
  const productCategory = req.body.category;

  // Optional fields
  const productPicture = req.body.picture;

  const newProduct = new Product({
    name: productName,
    description: productDescription,
    picture: productPicture || "#",
    merchant: decodedMerchant.username,
    price: productPrice.toFixed(2),
    category: productCategory,
  });

  try {
    await newProduct.save();
    return res
      .status(StatusCodes.CREATED)
      .send(createTextMessage("Product successfully uploaded"));
  } catch (err) {
    console.log(err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(createTextMessage("Error saving product to database"));
  }
});

// api/v1/user/merchant/products
router.get("/products", async (req, res) => {
  // Optional fields
  const productName = req.query.name;
  const merchantUsername = req.query.merchant;

  // Request wants a specific product
  if (productName) {
    try {
      const retrievedProduct = await Product.findOne({ name: productName });
      const parsedProduct = parseRetrievedProduct(retrievedProduct);
      return res.send(parsedProduct);
    } catch (err) {
      console.log(err);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send(createTextMessage("Error retrieving product from database"));
    }
  }

  // Request wants products from a specific merchant
  if (merchantUsername) {
    try {
      const retrievedProducts = await Product.find({
        merchant: merchantUsername,
      });
      const parsedProducts = retrievedProducts.map((product) =>
        parseRetrievedProduct(product)
      );

      return res.send(parsedProducts);
    } catch (err) {
      console.log(err);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send(createTextMessage("Error retrieving products from database"));
    }
  }

  // Request wants all products
  try {
    const retrievedProducts = await Product.find({});
    const parsedProducts = retrievedProducts.map((product) =>
      parseRetrievedProduct(product)
    );
    return res.send(parsedProducts);
  } catch (err) {
    console.log(err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(createTextMessage("Error retrieving products from database"));
  }
});

// api/v1/user/merchant/products/delete
router.use("/products/delete", [
  verifyAuthHeader(userRoles.merchant),
  validateProductDelete,
]);
router.post("/products/delete", async (req, res) => {
  // Required fields
  const productName = req.body.name;

  try {
    await Product.deleteOne({ name: productName });
    return res
      .status(StatusCodes.OK)
      .send(createTextMessage("Product successfully deleted"));
  } catch (err) {
    console.log(err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(createTextMessage("Error deleting product from database"));
  }
});

// api/v1/user/merchant/update
router.use("/update", [
  verifyAuthHeader(userRoles.merchant),
  validateUpdateMerchant,
]);
router.patch("/update", async (req, res) => {
  const decodedMerchant = decodeUserToken(req.headers.authorization);

  // Required fields
  const name = req.body.name;
  const storeLocation = req.body.store_location;
  const storeName = req.body.store_name;
  const payPalEmail = req.body.email;

  // Optional fields
  const profilePicture = req.body.profile_picture;

  try {
    await Merchant.updateOne(
      { username: decodedMerchant.username },
      {
        name: name,
        profile_picture: profilePicture || "#",
        store_location: storeLocation,
        store_name: storeName,
        email: payPalEmail,
      }
    );
    return res.send(createTextMessage("Successfully updated your profile"));
  } catch (err) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(createTextMessage("Error updating your profile"));
  }
});

// api/v1/user/merchant/private
router.use("/private", verifyAuthHeader(userRoles.merchant));
router.post("/private", async (req, res) => {
  const decodedMerchant = decodeUserToken(req.headers.authorization);

  try {
    const retrievedMerchant = await Merchant.findOne({
      username: decodedMerchant.username,
    });
    const parsedMerchant = await parseRetrievedMerchant(retrievedMerchant);
    return res.send(parsedMerchant);
  } catch (err) {
    console.log(err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(createTextMessage("Error retrieving merchant from database"));
  }
});

// api/v1/user/merchant/products/update
router.use("/products/update", [
  verifyAuthHeader(userRoles.merchant),
  validateProductUpdate,
]);
router.patch("/products/update", async (req, res) => {
  // Required fields
  const productName = req.body.old_name;
  const newProductName = req.body.new_name;
  const productDescription = req.body.description;
  const productPrice = +req.body.price;
  const productCategory = req.body.category;

  // Optional fields
  const productPicture = req.body.picture;

  try {
    await Product.updateOne(
      { name: productName },
      {
        name: newProductName,
        description: productDescription,
        picture: productPicture || "#",
        price: productPrice.toFixed(2),
        category: productCategory,
      }
    );
    return res.send(createTextMessage("Successfully updated product"));
  } catch (err) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(createTextMessage("Error updating product info"));
  }
});

export default router;
