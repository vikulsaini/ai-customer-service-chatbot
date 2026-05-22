import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Search, Trash2 } from "lucide-react";
import Button from "../components/Button";
import api from "../services/api";

export default function ChatHistory() {
  const [search, setSearch] = useState("");
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadChats = async () => {
    setLoading(true);
    const { data } = await api.get("/chat/history", { params: search ? { search } : {} });
    setChats(data);
    setLoading(false);
  };

  useEffect(() => {
    loadChats();
  }, []);

  const deleteChat = async (id) => {
    await api.delete(`/chat/${id}`).catch(() => api.delete(`/chat/delete/${id}`));
    setChats((items) => items.filter((item) => item._id !== id));
    toast.success("Chat deleted");
  };

  const totals = useMemo(() => ({
    messages: chats.reduce((sum, chat) => sum + (chat.messages?.length || 0), 0),
    categories: new Set(chats.map((chat) => chat.category)).size
  }), [chats]);

  return (
    <div className="grid gap-4">
      <header className="glass rounded-lg p-5">
        <h1 className="text-3xl font-bold">Chat History</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">Search, review, and delete user-specific support conversations.</p>
      </header>

      <section className="glass rounded-lg p-4">
        <div className="flex flex-col gap-3 md:flex-row">
          <label className="relative flex-1">
            <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-lg border border-white/40 bg-white/70 py-3 pl-10 pr-4 outline-none dark:bg-slate-950/70" placeholder="Search conversations..." />
          </label>
          <Button onClick={loadChats}>Search</Button>
        </div>
        <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
          <div className="rounded-lg bg-white/55 p-3 dark:bg-white/10">Total chats: <strong>{chats.length}</strong></div>
          <div className="rounded-lg bg-white/55 p-3 dark:bg-white/10">Messages: <strong>{totals.messages}</strong> · Categories: <strong>{totals.categories}</strong></div>
        </div>
      </section>

      <section className="grid gap-3">
        {loading && <div className="glass rounded-lg p-5">Loading chat history...</div>}
        {!loading && !chats.length && <div className="glass rounded-lg p-5">No chat history found.</div>}
        {chats.map((chat) => (
          <article key={chat._id} className="glass rounded-lg p-5">
            <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
              <div>
                <h2 className="text-xl font-bold">{chat.title}</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{chat.category} · {chat.sentiment} · {new Date(chat.updatedAt).toLocaleString()}</p>
              </div>
              <button aria-label="Delete chat" onClick={() => deleteChat(chat._id)} className="self-start rounded-lg bg-rose-600 p-3 text-white"><Trash2 size={18} /></button>
            </div>
            <div className="mt-4 grid gap-2">
              {(chat.messages || []).slice(-4).map((message) => (
                <p key={message._id || `${message.role}-${message.timestamp}`} className="rounded-lg bg-white/55 p-3 text-sm dark:bg-white/10">
                  <strong>{message.role === "user" ? "User" : "AI"}:</strong> {message.content}
                </p>
              ))}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
