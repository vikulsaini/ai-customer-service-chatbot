import React, { useEffect, useState } from "react";
import { HelpCircle, Search } from "lucide-react";
import Button from "../components/Button";
import api from "../services/api";

export default function FAQ() {
  const [faqs, setFaqs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const loadFaqs = async () => {
    setLoading(true);
    const { data } = await api.get("/faq", { params: search ? { search } : {} });
    setFaqs(data);
    setLoading(false);
  };

  useEffect(() => {
    loadFaqs();
  }, []);

  return (
    <div className="grid gap-4">
      <header className="glass rounded-lg p-5">
        <h1 className="flex items-center gap-3 text-3xl font-bold"><HelpCircle />FAQ Support</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">Instant answers for common IT-sector customer service questions.</p>
      </header>

      <section className="glass rounded-lg p-4">
        <div className="flex flex-col gap-3 md:flex-row">
          <label className="relative flex-1">
            <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} className="w-full rounded-lg border border-white/40 bg-white/70 py-3 pl-10 pr-4 outline-none dark:bg-slate-950/70" placeholder="Search FAQ by account, VPN, email, server..." />
          </label>
          <Button onClick={loadFaqs}>Search</Button>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-2">
        {loading && <div className="glass rounded-lg p-5">Loading FAQ...</div>}
        {!loading && !faqs.length && <div className="glass rounded-lg p-5">No FAQ answers found.</div>}
        {faqs.map((faq) => (
          <article key={faq._id} className="glass rounded-lg p-5">
            <span className="rounded-full bg-ocean/10 px-3 py-1 text-xs font-bold uppercase text-ocean">{faq.category}</span>
            <h2 className="mt-4 text-xl font-bold">{faq.question}</h2>
            <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">{faq.answer}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
