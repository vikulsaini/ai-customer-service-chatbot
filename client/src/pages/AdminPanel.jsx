import React, { useEffect, useState } from "react";
import { Shield, Users, MessageSquare, Ticket } from "lucide-react";
import StatCard from "../components/StatCard";
import api from "../services/api";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [chats, setChats] = useState([]);
  const [analytics, setAnalytics] = useState({});
  useEffect(() => { Promise.all([api.get("/admin/users"), api.get("/admin/chats"), api.get("/admin/analytics")]).then(([u, c, a]) => { setUsers(u.data); setChats(c.data); setAnalytics(a.data); }); }, []);
  return (
    <div className="grid gap-4">
      <header className="glass rounded-lg p-5"><h1 className="flex items-center gap-2 text-3xl font-bold"><Shield />Admin Panel</h1><p className="mt-2 text-slate-600 dark:text-slate-300">Monitor users, chat logs, performance, and abuse controls.</p></header>
      <div className="grid gap-4 md:grid-cols-4"><StatCard label="Users" value={analytics.users || 0} icon={Users} /><StatCard label="Chats" value={analytics.chats || 0} icon={MessageSquare} /><StatCard label="Tickets" value={analytics.tickets || 0} icon={Ticket} /><StatCard label="Resolved" value={analytics.resolvedQueries || 0} icon={Shield} /></div>
      <section className="grid gap-4 lg:grid-cols-2">
        <div className="glass rounded-lg p-5"><h2 className="mb-4 text-xl font-bold">Manage Users</h2>{users.map((u) => <div key={u._id} className="mb-3 flex items-center justify-between rounded-lg bg-white/55 p-3 dark:bg-white/10"><span>{u.name}<small className="block text-slate-500">{u.email}</small></span><span className="text-sm">{u.status}</span></div>)}</div>
        <div className="glass rounded-lg p-5"><h2 className="mb-4 text-xl font-bold">Chat Logs</h2>{chats.slice(0, 8).map((c) => <div key={c._id} className="mb-3 rounded-lg bg-white/55 p-3 dark:bg-white/10"><p className="font-semibold">{c.title}</p><p className="text-sm text-slate-500">{c.userId?.email} · {c.category} · {c.sentiment}</p></div>)}</div>
      </section>
    </div>
  );
}
