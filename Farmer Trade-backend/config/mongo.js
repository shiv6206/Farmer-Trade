import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectMongo = async () => {
  if (!process.env.MONGO_URI) {
    console.log("MongoDB disabled: MONGO_URI is not configured");
    return;
  }

  const conn = await mongoose.connect(process.env.MONGO_URI);
  console.log(`MongoDB Connected: ${conn.connection.host}`);
};

export default connectMongo;