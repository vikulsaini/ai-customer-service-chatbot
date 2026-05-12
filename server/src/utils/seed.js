import "dotenv/config";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import Chat from "../models/Chat.js";
import Ticket from "../models/Ticket.js";

await connectDB();

await Promise.all([User.deleteMany(), Chat.deleteMany(), Ticket.deleteMany()]);
const admin = await User.create({ name: "Project Admin", email: process.env.ADMIN_EMAIL || "admin@aics.local", password: process.env.ADMIN_PASSWORD || "Admin@12345", role: "admin" });
const user = await User.create({ name: "Aarav Sharma", email: "aarav@example.com", password: "User@12345" });
const chat = await Chat.create({
  userId: user._id,
  title: "VPN connection failing",
  category: "network",
  sentiment: "negative",
  messages: [
    { role: "user", content: "My VPN is not connecting and I have an urgent client call." },
    { role: "assistant", content: "Please restart the VPN client, verify MFA, and share the error code. I can create a priority ticket if it continues." }
  ]
});
await Ticket.create({ userId: user._id, chatId: chat._id, issue: "VPN not connecting before client call", priority: "critical", category: "network" });

console.log(`Seeded admin ${admin.email} and user ${user.email}`);
process.exit(0);
