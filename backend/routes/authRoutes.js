import express from "express";
import { login, register } from "../controllers/authController.js";
import rateLimit from "express-rate-limit";

const router = express.Router();

// Rate limiter: 5 requests per minute per IP for login/register
const authLimiter = rateLimit({
	windowMs: 60 * 1000, // 1 minute
	max: 5,
	message: { error: "Too many attempts, please try again later." },
});

router.post("/login", authLimiter, login);
router.post("/register", authLimiter, register);

export default router;