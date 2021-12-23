import bcrypt from "bcrypt";
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
});

// Hash and salt passwords (for security) on user objects before inserting it
// into the Mongo database. Process is achieved using bcrypt password hashing.
UserSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

// Compare given plaintext password with a user object's hashed password
UserSchema.methods.comparePassword = async function (plaintextPassword) {
  return bcrypt.compare(plaintextPassword, this.password);
};

export default mongoose.model("users", UserSchema);
