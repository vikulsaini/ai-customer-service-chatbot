import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { memoryStore, usingMemoryStore } from "../services/memoryStore.js";

const sessionUserFromToken = (decoded) => {
  if (!decoded?.user?._id) return null;
  return {
    _id: decoded.user._id,
    id: decoded.user.id || decoded.user._id,
    name: decoded.user.name,
    email: decoded.user.email,
    role: decoded.user.role || "user",
    profileImage: decoded.user.profileImage || "",
    status: decoded.user.status || "active"
  };
};

const legacySessionUserFromHeader = (req, decoded) => {
  try {
    const raw = req.headers["x-session-user"];
    if (!raw) return null;
    const sessionUser = JSON.parse(decodeURIComponent(Array.isArray(raw) ? raw[0] : raw));
    const id = String(sessionUser._id || sessionUser.id || "");
    if (!id || id !== String(decoded.id)) return null;

    return {
      _id: id,
      id,
      name: sessionUser.name || "Customer",
      email: sessionUser.email || "",
      role: "user",
      profileImage: sessionUser.profileImage || "",
      status: "active"
    };
  } catch {
    return null;
  }
};

export const protect = async (req, res, next) => {
  try {
    const bearer = req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization.split(" ")[1] : null;
    const token = bearer || req.cookies.token;
    if (!token) return res.status(401).json({ message: "Authentication required" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = usingMemoryStore()
      ? (await memoryStore.findUserById(decoded.id)) || sessionUserFromToken(decoded) || legacySessionUserFromHeader(req, decoded)
      : await User.findById(decoded.id);
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
