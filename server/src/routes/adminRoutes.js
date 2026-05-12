import { Router } from "express";
import { getAnalytics, getChats, getUsers, updateUserStatus } from "../controllers/adminController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = Router();
router.use(protect, adminOnly);
router.get("/users", getUsers);
router.get("/chats", getChats);
router.get("/analytics", getAnalytics);
router.put("/users/:id/status", updateUserStatus);

export default router;
