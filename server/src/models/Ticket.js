import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    issue: { type: String, required: true },
    status: { type: String, enum: ["open", "in-progress", "resolved", "closed"], default: "open" },
    priority: { type: String, enum: ["low", "medium", "high", "critical"], default: "medium" },
    assignedTo: { type: String, default: "IT Support Desk" },
    category: { type: String, default: "technical" }
  },
  { timestamps: true }
);

export default mongoose.model("Ticket", ticketSchema);
