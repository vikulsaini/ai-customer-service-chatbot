import mongoose from "mongoose";

const faqSchema = new mongoose.Schema(
  {
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true, trim: true },
    category: { type: String, default: "general", index: true },
    keywords: [{ type: String, lowercase: true, trim: true }],
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

faqSchema.index({ question: "text", answer: "text", keywords: "text", category: "text" });

export default mongoose.model("FAQ", faqSchema);
