import crypto from "crypto";
import { body } from "express-validator";
import User from "../models/User.js";
import { signToken, setAuthCookie } from "../utils/jwt.js";
import { memoryStore, usingMemoryStore } from "../services/memoryStore.js";

export const signupRules = [body("name").isLength({ min: 2 }), body("email").isEmail(), body("password").isLength({ min: 8 })];
export const loginRules = [body("email").isEmail(), body("password").notEmpty()];

const publicUser = (user) => ({ id: user._id, name: user.name, email: user.email, role: user.role, profileImage: user.profileImage, status: user.status });

export const signup = async (req, res) => {
  const exists = usingMemoryStore() ? await memoryStore.findUserByEmail(req.body.email) : await User.findOne({ email: req.body.email });
  if (exists) return res.status(409).json({ message: "Email already registered" });
  const user = usingMemoryStore() ? await memoryStore.createUser(req.body) : await User.create(req.body);
  const token = signToken(user._id);
  setAuthCookie(res, token);
  res.status(201).json({ user: publicUser(user), token });
};

export const login = async (req, res) => {
  const user = usingMemoryStore() ? await memoryStore.findUserByEmail(req.body.email) : await User.findOne({ email: req.body.email }).select("+password");
  const matches = user && (usingMemoryStore() ? await memoryStore.comparePassword(user, req.body.password) : await user.matchPassword(req.body.password));
  if (!matches) return res.status(401).json({ message: "Invalid credentials" });
  const token = signToken(user._id);
  setAuthCookie(res, token);
  res.json({ user: publicUser(user), token });
};

export const logout = (_req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
};

export const forgotPassword = async (req, res) => {
  if (usingMemoryStore()) return res.json({ message: "Demo reset token generated.", resetToken: crypto.randomBytes(12).toString("hex") });
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.json({ message: "If the email exists, a reset token has been generated." });
  const token = crypto.randomBytes(24).toString("hex");
  user.resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");
  user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
  await user.save();
  res.json({ message: "Password reset token generated for demo email flow.", resetToken: token });
};

export const resetPassword = async (req, res) => {
  if (usingMemoryStore()) return res.json({ message: "Password reset accepted in demo mode" });
  const hashed = crypto.createHash("sha256").update(req.body.token).digest("hex");
  const user = await User.findOne({ resetPasswordToken: hashed, resetPasswordExpires: { $gt: Date.now() } });
  if (!user) return res.status(400).json({ message: "Invalid or expired reset token" });
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
  res.json({ message: "Password updated successfully" });
};
