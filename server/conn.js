import mongoose from "mongoose";

async function Connect() {
  mongoose.set("strictQuery", true);
  await mongoose.connect("mongodb://localhost:27017/OTP");
  console.log("database connected");
}

export default Connect;
