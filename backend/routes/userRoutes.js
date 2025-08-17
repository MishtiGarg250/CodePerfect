import express from "express";
import { addOrRemoveBookmark,getBookmarks,updateProgress, getProgress, getDailyLogs } from "../controllers/userController.js";
import { auth } from "../middleware/Auth.js";



const router = express.Router();




router.post("/addOrRemoveBookmark",auth,addOrRemoveBookmark);
router.post("/getBookmarks",auth,getBookmarks);
router.post("/updateProgress",auth,updateProgress);
router.get("/progress", auth, getProgress);
router.get("/dailylogs", auth, getDailyLogs);

export default router;