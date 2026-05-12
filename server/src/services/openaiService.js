import OpenAI from "openai";
import { analyzeText, quickRepliesFor } from "./nlpService.js";

const client = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

export const generateSupportReply = async ({ message, history = [], user }) => {
  const analysis = analyzeText(message);

  if (!client) {
    return {
      reply: analysis.faqAnswer || `I understand your ${analysis.category} request. Please share the affected application, error message, and urgency so I can guide you or create a ticket.`,
      analysis,
      quickReplies: quickRepliesFor(analysis.category),
      source: "local-nlp"
    };
  }

  const recent = history.slice(-8).map((m) => ({ role: m.role, content: m.content }));
  const response = await client.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-5",
    instructions:
      "You are an IT-sector customer service chatbot. Give concise, empathetic, technically useful answers. Detect when a support ticket is needed. Never invent account-specific data.",
    input: [
      ...recent,
      {
        role: "user",
        content: `Customer: ${user.name}\nMessage: ${message}\nDetected intent: ${analysis.intent}\nSentiment: ${analysis.sentiment}\nCategory: ${analysis.category}`
      }
    ]
  });

  return {
    reply: response.output_text || "I reviewed your request. Could you provide one more detail so I can help accurately?",
    analysis,
    quickReplies: quickRepliesFor(analysis.category),
    source: "openai"
  };
};
