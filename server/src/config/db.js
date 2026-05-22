import mongoose from "mongoose";

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.log("MONGO_URI is not configured. Using in-memory demo store.");
    return false;
  }

  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 2500 });
    console.log("MongoDB connected");
    return true;
  } catch (error) {
    console.warn(`MongoDB unavailable, using in-memory demo store: ${error.message}`);
    return false;
  }
};

export default connectDB;
