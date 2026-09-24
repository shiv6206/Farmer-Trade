import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectMongo = async () => {
  const mongoUri = process.env.MONGO_URI?.trim();

  if (!mongoUri) {
    console.log("MongoDB disabled: MONGO_URI is not configured");
    return;
  }

  if (!mongoUri.startsWith("mongodb://") && !mongoUri.startsWith("mongodb+srv://")) {
    throw new Error("MONGO_URI must start with mongodb:// or mongodb+srv://");
  }

  const conn = await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 10000,
  });
  console.log(`MongoDB Connected: ${conn.connection.host}`);
};

export default connectMongo;