import mongoose from "mongoose";

const MerchantSchema = new mongoose.Schema({
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
  store_name: {
    type: String,
    required: true,
  },
  store_location: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
});

export default mongoose.model("merchants", MerchantSchema);
