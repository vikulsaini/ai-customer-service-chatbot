import { Router } from "express";
import { body } from "express-validator";
import { deleteChat, getHistory, sendMessage } from "../controllers/chatController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";

const router = Router();
router.use(protect);
router.post("/message", body("message").isString().isLength({ min: 1, max: 3000 }), validate, sendMessage);
router.get("/history", getHistory);
router.delete("/delete/:id", deleteChat);

export default router;
