import { Router } from "express";
import { body } from "express-validator";
import { getProfile, updateProfile } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";

const router = Router();
router.use(protect);
router.get("/profile", getProfile);
router.put(
  "/update",
  body("name").optional().isString().trim().isLength({ min: 2, max: 80 }),
  body("profileImage").optional().isString().trim().isLength({ max: 500 }),
  validate,
  updateProfile
);

export default router;
