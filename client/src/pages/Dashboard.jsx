import React, { useEffect, useState } from "react";
import { Activity, CheckCircle2, MessageSquare, Users } from "lucide-react";
import StatCard from "../components/StatCard";
import api from "../services/api";

export default function Dashboard() {
  const [history, setHistory] = useState([]);
  useEffect(() => { api.get("/chat/history").then(({ data }) => setHistory(data)); }, []);
  const resolved = history.filter((c) => c.resolved).length;
  return (
    <div className="grid gap-4">
      <header className="glass rounded-lg p-5"><h1 className="text-3xl font-bold">User Dashboard</h1><p className="mt-2 text-slate-600 dark:text-slate-300">Support activity, chat health, and ticket readiness.</p></header>
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Total chats" value={history.length} icon={MessageSquare} />
        <StatCard label="Resolved queries" value={resolved} icon={CheckCircle2} tone="text-emerald-600" />
        <StatCard label="Active users" value="1" icon={Users} tone="text-violet" />
        <StatCard label="NLP categories" value={new Set(history.map((c) => c.category)).size || 0} icon={Activity} tone="text-coral" />
      </div>
      <section className="glass rounded-lg p-5">
        <h2 className="mb-4 text-xl font-bold">Recent Chats</h2>
        <div className="grid gap-3">{history.slice(0, 5).map((chat) => <div key={chat._id} className="rounded-lg bg-white/55 p-4 dark:bg-white/10"><p className="font-semibold">{chat.title}</p><p className="text-sm text-slate-500">{chat.category} · {chat.sentiment}</p></div>)}</div>
      </section>
    </div>
  );
}
