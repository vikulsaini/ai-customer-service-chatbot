import User from "../models/User.js";
import Chat from "../models/Chat.js";
import Ticket from "../models/Ticket.js";
import { memoryStore, usingMemoryStore } from "../services/memoryStore.js";

export const getUsers = async (_req, res) => {
  if (usingMemoryStore()) return res.json(await memoryStore.listUsers());
  const users = await User.find().sort({ createdAt: -1 }).select("-password");
  res.json(users);
};

export const getChats = async (_req, res) => {
  if (usingMemoryStore()) return res.json(await memoryStore.listChatsWithUsers());
  const chats = await Chat.find().populate("userId", "name email").sort({ updatedAt: -1 }).limit(100);
  res.json(chats);
};

export const getAnalytics = async (_req, res) => {
  if (usingMemoryStore()) return res.json(await memoryStore.analytics());
  const [users, chats, tickets, resolved] = await Promise.all([
    User.countDocuments(),
    Chat.countDocuments(),
    Ticket.countDocuments(),
    Ticket.countDocuments({ status: "resolved" })
  ]);
  res.json({ users, chats, tickets, resolvedQueries: resolved, activeUsers: users });
};

export const updateUserStatus = async (req, res) => {
  if (usingMemoryStore()) return res.json(await memoryStore.updateUser(req.params.id, { status: req.body.status }));
  const user = await User.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true }).select("-password");
  res.json(user);
};
