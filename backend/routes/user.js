import express from "express";
import { StatusCodes } from "http-status-codes";

import { createJwtMessage } from "../utils/defaultMessages.js";
import { createTextMessage } from "../utils/defaultMessages.js";
import { createUserToken, decodeUserToken } from "../utils/jwtHelpers.js";

import validateLogin from "../middleware/login/validateLogin.js";
import hasAuthHeader from "../middleware/security/hasAuthHeader.js";

import donorRoute from "./donor.js";
import merchantRoute from "./merchant.js";
import youthRoute from "./youth.js";

import User from "../models/User.js";

const router = express.Router();

// api/v1/user/validate
router.use("/validate", hasAuthHeader);
router.get("/validate", (req, res) => {
  if (decodeUserToken(req.headers.authorization)) {
    return res.send(createTextMessage("JWT passed is valid"));
  } else {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .send(createTextMessage("JWT passed is not valid"));
  }
});

// api/v1/user/login
router.use("/login", validateLogin);
router.post("/login", async (req, res) => {
  // Required fields
  const username = req.body.username;
  const password = req.body.password;

  // Optional fields
  const remember = req.body.remember;

  const retrievedUser = await User.findOne({ username: username });
  if (!retrievedUser || !(await retrievedUser.comparePassword(password))) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .send(createTextMessage("Username or password is incorrect"));
  } else {
    return res.send(
      createJwtMessage(
        createUserToken(username, retrievedUser.role, Boolean(remember))
      )
    );
  }
});

router.use("/donor", donorRoute);
router.use("/merchant", merchantRoute);
router.use("/youth", youthRoute);

export default router;
