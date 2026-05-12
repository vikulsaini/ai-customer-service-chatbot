import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ["user", "assistant"], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    intent: String,
    sentiment: String,
    category: String,
    attachments: [{ name: String, url: String, type: String }]
  },
  { _id: true }
);

const chatSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, default: "New IT Support Chat" },
    messages: [messageSchema],
    sentiment: { type: String, default: "neutral" },
    category: { type: String, default: "general" },
    resolved: { type: Boolean, default: false }
  },
  { timestamps: true }
);

chatSchema.index({ title: "text", "messages.content": "text", category: "text" });

export default mongoose.model("Chat", chatSchema);
