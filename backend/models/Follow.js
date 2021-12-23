import mongoose from "mongoose";

const FollowSchema = new mongoose.Schema({
  donor: {
    type: String,
    required: true,
  },
  youth: {
    type: String,
    required: true,
  },
});

export default mongoose.model("follows", FollowSchema);
