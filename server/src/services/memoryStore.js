import bcrypt from "bcryptjs";
import crypto from "crypto";

const now = () => new Date().toISOString();
const id = () => crypto.randomUUID();

const store = {
  users: [],
  chats: [],
  tickets: []
};

const clone = (value) => JSON.parse(JSON.stringify(value));

export const memoryStore = {
  async createUser(data) {
    const user = {
      _id: id(),
      name: data.name,
      email: data.email.toLowerCase(),
      password: await bcrypt.hash(data.password, 12),
      profileImage: data.profileImage || "",
      role: data.role || "user",
      status: data.status || "active",
      createdAt: now(),
      updatedAt: now()
    };
    store.users.push(user);
    return clone(user);
  },

  async findUserByEmail(email) {
    const user = store.users.find((item) => item.email === email.toLowerCase());
    return user ? clone(user) : null;
  },

  async findUserById(userId) {
    const user = store.users.find((item) => item._id === userId);
    return user ? clone(user) : null;
  },

  async updateUser(userId, data) {
    const user = store.users.find((item) => item._id === userId);
    if (!user) return null;
    Object.assign(user, data, { updatedAt: now() });
    return clone(user);
  },

  async listUsers() {
    return clone(store.users.map(({ password, ...user }) => user));
  },

  async comparePassword(user, password) {
    return bcrypt.compare(password, user.password);
  },

  async createChat(data) {
    const chat = { _id: id(), messages: [], sentiment: "neutral", category: "general", resolved: false, createdAt: now(), updatedAt: now(), ...data };
    store.chats.push(chat);
    return clone(chat);
  },

  async getChat(chatId, userId) {
    const chat = store.chats.find((item) => item._id === chatId && (!userId || item.userId === userId));
    return chat ? clone(chat) : null;
  },

  async saveChat(chat) {
    const index = store.chats.findIndex((item) => item._id === chat._id);
    const next = { ...chat, updatedAt: now() };
    if (index >= 0) store.chats[index] = next;
    else store.chats.push(next);
    return clone(next);
  },

  async listChats({ userId, search } = {}) {
    const q = search?.toLowerCase();
    const chats = store.chats
      .filter((chat) => !userId || chat.userId === userId)
      .filter((chat) => !q || chat.title.toLowerCase().includes(q) || chat.messages.some((msg) => msg.content.toLowerCase().includes(q)))
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    return clone(chats);
  },

  async deleteChat(chatId, userId) {
    const before = store.chats.length;
    store.chats = store.chats.filter((chat) => !(chat._id === chatId && chat.userId === userId));
    return before !== store.chats.length;
  },

  async createTicket(data) {
    const ticket = { _id: id(), status: "open", priority: "medium", assignedTo: "IT Support Desk", category: "technical", createdAt: now(), updatedAt: now(), ...data };
    store.tickets.push(ticket);
    return clone(ticket);
  },

  async listTickets(userId, isAdmin = false) {
    return clone(store.tickets.filter((ticket) => isAdmin || ticket.userId === userId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  },

  async updateTicket(ticketId, data) {
    const ticket = store.tickets.find((item) => item._id === ticketId);
    if (!ticket) return null;
    Object.assign(ticket, data, { updatedAt: now() });
    return clone(ticket);
  },

  async analytics() {
    return {
      users: store.users.length,
      chats: store.chats.length,
      tickets: store.tickets.length,
      resolvedQueries: store.tickets.filter((ticket) => ticket.status === "resolved").length,
      activeUsers: store.users.filter((user) => user.status === "active").length
    };
  },

  async listChatsWithUsers() {
    return clone(store.chats.map((chat) => ({ ...chat, userId: store.users.find((user) => user._id === chat.userId) || chat.userId })));
  },

  async ensureDemoAdmin() {
    if (!store.users.length) {
      await this.createUser({ name: "Project Admin", email: process.env.ADMIN_EMAIL || "admin@aics.local", password: process.env.ADMIN_PASSWORD || "Admin@12345", role: "admin" });
      await this.createUser({ name: "Demo User", email: "demo@example.com", password: "Demo@12345", role: "user" });
    }
  }
};

export const usingMemoryStore = () => !process.env.MONGO_URI || globalThis.__USE_MEMORY_STORE__ === true;
