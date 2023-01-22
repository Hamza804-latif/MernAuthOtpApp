import mongoose from "mongoose";

export const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide unique username"],
    unique: [true, "Username exist"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    unique: false,
  },
  email: {
    type: String,
    required: [true, "Please provide unique email"],
    unique: [true, "email exist"],
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  mobile: {
    type: Number,
  },
  address: {
    type: String,
  },
  profile: {
    type: String,
  },
});

export default mongoose.model.users || mongoose.model("users", UserSchema);
