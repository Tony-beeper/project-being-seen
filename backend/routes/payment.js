import express from "express";
import donationsRoute from "./donation.js";
import purchasesRoute from "./purchase.js";

const router = express.Router();

router.use("/donation", donationsRoute);
router.use("/purchase", purchasesRoute);

export default router;
