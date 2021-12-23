import mongoose from "mongoose";

const DonationSchema = new mongoose.Schema({
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
  date: {
    type: String,
    required: true,
  },
});

export default mongoose.model("donations", DonationSchema);
