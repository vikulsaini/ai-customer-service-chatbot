import { Router } from "express";
import { body } from "express-validator";
import { forgotPassword, login, loginRules, logout, resetPassword, signup, signupRules } from "../controllers/authController.js";
import { validate } from "../middleware/validate.js";

const router = Router();
router.post("/signup", signupRules, validate, signup);
router.post("/login", loginRules, validate, login);
router.post("/logout", logout);
router.post("/forgot-password", body("email").isEmail(), validate, forgotPassword);
router.post("/reset-password", body("token").notEmpty(), body("password").isLength({ min: 8 }), validate, resetPassword);

export default router;
