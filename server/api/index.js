import app from "../src/app.js";
import connectDB from "../src/config/db.js";
import { memoryStore } from "../src/services/memoryStore.js";

let ready;

const prepare = async () => {
  const connected = await connectDB();
  globalThis.__USE_MEMORY_STORE__ = !connected;
  if (!connected) await memoryStore.ensureDemoAdmin();
};

export default async function handler(req, res) {
  ready ||= prepare();
  await ready;
  return app(req, res);
}
