import bcrypt from "bcryptjs";
import crypto from "crypto";

const now = () => new Date().toISOString();
const id = () => crypto.randomUUID();

const store = {
  usersById: new Map(),
  usersByEmail: new Map(),
  chatsById: new Map(),
  ticketsById: new Map(),
  faqsById: new Map()
};

const clone = (value) => JSON.parse(JSON.stringify(value));
const values = (map) => [...map.values()];

const saveUser = (user) => {
  store.usersById.set(user._id, user);
  store.usersByEmail.set(user.email, user);
  return user;
};

export const memoryStore = {
  async createUser(data) {
    const email = data.email.toLowerCase().trim();
    if (store.usersByEmail.has(email)) return null;

    const user = saveUser({
      _id: id(),
      name: data.name,
      email,
      password: await bcrypt.hash(data.password, 12),
      profileImage: data.profileImage || "",
      role: data.role || "user",
      status: data.status || "active",
      createdAt: now(),
      updatedAt: now()
    });
    return clone(user);
  },

  async findUserByEmail(email) {
    const user = store.usersByEmail.get(email.toLowerCase().trim());
    return user ? clone(user) : null;
  },

  async findUserById(userId) {
    const user = store.usersById.get(userId);
    return user ? clone(user) : null;
  },

  async updateUser(userId, data) {
    const user = store.usersById.get(userId);
    if (!user) return null;
    Object.assign(user, data, { updatedAt: now() });
    saveUser(user);
    const { password, ...publicUser } = user;
    return clone(publicUser);
  },

  async listUsers() {
    return clone(values(store.usersById).map(({ password, ...user }) => user));
  },

  async comparePassword(user, password) {
    return bcrypt.compare(password, user.password);
  },

  async createChat(data) {
    const chat = { _id: id(), messages: [], sentiment: "neutral", category: "general", resolved: false, createdAt: now(), updatedAt: now(), ...data };
    store.chatsById.set(chat._id, chat);
    return clone(chat);
  },

  async getChat(chatId, userId) {
    const chat = store.chatsById.get(chatId);
    if (!chat || (userId && chat.userId !== userId)) return null;
    return clone(chat);
  },

  async saveChat(chat) {
    const next = { ...chat, updatedAt: now() };
    store.chatsById.set(next._id, next);
    return clone(next);
  },

  async listChats({ userId, search } = {}) {
    const q = search?.toLowerCase();
    const chats = values(store.chatsById)
      .filter((chat) => !userId || chat.userId === userId)
      .filter((chat) => !q || chat.title.toLowerCase().includes(q) || chat.messages.some((msg) => msg.content.toLowerCase().includes(q)))
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    return clone(chats);
  },

  async deleteChat(chatId, userId) {
    const chat = store.chatsById.get(chatId);
    if (!chat || chat.userId !== userId) return false;
    return store.chatsById.delete(chatId);
  },

  async createTicket(data) {
    const ticket = { _id: id(), status: "open", priority: "medium", assignedTo: "IT Support Desk", category: "technical", createdAt: now(), updatedAt: now(), ...data };
    store.ticketsById.set(ticket._id, ticket);
    return clone(ticket);
  },

  async listTickets(userId, isAdmin = false) {
    const tickets = values(store.ticketsById)
      .filter((ticket) => isAdmin || ticket.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return clone(tickets);
  },

  async updateTicket(ticketId, data, userId, isAdmin = false) {
    const ticket = store.ticketsById.get(ticketId);
    if (!ticket || (!isAdmin && ticket.userId !== userId)) return null;
    Object.assign(ticket, data, { updatedAt: now() });
    store.ticketsById.set(ticket._id, ticket);
    return clone(ticket);
  },

  async createFaq(data) {
    const faq = {
      _id: id(),
      question: data.question,
      answer: data.answer,
      category: data.category || "general",
      keywords: data.keywords || [],
      active: data.active ?? true,
      createdAt: now(),
      updatedAt: now()
    };
    store.faqsById.set(faq._id, faq);
    return clone(faq);
  },

  async listFaqs(search = "") {
    const q = search.toLowerCase();
    const faqs = values(store.faqsById)
      .filter((faq) => faq.active)
      .filter((faq) => !q || `${faq.question} ${faq.answer} ${faq.category} ${faq.keywords.join(" ")}`.toLowerCase().includes(q))
      .sort((a, b) => a.category.localeCompare(b.category) || a.question.localeCompare(b.question));
    return clone(faqs);
  },

  async analytics() {
    const users = values(store.usersById);
    const tickets = values(store.ticketsById);
    return {
      users: users.length,
      chats: store.chatsById.size,
      tickets: tickets.length,
      faqs: store.faqsById.size,
      resolvedQueries: tickets.filter((ticket) => ticket.status === "resolved").length,
      activeUsers: users.filter((user) => user.status === "active").length
    };
  },

  async listChatsWithUsers() {
    return clone(values(store.chatsById).map((chat) => ({ ...chat, userId: store.usersById.get(chat.userId) || chat.userId })));
  },

  async seedLocalFaqs() {
    if (store.faqsById.size) return;
    await this.createFaq({ category: "account", question: "I cannot access my account.", answer: "Verify your email and password first. If the issue persists, use Forgot Password to reset your credentials.", keywords: ["account", "login", "password"] });
    await this.createFaq({ category: "network", question: "VPN is not connecting.", answer: "Restart the VPN client, confirm internet connectivity, verify MFA, and share the exact error code if the issue continues.", keywords: ["vpn", "network", "remote"] });
    await this.createFaq({ category: "email", question: "Email is not syncing.", answer: "Check mailbox storage, restart the mail client, test webmail access, and create a ticket if delivery is affected.", keywords: ["email", "outlook", "mail"] });
    await this.createFaq({ category: "infrastructure", question: "Server is slow or down.", answer: "Share the service name, region, time of impact, and error message. Critical outages should be escalated as high-priority tickets.", keywords: ["server", "incident", "latency"] });
  }
};

export const usingMemoryStore = () => !process.env.MONGO_URI || globalThis.__USE_MEMORY_STORE__ === true;
