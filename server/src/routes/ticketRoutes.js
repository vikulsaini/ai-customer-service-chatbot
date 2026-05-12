import { Router } from "express";
import { createTicket, listTickets, updateTicket } from "../controllers/ticketController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();
router.use(protect);
router.post("/", createTicket);
router.get("/", listTickets);
router.put("/:id", updateTicket);

export default router;
