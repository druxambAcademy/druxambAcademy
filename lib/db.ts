import mongoose, { Connection } from "mongoose";

// Declaring a global type for mongoose to persist connection cache across hot reloads in development
declare global {
  var mongoose: {
    conn: Connection | null;
    promise: Promise<Connection> | null;
  };
}

// Check for the MongoDB URI in environment variables
const MONGODB_URI = process.env.MONGODB_URI || "";
if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

// Initialize the global mongoose variable if it doesn't exist (for development caching)
if (!global.mongoose) {
  global.mongoose = { conn: null, promise: null };
}

export async function connectToMongoDB() {
  // If a cached connection exists, return it
  if (global.mongoose.conn) {
    console.log("Using cached MongoDB connection");
    return global.mongoose.conn;
  }

  // If no cached connection exists, create a new one
  if (!global.mongoose.promise) {
    console.log("Establishing a new MongoDB connection...");
    global.mongoose.promise = mongoose
      .connect(MONGODB_URI)
      .then((mongooseInstance) => {
        return mongooseInstance.connection;
      });
  }

  try {
    // Await the promise and cache the connection
    global.mongoose.conn = await global.mongoose.promise;
    console.log("MongoDB connected successfully");
    return global.mongoose.conn;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}
