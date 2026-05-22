import mongoose from "mongoose";

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.log("MONGO_URI is not configured. Persistent authentication is disabled.");
    return false;
  }

  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 2500 });
    console.log("MongoDB connected");
    return true;
  } catch (error) {
    console.warn(`MongoDB unavailable. Persistent authentication is disabled: ${error.message}`);
    return false;
  }
};

export default connectDB;
