import { Router } from "express";
import { body } from "express-validator";
import { createFaq, listFaqs } from "../controllers/faqController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";

const router = Router();

router.get("/", listFaqs);
router.post("/", protect, adminOnly, body("question").isLength({ min: 5 }), body("answer").isLength({ min: 5 }), validate, createFaq);

export default router;
