import express from "express";
import { StatusCodes } from "http-status-codes";

import validateYouthSignup from "../middleware/signup/validateYouthSignup.js";
import validateUserSignup from "../middleware/signup/validateUserSignup.js";
import validateUpdateYouth from "../middleware/update/validateUpdateYouth.js";
import verifyAuthHeader from "../middleware/security/verifyAuthHeader.js";

import { decodeUserToken, createUserToken } from "../utils/jwtHelpers.js";
import { parseRetrievedYouth } from "../utils/parseModelObjects.js";
import { createTextMessage } from "../utils/defaultMessages.js";
import { createJwtMessage } from "../utils/defaultMessages.js";
import userRoles from "../utils/userRoles.js";

import Youth from "../models/Youth.js";
import User from "../models/User.js";
import Order from "../models/Order.js";

const router = express.Router();

// api/v1/user/youth/signup
router.use("/signup", [validateUserSignup, validateYouthSignup]);
router.post("/signup", async (req, res) => {
  // Required fields
  const name = req.body.name;
  const username = req.body.username;
  const password = req.body.password;
  const dateOfBirth = req.body.date_of_birth;

  // Optional fields
  const profilePicture = req.body.profile_picture;

  const newUser = new User({
    role: userRoles.youth,
    username: username,
    password: password,
  });

  const newYouth = new Youth({
    name: name,
    username: username,
    date_of_birth: dateOfBirth,
    profile_picture: profilePicture || "#",
  });

  try {
    await newUser.save();
    await newYouth.save();
    const jwtToken = createUserToken(username, userRoles.youth);
    return res.status(StatusCodes.CREATED).send(createJwtMessage(jwtToken));
  } catch (err) {
    console.log(err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(createTextMessage("Error saving youth to database"));
  }
});

// api/v1/user/youth
router.get("/", async (req, res) => {
  // Optional fields
  const youthUsername = req.query.username;

  // Request wants a specific youth
  if (youthUsername) {
    if (
      !(await User.exists({
        username: youthUsername,
        role: userRoles.youth,
      }))
    ) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .send(createTextMessage("Cannot find given youth"));
    }

    try {
      const retrievedYouth = await Youth.findOne({ username: youthUsername });
      const parsedYouth = await parseRetrievedYouth(retrievedYouth, true);
      return res.send(parsedYouth);
    } catch (err) {
      console.log(err);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send(createTextMessage("Error retrieving youth from database"));
    }
  }

  // Request wants all youths
  try {
    const retrievedYouths = await Youth.find({});
    const parsedYouths = await Promise.all(
      retrievedYouths.map(async (youth) => {
        return await parseRetrievedYouth(youth, true);
      })
    );

    return res.send(parsedYouths);
  } catch (err) {
    console.log(err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(createTextMessage("Error retrieving youths from database"));
  }
});

// api/v1/user/youth/private
router.use("/private", verifyAuthHeader(userRoles.youth));
router.post("/private", async (req, res) => {
  const decodedYouth = decodeUserToken(req.headers.authorization);

  try {
    const retrievedYouth = await Youth.findOne({
      username: decodedYouth.username,
    });
    const parsedYouth = await parseRetrievedYouth(retrievedYouth);

    return res.send(parsedYouth);
  } catch (err) {
    console.log(err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(createTextMessage("Error retrieving youth from database"));
  }
});

// api/v1/user/youth/update
router.use("/update", [verifyAuthHeader(userRoles.youth), validateUpdateYouth]);
router.patch("/update", async (req, res) => {
  const decodedYouth = decodeUserToken(req.headers.authorization);

  // Required fields
  const name = req.body.name;
  const profilePicture = req.body.profile_picture;

  // Optional fields
  const savingPlan = req.body.saving_plan;
  const story = req.body.story;

  try {
    // Find a youth and update them
    await Youth.updateOne(
      { username: decodedYouth.username },
      {
        name: name,
        profile_picture: profilePicture || "#",
        saving_plan: savingPlan || "No saving plan",
        story: story || "No story",
      }
    );
    return res.send(createTextMessage("Successfully updated your profile"));
  } catch (err) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(createTextMessage("Error updating your profile"));
  }
});

export default router;
