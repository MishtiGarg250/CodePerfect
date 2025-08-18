import express from "express";
import http from "http";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./config/mongodb.js";
import contentRoutes from "./routes/contentRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();
const app = express();

const allowedOrigins = [
  "https://code-perfect.vercel.app", 
  "http://localhost:3000"            
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // if you're using cookies or auth headers
}));
app.use(express.json());
app.use(morgan("dev"));

const server = http.createServer(app);

app.use("/api/v1/content", contentRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);


connectDB().then(() => {
  server.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
});
