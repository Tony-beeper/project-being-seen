import mongoose from "mongoose";

const PendingDonationSchema = new mongoose.Schema({
  order_id: {
    type: String,
    required: true,
  },
  donor: {
    type: String,
    required: true,
  },
  youth: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});

export default mongoose.model("pending_donations", PendingDonationSchema);
