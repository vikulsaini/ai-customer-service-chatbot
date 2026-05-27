import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import ticketRoutes from "./routes/ticketRoutes.js";
import faqRoutes from "./routes/faqRoutes.js";
import docsRoutes from "./routes/docsRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

const app = express();
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.set("trust proxy", 1);
app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      const isVercelPreview = /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin || "");
      if (!origin || allowedOrigins.includes(origin) || isVercelPreview) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true
  })
);
app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 250, standardHeaders: true, legacyHeaders: false }));

app.get("/api/health", (_req, res) =>
  res.json({
    ok: true,
    name: "AI Customer Service Chatbot API",
    database: globalThis.__USE_MEMORY_STORE__ ? "indexed-memory-fallback" : "mongodb",
    mongoConfigured: Boolean(process.env.MONGO_URI),
    openaiConfigured: Boolean(process.env.OPENAI_API_KEY),
    docs: "/api/docs",
    note: process.env.MONGO_URI ? "MongoDB Atlas is configured." : "Using indexed in-memory fallback. Set MONGO_URI in Vercel for permanent account storage."
  })
);
app.get("/health", (_req, res) =>
  res.json({
    ok: true,
    name: "AI Customer Service Chatbot API",
    database: globalThis.__USE_MEMORY_STORE__ ? "indexed-memory-fallback" : "mongodb",
    mongoConfigured: Boolean(process.env.MONGO_URI),
    openaiConfigured: Boolean(process.env.OPENAI_API_KEY),
    docs: "/api/docs",
    note: process.env.MONGO_URI ? "MongoDB Atlas is configured." : "Using indexed in-memory fallback. Set MONGO_URI in Vercel for permanent account storage."
  })
);
app.use("/api", docsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/faq", faqRoutes);

// Compatibility routes for deployments whose frontend API base URL omits "/api".
app.use("/", docsRoutes);
app.use("/auth", authRoutes);
app.use("/chat", chatRoutes);
app.use("/users", userRoutes);
app.use("/admin", adminRoutes);
app.use("/tickets", ticketRoutes);
app.use("/faq", faqRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
