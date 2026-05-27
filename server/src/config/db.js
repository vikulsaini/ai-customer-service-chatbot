const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.info("MONGO_URI is not configured. Using indexed in-memory fallback.");
    return false;
  }

  try {
    const { default: mongoose } = await import("mongoose");
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
