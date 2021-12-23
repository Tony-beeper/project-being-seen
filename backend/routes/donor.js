import express from "express";
import { StatusCodes } from "http-status-codes";

import validateDonorSignup from "../middleware/signup/validateDonorSignup.js";
import validateUserSignup from "../middleware/signup/validateUserSignup.js";
import verifyAuthHeader from "../middleware/security/verifyAuthHeader.js";
import validateFollowing from "../middleware/follow/validateFollowing.js";
import validateUpdateDonor from "../middleware/update/validateUpdateDonor.js";

import { decodeUserToken, createUserToken } from "../utils/jwtHelpers.js";
import { parseRetrievedDonor } from "../utils/parseModelObjects.js";
import { createTextMessage } from "../utils/defaultMessages.js";
import { createJwtMessage } from "../utils/defaultMessages.js";
import userRoles from "../utils/userRoles.js";

import Donor from "../models/Donor.js";
import User from "../models/User.js";
import Follow from "../models/Follow.js";

const router = express.Router();

// api/v1/user/donor/signup
router.use("/signup", [validateUserSignup, validateDonorSignup]);
router.post("/signup", async (req, res) => {
  // Required fields
  const name = req.body.name;
  const username = req.body.username;
  const dateOfBirth = req.body.date_of_birth;
  const password = req.body.password;

  // Optional fields
  const organization = req.body.organization;
  const profilePicture = req.body.profile_picture;
  const anonymize = req.body.anonymize;

  const newUser = new User({
    role: userRoles.donor,
    username: username,
    password: password,
  });

  const newDonor = new Donor({
    name: name,
    username: username,
    date_of_birth: dateOfBirth,
    organization: organization || "None",
    profile_picture: profilePicture || "#",
    display_name: Boolean(anonymize) ? "Anonymous" : name,
    anonymize: Boolean(anonymize),
  });

  try {
    await newUser.save();
    await newDonor.save();
    const jwtToken = createUserToken(username, userRoles.donor);
    return res.status(StatusCodes.CREATED).send(createJwtMessage(jwtToken));
  } catch (err) {
    console.log(err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(createTextMessage("Error saving donor to database"));
  }
});

// api/v1/user/donor/private
router.use("/private", verifyAuthHeader(userRoles.donor));
router.post("/private", async (req, res) => {
  const decodedDonor = decodeUserToken(req.headers.authorization);

  try {
    const retrievedDonor = await Donor.findOne({
      username: decodedDonor.username,
    });
    const parsedDonor = await parseRetrievedDonor(retrievedDonor);

    return res.send(parsedDonor);
  } catch (err) {
    console.log(err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(createTextMessage("Error retrieving donor from database"));
  }
});

// api/v1/user/donor/update
router.use("/update", [verifyAuthHeader(userRoles.donor), validateUpdateDonor]);
router.patch("/update", async (req, res) => {
  const decodedDonor = decodeUserToken(req.headers.authorization);

  // Required fields
  const name = req.body.name;

  // Optional fields
  const organization = req.body.organization;
  const profilePicture = req.body.profile_picture;
  const anonymize = req.body.anonymize;

  try {
    await Donor.updateOne(
      { username: decodedDonor.username },
      {
        name: name,
        organization: organization || "None",
        profile_picture: profilePicture || "#",
        display_name: Boolean(anonymize) ? "Anonymous" : name,
        anonymize: Boolean(anonymize),
      }
    );
    return res.send(createTextMessage("Successfully updated your profile"));
  } catch (err) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(createTextMessage("Error updating your profile"));
  }
});

router.use("/follow", [verifyAuthHeader(userRoles.donor), validateFollowing]);

// api/v1/user/donor/follow
router.put("/follow", async (req, res) => {
  const decodedDonor = decodeUserToken(req.headers.authorization);

  // Required fields
  const youthUsername = req.body.youth;

  if (
    await Follow.exists({
      donor: decodedDonor.username,
      youth: youthUsername,
    })
  ) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send(createTextMessage(`You are already following @${youthUsername}`));
  }

  const newFollow = new Follow({
    donor: decodedDonor.username,
    youth: youthUsername,
  });

  try {
    await newFollow.save();
    return res
      .status(StatusCodes.CREATED)
      .send(createTextMessage(`Successfully followed @${youthUsername}`));
  } catch (err) {
    console.log(err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(createTextMessage("Error creating following relationship"));
  }
});

// api/v1/user/donor/follow
router.delete("/follow", async (req, res) => {
  const decodedDonor = decodeUserToken(req.headers.authorization);

  // Required fields
  const youthUsername = req.body.youth;

  if (
    !(await Follow.exists({
      donor: decodedDonor.username,
      youth: youthUsername,
    }))
  ) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send(createTextMessage(`You are not following @${youthUsername}`));
  }

  try {
    await Follow.findOneAndDelete({
      donor: decodedDonor.username,
      youth: youthUsername,
    });
    return res.send(
      createTextMessage(`Successfully unfollowed @${youthUsername}`)
    );
  } catch (err) {
    console.log(err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(createTextMessage("Error deleting following relationship"));
  }
});

export default router;
