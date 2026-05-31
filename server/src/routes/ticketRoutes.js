import { Router } from "express";
import { body } from "express-validator";
import { createTicket, listTickets, updateTicket } from "../controllers/ticketController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";

const router = Router();
router.use(protect);
router.post(
  "/",
  body("issue").isString().trim().isLength({ min: 5, max: 1000 }),
  body("priority").optional().isIn(["low", "medium", "high", "critical"]),
  body("category").optional().isString().trim().isLength({ min: 2, max: 80 }),
  validate,
  createTicket
);
router.get("/", listTickets);
router.put(
  "/:id",
  body("issue").optional().isString().trim().isLength({ min: 5, max: 1000 }),
  body("priority").optional().isIn(["low", "medium", "high", "critical"]),
  body("category").optional().isString().trim().isLength({ min: 2, max: 80 }),
  body("status").optional().isIn(["open", "in-progress", "resolved", "closed"]),
  body("assignedTo").optional().isString().trim().isLength({ min: 2, max: 120 }),
  validate,
  updateTicket
);

export default router;
