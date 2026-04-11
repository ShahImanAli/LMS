// 2nd approach to connect to db

import dns from "node:dns";
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

// Override DNS servers to bypass ISP DNS blocks on MongoDB Atlas SRV lookups
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(
      `\n MongoDb connected successfully ! DB HOST : ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.error("MongoDb Connection Failed", error);
    process.exit(1);
  }
};

export default connectDB;

