import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MessageSquare, Shield, Ticket, Users } from "lucide-react";
import StatCard from "../components/StatCard";
import api from "../services/api";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [chats, setChats] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [analytics, setAnalytics] = useState({});

  useEffect(() => {
    Promise.all([api.get("/admin/users"), api.get("/admin/chats"), api.get("/admin/analytics"), api.get("/tickets")]).then(([u, c, a, t]) => {
      setUsers(u.data);
      setChats(c.data);
      setAnalytics(a.data);
      setTickets(t.data);
    });
  }, []);

  const suspendUser = async (user) => {
    const status = user.status === "blocked" ? "active" : "blocked";
    const { data } = await api.put(`/admin/users/${user._id}/status`, { status });
    setUsers((items) => items.map((item) => (item._id === user._id ? data : item)));
    toast.success(status === "blocked" ? "User suspended" : "User restored");
  };

  const updateTicket = async (ticket, status) => {
    const { data } = await api.put(`/tickets/${ticket._id}`, { status });
    setTickets((items) => items.map((item) => (item._id === ticket._id ? data : item)));
    toast.success("Ticket status updated");
  };

  return (
    <div className="grid gap-4">
      <header className="glass rounded-lg p-5">
        <h1 className="flex items-center gap-2 text-3xl font-bold"><Shield />Admin Panel</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">Monitor users, conversations, chatbot analytics, tickets, and abuse controls.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Users" value={analytics.users || 0} icon={Users} />
        <StatCard label="Chats" value={analytics.chats || 0} icon={MessageSquare} />
        <StatCard label="Tickets" value={analytics.tickets || 0} icon={Ticket} />
        <StatCard label="Resolved" value={analytics.resolvedQueries || 0} icon={Shield} />
      </div>

      <section className="grid gap-4 xl:grid-cols-3">
        <div className="glass rounded-lg p-5">
          <h2 className="mb-4 text-xl font-bold">Manage Users</h2>
          {users.map((user) => (
            <div key={user._id} className="mb-3 flex items-center justify-between gap-3 rounded-lg bg-white/55 p-3 dark:bg-white/10">
              <span>{user.name}<small className="block text-slate-500">{user.email}</small></span>
              <button onClick={() => suspendUser(user)} className={`rounded-lg px-3 py-2 text-xs font-bold ${user.status === "blocked" ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"}`}>
                {user.status === "blocked" ? "Restore" : "Suspend"}
              </button>
            </div>
          ))}
        </div>

        <div className="glass rounded-lg p-5">
          <h2 className="mb-4 text-xl font-bold">Chat Logs</h2>
          {chats.slice(0, 8).map((chat) => (
            <div key={chat._id} className="mb-3 rounded-lg bg-white/55 p-3 dark:bg-white/10">
              <p className="font-semibold">{chat.title}</p>
              <p className="text-sm text-slate-500">{chat.userId?.email} · {chat.category} · {chat.sentiment}</p>
            </div>
          ))}
        </div>

        <div className="glass rounded-lg p-5">
          <h2 className="mb-4 text-xl font-bold">Support Tickets</h2>
          {tickets.slice(0, 8).map((ticket) => (
            <div key={ticket._id} className="mb-3 rounded-lg bg-white/55 p-3 dark:bg-white/10">
              <p className="font-semibold">{ticket.issue}</p>
              <p className="text-sm text-slate-500">{ticket.priority} · {ticket.status}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {["open", "in-progress", "resolved"].map((status) => (
                  <button key={status} onClick={() => updateTicket(ticket, status)} className={`rounded-lg px-2 py-1 text-xs ${ticket.status === status ? "bg-ocean text-white" : "bg-white/70 dark:bg-white/10"}`}>
                    {status}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
