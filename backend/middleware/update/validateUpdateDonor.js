import { StatusCodes } from "http-status-codes";

import { createTextMessage } from "../../utils/defaultMessages.js";

// Middleware to validate required parameters for the donor update
// endpoint (name) are present and valid
const validateUpdateDonor = async (req, res, next) => {
  // Fields to validate
  const name = req.body.name;

  // Validate name
  if (!name) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send(createTextMessage("Name field cannot be empty"));
  }

  next();
};

export default validateUpdateDonor;
