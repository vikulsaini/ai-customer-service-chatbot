import Ticket from "../models/Ticket.js";
import { memoryStore, usingMemoryStore } from "../services/memoryStore.js";

export const createTicket = async (req, res) => {
  if (usingMemoryStore()) return res.status(201).json(await memoryStore.createTicket({ ...req.body, userId: String(req.user._id) }));
  const ticket = await Ticket.create({ ...req.body, userId: req.user._id });
  res.status(201).json(ticket);
};

export const listTickets = async (req, res) => {
  if (usingMemoryStore()) return res.json(await memoryStore.listTickets(String(req.user._id), req.user.role === "admin"));
  const query = req.user.role === "admin" ? {} : { userId: req.user._id };
  const tickets = await Ticket.find(query).sort({ createdAt: -1 });
  res.json(tickets);
};

export const updateTicket = async (req, res) => {
  if (usingMemoryStore()) return res.json(await memoryStore.updateTicket(req.params.id, req.body));
  const ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(ticket);
};
