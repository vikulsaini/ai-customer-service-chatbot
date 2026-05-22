import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Ticket as TicketIcon } from "lucide-react";
import Button from "../components/Button";
import Input from "../components/Input";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Tickets() {
  const { isAdmin } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadTickets = async () => {
    const { data } = await api.get("/tickets");
    setTickets(data);
    setLoading(false);
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const createTicket = async (event) => {
    event.preventDefault();
    const form = Object.fromEntries(new FormData(event.currentTarget));
    const { data } = await api.post("/tickets", form);
    setTickets((items) => [data, ...items]);
    event.currentTarget.reset();
    toast.success("Ticket created");
  };

  const updateStatus = async (ticket, status) => {
    const { data } = await api.put(`/tickets/${ticket._id}`, { status });
    setTickets((items) => items.map((item) => (item._id === ticket._id ? data : item)));
    toast.success("Ticket updated");
  };

  return (
    <div className="grid gap-4">
      <header className="glass rounded-lg p-5">
        <h1 className="flex items-center gap-3 text-3xl font-bold"><TicketIcon />Ticket Management</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">Create, prioritize, track, and manage IT support tickets.</p>
      </header>

      <form onSubmit={createTicket} className="glass rounded-lg p-5">
        <h2 className="mb-4 text-xl font-bold">Create Support Ticket</h2>
        <div className="grid gap-3 md:grid-cols-[1fr_180px_180px_auto]">
          <Input label="Issue" name="issue" required />
          <label className="block">
            <span className="mb-2 block text-sm font-medium">Priority</span>
            <select name="priority" className="w-full rounded-lg border border-slate-200 bg-white/80 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950/70">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </label>
          <Input label="Category" name="category" defaultValue="technical" />
          <Button className="mt-7"><Plus size={18} />Create</Button>
        </div>
      </form>

      <section className="grid gap-3">
        {loading && <div className="glass rounded-lg p-5">Loading tickets...</div>}
        {!loading && !tickets.length && <div className="glass rounded-lg p-5">No tickets yet.</div>}
        {tickets.map((ticket) => (
          <article key={ticket._id} className="glass rounded-lg p-5">
            <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
              <div>
                <p className="text-xs font-bold uppercase text-ocean">#{String(ticket._id).slice(0, 8)}</p>
                <h2 className="mt-1 text-xl font-bold">{ticket.issue}</h2>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{ticket.category} · {ticket.priority} priority · {new Date(ticket.createdAt).toLocaleString()}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {["open", "in-progress", "resolved", "closed"].map((status) => (
                  <button key={status} disabled={!isAdmin && status !== ticket.status} onClick={() => updateStatus(ticket, status)} className={`rounded-lg px-3 py-2 text-xs font-semibold ${ticket.status === status ? "bg-ocean text-white" : "bg-white/60 dark:bg-white/10"} disabled:cursor-not-allowed disabled:opacity-60`}>
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
