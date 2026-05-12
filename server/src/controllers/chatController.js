import Chat from "../models/Chat.js";
import Ticket from "../models/Ticket.js";
import { generateSupportReply } from "../services/openaiService.js";
import { memoryStore, usingMemoryStore } from "../services/memoryStore.js";

export const sendMessage = async (req, res) => {
  const { message, chatId, attachments = [] } = req.body;
  const userId = String(req.user._id);
  let chat = chatId ? (usingMemoryStore() ? await memoryStore.getChat(chatId, userId) : await Chat.findOne({ _id: chatId, userId: req.user._id })) : null;
  if (!chat) chat = usingMemoryStore() ? await memoryStore.createChat({ userId, title: message.slice(0, 60) || "Support chat", messages: [] }) : await Chat.create({ userId: req.user._id, title: message.slice(0, 60) || "Support chat", messages: [] });

  chat.messages.push({ role: "user", content: message, attachments });
  const ai = await generateSupportReply({ message, history: chat.messages, user: req.user });
  chat.messages.push({ role: "assistant", content: ai.reply, intent: ai.analysis.intent, sentiment: ai.analysis.sentiment, category: ai.analysis.category });
  chat.sentiment = ai.analysis.sentiment;
  chat.category = ai.analysis.category;
  chat = usingMemoryStore() ? await memoryStore.saveChat(chat) : await chat.save();

  const ticketCreated = /ticket|escalate|critical|urgent|not working/i.test(message) && ai.analysis.sentiment !== "positive";
  let ticket = null;
  if (ticketCreated) {
    ticket = usingMemoryStore() ? await memoryStore.createTicket({
      userId,
      chatId: chat._id,
      issue: message,
      priority: /critical|urgent|down/i.test(message) ? "critical" : "medium",
      category: ai.analysis.category
    }) : await Ticket.create({
      userId: req.user._id,
      chatId: chat._id,
      issue: message,
      priority: /critical|urgent|down/i.test(message) ? "critical" : "medium",
      category: ai.analysis.category
    });
  }

  res.json({ chat, reply: ai.reply, analysis: ai.analysis, quickReplies: ai.quickReplies, ticket });
};

export const getHistory = async (req, res) => {
  if (usingMemoryStore()) return res.json(await memoryStore.listChats({ userId: String(req.user._id), search: req.query.search }));
  const query = { userId: req.user._id };
  if (req.query.search) query.$text = { $search: req.query.search };
  const chats = await Chat.find(query).sort({ updatedAt: -1 }).limit(50);
  res.json(chats);
};

export const deleteChat = async (req, res) => {
  if (usingMemoryStore()) {
    await memoryStore.deleteChat(req.params.id, String(req.user._id));
    return res.json({ message: "Chat deleted" });
  }
  await Chat.deleteOne({ _id: req.params.id, userId: req.user._id });
  res.json({ message: "Chat deleted" });
};
