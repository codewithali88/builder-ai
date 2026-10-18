// import mongoose from "mongoose";

// export async function connectToDatabase() {
//     mongoose.connection.on('connected', () => {
//         console.log("Successfully connected to MongoDB.")
//     })
//     await mongoose.connect(process.env.MONGODB_URI)
// }




import mongoose from "mongoose";
import dns from "node:dns";

// Fix MongoDB SRV DNS resolution for this Node.js process
dns.setServers(["8.8.8.8", "8.8.4.4"]);

export async function connectToDatabase() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is missing in .env");
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("Successfully connected to MongoDB.");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
}