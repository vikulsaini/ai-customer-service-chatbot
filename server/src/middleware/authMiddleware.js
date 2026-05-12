import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { memoryStore, usingMemoryStore } from "../services/memoryStore.js";

export const protect = async (req, res, next) => {
  try {
    const bearer = req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization.split(" ")[1] : null;
    const token = bearer || req.cookies.token;
    if (!token) return res.status(401).json({ message: "Authentication required" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = usingMemoryStore() ? await memoryStore.findUserById(decoded.id) : await User.findById(decoded.id);
    if (!user || user.status === "blocked") return res.status(401).json({ message: "Account unavailable" });
    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") return res.status(403).json({ message: "Admin access required" });
  next();
};
