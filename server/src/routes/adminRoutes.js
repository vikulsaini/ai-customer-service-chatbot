import { Router } from "express";
import { body } from "express-validator";
import { getAnalytics, getChats, getUsers, updateUserStatus } from "../controllers/adminController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";

const router = Router();
router.use(protect, adminOnly);
router.get("/users", getUsers);
router.get("/chats", getChats);
router.get("/analytics", getAnalytics);
router.put("/users/:id/status", body("status").isIn(["active", "blocked"]), validate, updateUserStatus);

export default router;
