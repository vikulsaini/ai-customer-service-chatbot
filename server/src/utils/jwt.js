import jwt from "jsonwebtoken";

const tokenUserSnapshot = (user) => {
  if (!user || typeof user !== "object") return null;
  const id = String(user._id || user.id || "");
  if (!id) return null;

  return {
    _id: id,
    id,
    name: user.name,
    email: user.email,
    role: user.role || "user",
    profileImage: user.profileImage || "",
    status: user.status || "active"
  };
};

export const signToken = (userOrId) => {
  const user = tokenUserSnapshot(userOrId);
  const id = user?._id || String(userOrId);
  return jwt.sign({ id, user }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });
};

export const setAuthCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
};
