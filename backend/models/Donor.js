import mongoose from "mongoose";

const DonorSchema = new mongoose.Schema({
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
  display_name: {
    type: String,
    required: true,
  },
  anonymize: {
    type: Boolean,
    required: true,
  },
  profile_picture: {
    type: String,
    required: true,
  },
  organization: {
    type: String,
    required: true,
  },
});

export default mongoose.model("donors", DonorSchema);
