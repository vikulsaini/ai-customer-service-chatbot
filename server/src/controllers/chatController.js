import Chat from "../models/Chat.js";
import Ticket from "../models/Ticket.js";
import { generateSupportReply } from "../services/openaiService.js";
import { memoryStore, usingMemoryStore } from "../services/memoryStore.js";
import { analyzeText, quickRepliesFor } from "../services/nlpService.js";
import {
  extractTicketIssue,
  formatTicketId,
  getRequestedPriority,
  isPureTicketCommand,
  isTicketDetailsFollowUp,
  isTicketPromptConfirmation,
  wantsPriorityChange,
  wantsTicketCreation,
  wantsTicketList
} from "../services/ticketActionService.js";

const createSupportTicket = async ({ req, chat, issue, priority, category }) => {
  const payload = {
    userId: String(req.user._id),
    chatId: chat._id,
    issue,
    priority: priority || "medium",
    category: category || "technical"
  };

  if (usingMemoryStore()) return memoryStore.createTicket(payload);
  return Ticket.create({ ...payload, userId: req.user._id, chatId: chat._id });
};

const listUserTickets = async (req) => {
  if (usingMemoryStore()) return memoryStore.listTickets(String(req.user._id), req.user.role === "admin");
  const query = req.user.role === "admin" ? {} : { userId: req.user._id };
  return Ticket.find(query).sort({ updatedAt: -1 }).limit(10);
};

const updateLatestOpenTicketPriority = async (req, priority) => {
  const openStatuses = ["open", "in-progress"];

  if (usingMemoryStore()) {
    const tickets = await memoryStore.listTickets(String(req.user._id), req.user.role === "admin");
    const latest = tickets.find((ticket) => openStatuses.includes(ticket.status));
    if (!latest) return null;
    return memoryStore.updateTicket(latest._id, { priority }, String(req.user._id), req.user.role === "admin");
  }

  return Ticket.findOneAndUpdate(
    { userId: req.user._id, status: { $in: openStatuses } },
    { priority },
    { new: true, sort: { updatedAt: -1 } }
  );
};

const handleTicketAction = async ({ req, chat, message, history, analysis }) => {
  const priority = getRequestedPriority(message);
  const issue = extractTicketIssue(message);

  if (wantsTicketList(message)) {
    const tickets = await listUserTickets(req);
    if (!tickets.length) {
      return {
        reply: "You do not have any support tickets yet. Send an issue summary with priority and I can create one.",
        ticket: null,
        quickReplies: ["Create ticket", "Describe issue", "FAQ"]
      };
    }

    const summary = tickets
      .slice(0, 3)
      .map((ticket) => `${formatTicketId(ticket._id)}: ${ticket.issue} (${ticket.priority}, ${ticket.status})`)
      .join("\n");

    return {
      reply: `Here are your latest tickets:\n${summary}`,
      ticket: tickets[0],
      quickReplies: ["Create ticket", "Mark high priority", "Open tickets page"]
    };
  }

  if (isPureTicketCommand(message) || (wantsTicketCreation(message) && !issue)) {
    return {
      reply: "Sure. Please send the issue summary, affected service, and priority. Example: \"Create ticket for Outlook not syncing, high priority.\"",
      ticket: null,
      quickReplies: ["High priority", "Medium priority", "Cancel"]
    };
  }

  if (isTicketPromptConfirmation(message, history)) {
    return {
      reply: "Great. Type the full ticket details in one message, for example: \"Outlook is not syncing on Windows 11, high priority.\"",
      ticket: null,
      quickReplies: ["High priority", "Medium priority", "Cancel"]
    };
  }

  if ((wantsTicketCreation(message) && issue) || isTicketDetailsFollowUp(message, history)) {
    const ticketIssue = issue || message.trim();
    const ticketPriority = priority || (analysis.sentiment === "negative" ? "high" : "medium");
    const ticket = await createSupportTicket({
      req,
      chat,
      issue: ticketIssue,
      priority: ticketPriority,
      category: analysis.category
    });

    return {
      reply: `${formatTicketId(ticket._id)} created for "${ticket.issue}" with ${ticket.priority} priority. You can track it from the Tickets page.`,
      ticket,
      quickReplies: ["View tickets", "Add details", "Mark high priority"]
    };
  }

  if (wantsPriorityChange(message)) {
    const requestedPriority = priority || "high";
    const ticket = await updateLatestOpenTicketPriority(req, requestedPriority);
    if (!ticket) {
      return {
        reply: `I can mark a ticket as ${requestedPriority} priority, but there is no open ticket to update yet. Please send the issue summary first, for example: "Create ticket for VPN not connecting, high priority."`,
        ticket: null,
        quickReplies: ["Create ticket", "View tickets", "Describe issue"]
      };
    }

    return {
      reply: `${formatTicketId(ticket._id)} has been updated to ${requestedPriority} priority. Current status: ${ticket.status}.`,
      ticket,
      quickReplies: ["View tickets", "Add details", "Mark resolved"]
    };
  }

  return null;
};

export const sendMessage = async (req, res) => {
  const { message, chatId, attachments = [] } = req.body;
  const userId = String(req.user._id);
  let chat = chatId ? (usingMemoryStore() ? await memoryStore.getChat(chatId, userId) : await Chat.findOne({ _id: chatId, userId: req.user._id })) : null;
  if (!chat) chat = usingMemoryStore() ? await memoryStore.createChat({ userId, title: message.slice(0, 60) || "Support chat", messages: [] }) : await Chat.create({ userId: req.user._id, title: message.slice(0, 60) || "Support chat", messages: [] });

  chat.messages.push({ role: "user", content: message, attachments });
  const analysis = analyzeText(message);
  const ticketAction = await handleTicketAction({ req, chat, message, history: chat.messages, analysis });
  const ai = ticketAction
    ? { reply: ticketAction.reply, analysis, quickReplies: ticketAction.quickReplies }
    : await generateSupportReply({ message, history: chat.messages, user: req.user });
  chat.messages.push({ role: "assistant", content: ai.reply, intent: ai.analysis.intent, sentiment: ai.analysis.sentiment, category: ai.analysis.category });
  chat.sentiment = ai.analysis.sentiment;
  chat.category = ai.analysis.category;
  chat = usingMemoryStore() ? await memoryStore.saveChat(chat) : await chat.save();

  const shouldAutoCreateTicket =
    !ticketAction &&
    !isPureTicketCommand(message) &&
    /critical|urgent|production down|not working|unavailable|failed/i.test(message) &&
    message.trim().length > 12 &&
    ai.analysis.sentiment !== "positive";

  let ticket = ticketAction?.ticket || null;
  if (shouldAutoCreateTicket) {
    ticket = await createSupportTicket({
      req,
      chat,
      issue: message,
      priority: /critical|urgent|down/i.test(message) ? "critical" : "medium",
      category: ai.analysis.category
    });
  }

  res.json({ chat, reply: ai.reply, analysis: ai.analysis, quickReplies: ai.quickReplies || quickRepliesFor(ai.analysis.category), ticket });
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
    const deleted = await memoryStore.deleteChat(req.params.id, String(req.user._id));
    if (!deleted) return res.status(404).json({ message: "Chat not found" });
    return res.json({ message: "Chat deleted" });
  }
  const result = await Chat.deleteOne({ _id: req.params.id, userId: req.user._id });
  if (!result.deletedCount) return res.status(404).json({ message: "Chat not found" });
  res.json({ message: "Chat deleted" });
};
