import "dotenv/config";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import Chat from "../models/Chat.js";
import Ticket from "../models/Ticket.js";
import FAQ from "../models/FAQ.js";

await connectDB();

if (process.env.RESET_SEED_DATA === "true") {
  await Promise.all([User.deleteMany(), Chat.deleteMany(), Ticket.deleteMany(), FAQ.deleteMany()]);
}

const adminEmail = process.env.ADMIN_EMAIL || "admin@aics.local";
const admin = await User.findOne({ email: adminEmail }) || await User.create({ name: "Project Admin", email: adminEmail, password: process.env.ADMIN_PASSWORD || "Admin@12345", role: "admin", status: "active" });
const user = await User.findOne({ email: "aarav@example.com" }) || await User.create({ name: "Aarav Sharma", email: "aarav@example.com", password: "User@12345", role: "user", status: "active" });
let chat = await Chat.findOne({ userId: user._id, title: "VPN connection failing" });
if (!chat) {
  chat = await Chat.create({
    userId: user._id,
    title: "VPN connection failing",
    category: "network",
    sentiment: "negative",
    messages: [
      { role: "user", content: "My VPN is not connecting and I have an urgent client call." },
      { role: "assistant", content: "Please restart the VPN client, verify MFA, and share the error code. I can create a priority ticket if it continues." }
    ]
  });
}

await Ticket.findOneAndUpdate(
  { userId: user._id, issue: "VPN not connecting before client call" },
  { userId: user._id, chatId: chat._id, issue: "VPN not connecting before client call", priority: "critical", category: "network" },
  { upsert: true, new: true, setDefaultsOnInsert: true }
);

const faqs = [
  { category: "account", question: "I cannot access my account.", answer: "Verify your login credentials. If the issue persists, use the Forgot Password option.", keywords: ["account", "login", "password"] },
  { category: "network", question: "VPN is not connecting.", answer: "Restart your VPN client, verify MFA, and confirm your internet connection before raising a network ticket.", keywords: ["vpn", "network"] },
  { category: "email", question: "Outlook is not syncing emails.", answer: "Check mailbox storage, restart Outlook, and try webmail. Escalate if incoming or outgoing mail is blocked.", keywords: ["outlook", "email"] },
  { category: "infrastructure", question: "Server is slow or unavailable.", answer: "Share the affected service, region, impact, and exact error message so the incident can be prioritized.", keywords: ["server", "incident"] }
];

await Promise.all(faqs.map((faq) => FAQ.findOneAndUpdate({ question: faq.question }, faq, { upsert: true, new: true, setDefaultsOnInsert: true })));

console.log(`Seeded admin ${admin.email} and user ${user.email}`);
process.exit(0);
