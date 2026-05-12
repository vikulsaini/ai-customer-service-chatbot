import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Bot, MessageSquareText, ShieldCheck, Sparkles } from "lucide-react";
import Button from "../components/Button";

export default function Landing() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#edf7f5] text-slate-950 dark:bg-[#07111f] dark:text-white">
      <section className="relative min-h-screen px-5 py-6">
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(15,118,110,.28),rgba(249,115,22,.14),rgba(124,58,237,.18))]" />
        <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3 font-bold"><span className="grid h-10 w-10 place-items-center rounded-lg bg-ocean text-white"><Bot size={21} /></span>AI Customer Service Chatbot</div>
          <div className="flex gap-2"><Link to="/login"><Button variant="ghost">Login</Button></Link><Link to="/signup"><Button>Signup</Button></Link></div>
        </nav>
        <div className="relative z-10 mx-auto grid min-h-[calc(100vh-96px)] max-w-7xl items-center gap-10 py-10 lg:grid-cols-[1.02fr_.98fr]">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <p className="mb-4 inline-flex rounded-full bg-white/55 px-4 py-2 text-sm font-semibold text-ocean dark:bg-white/10">MCA final year major project</p>
            <h1 className="max-w-4xl text-5xl font-black leading-tight tracking-normal md:text-7xl">AI Customer Service Chatbot</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-700 dark:text-slate-300">A full-stack IT support platform with JWT auth, OpenAI-powered answers, NLP intent detection, tickets, chat history, and admin analytics.</p>
            <div className="mt-8 flex flex-wrap gap-3"><Link to="/chat"><Button><Sparkles size={18} />Try chatbot</Button></Link><Link to="/dashboard"><Button variant="ghost">Open dashboard</Button></Link></div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="glass rounded-lg p-4">
            <div className="rounded-lg bg-slate-950 p-4 text-white">
              <div className="mb-4 flex items-center gap-2 text-sm text-teal-200"><MessageSquareText size={17} />Live IT Support</div>
              {["My VPN is not connecting before a client demo.", "I can help. Restart the VPN client, verify MFA, and share the error code. I can also create a critical ticket.", "Create critical ticket"].map((msg, i) => (
                <div key={msg} className={`mb-3 max-w-[88%] rounded-lg px-4 py-3 text-sm ${i === 1 ? "bg-teal-600/80" : "ml-auto bg-white/10"}`}>{msg}</div>
              ))}
              <div className="grid grid-cols-3 gap-3 pt-3 text-center text-xs">
                <div className="rounded-lg bg-white/10 p-3"><ShieldCheck className="mx-auto mb-1" size={18} />JWT Secure</div>
                <div className="rounded-lg bg-white/10 p-3"><Bot className="mx-auto mb-1" size={18} />OpenAI NLP</div>
                <div className="rounded-lg bg-white/10 p-3"><Sparkles className="mx-auto mb-1" size={18} />Analytics</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
