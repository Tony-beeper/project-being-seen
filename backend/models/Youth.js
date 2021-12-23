import mongoose from "mongoose";

const YouthSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  date_of_birth: {
    type: String,
    required: true,
  },
  profile_picture: {
    type: String,
    required: true,
  },
  story: {
    type: String,
    default: "This user has not published their story",
  },
  saving_plan: {
    type: String,
    default: "This user has not published their saving plan",
  },
  credit_balance: {
    type: Number,
    default: 0,
  },
});

export default mongoose.model("youths", YouthSchema);
