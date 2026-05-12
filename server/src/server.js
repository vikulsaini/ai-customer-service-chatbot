import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/db.js";
import { memoryStore } from "./services/memoryStore.js";

const port = process.env.PORT || 5000;

connectDB().then(async (connected) => {
  globalThis.__USE_MEMORY_STORE__ = !connected;
  if (!connected) await memoryStore.ensureDemoAdmin();
  app.listen(port, () => {
    console.log(`API running on port ${port}`);
  });
});
