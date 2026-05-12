import { memoryStore, usingMemoryStore } from "../services/memoryStore.js";

export const getProfile = (req, res) => res.json({ user: req.user });

export const updateProfile = async (req, res) => {
  if (usingMemoryStore()) {
    const updated = await memoryStore.updateUser(String(req.user._id), { name: req.body.name ?? req.user.name, profileImage: req.body.profileImage ?? req.user.profileImage });
    return res.json({ user: updated });
  }
  const allowed = ["name", "profileImage"];
  allowed.forEach((field) => {
    if (req.body[field] !== undefined) req.user[field] = req.body[field];
  });
  await req.user.save();
  res.json({ user: req.user });
};
