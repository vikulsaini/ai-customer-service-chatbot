import Ticket from "../models/Ticket.js";
import { memoryStore, usingMemoryStore } from "../services/memoryStore.js";

const statuses = ["open", "in-progress", "resolved", "closed"];
const priorities = ["low", "medium", "high", "critical"];

const ticketCreatePayload = (body) => ({
  issue: body.issue?.trim(),
  priority: priorities.includes(body.priority) ? body.priority : "medium",
  category: body.category?.trim() || "technical"
});

const ticketUpdatePayload = (body, isAdmin) => {
  const allowed = isAdmin ? ["issue", "priority", "category", "status", "assignedTo"] : ["issue", "priority", "category"];
  return allowed.reduce((payload, field) => {
    if (body[field] === undefined) return payload;
    if (field === "priority" && !priorities.includes(body[field])) return payload;
    if (field === "status" && !statuses.includes(body[field])) return payload;
    payload[field] = typeof body[field] === "string" ? body[field].trim() : body[field];
    return payload;
  }, {});
};

export const createTicket = async (req, res) => {
  const payload = ticketCreatePayload(req.body);
  if (usingMemoryStore()) return res.status(201).json(await memoryStore.createTicket({ ...payload, userId: String(req.user._id) }));
  const ticket = await Ticket.create({ ...payload, userId: req.user._id });
  res.status(201).json(ticket);
};

export const listTickets = async (req, res) => {
  if (usingMemoryStore()) return res.json(await memoryStore.listTickets(String(req.user._id), req.user.role === "admin"));
  const query = req.user.role === "admin" ? {} : { userId: req.user._id };
  const tickets = await Ticket.find(query).sort({ createdAt: -1 });
  res.json(tickets);
};

export const updateTicket = async (req, res) => {
  const payload = ticketUpdatePayload(req.body, req.user.role === "admin");
  if (!Object.keys(payload).length) return res.status(400).json({ message: "No valid ticket fields provided" });

  if (usingMemoryStore()) {
    const ticket = await memoryStore.updateTicket(req.params.id, payload, String(req.user._id), req.user.role === "admin");
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    return res.json(ticket);
  }
  const query = req.user.role === "admin" ? { _id: req.params.id } : { _id: req.params.id, userId: req.user._id };
  const ticket = await Ticket.findOneAndUpdate(query, payload, { new: true, runValidators: true });
  if (!ticket) return res.status(404).json({ message: "Ticket not found" });
  res.json(ticket);
};
