import React, { useEffect, useRef, useState } from "react";
import { jsPDF } from "jspdf";
import { Mic, Paperclip, Send, Volume2 } from "lucide-react";
import Button from "../components/Button";
import api from "../services/api";

export default function Chatbot() {
  const [messages, setMessages] = useState([{ role: "assistant", content: "Hello. I can help with IT support, incidents, access issues, VPN, email, and tickets.", timestamp: new Date() }]);
  const [chatId, setChatId] = useState(null);
  const [text, setText] = useState("");
  const [quickReplies, setQuickReplies] = useState(["VPN issue", "Reset password", "Create ticket"]);
  const [typing, setTyping] = useState(false);
  const endRef = useRef(null);
  useEffect(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), [messages, typing]);

  const send = async (value = text) => {
    if (!value.trim()) return;
    const userMsg = { role: "user", content: value, timestamp: new Date() };
    setMessages((m) => [...m, userMsg]);
    setText("");
    setTyping(true);
    const { data } = await api.post("/chat/message", { message: value, chatId });
    setChatId(data.chat._id);
    setQuickReplies(data.quickReplies);
    setMessages((m) => [...m, { role: "assistant", content: data.reply, timestamp: new Date(), meta: data.analysis }]);
    setTyping(false);
  };

  const speak = (msg) => {
    if ("speechSynthesis" in window) window.speechSynthesis.speak(new SpeechSynthesisUtterance(msg));
  };

  const listen = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Speech recognition is not supported in this browser.");
    const rec = new SpeechRecognition();
    rec.lang = "en-IN";
    rec.onresult = (event) => setText(event.results[0][0].transcript);
    rec.start();
  };

  const exportPdf = () => {
    const doc = new jsPDF();
    doc.text("AI Customer Service Chatbot - Chat Export", 12, 15);
    messages.forEach((m, i) => doc.text(`${m.role}: ${m.content}`.slice(0, 95), 12, 28 + i * 8));
    doc.save("support-chat.pdf");
  };

  return (
    <div className="glass flex h-[calc(100vh-2rem)] flex-col rounded-lg">
      <header className="flex items-center justify-between border-b border-white/30 p-4"><div><h1 className="text-2xl font-bold">AI Chatbot</h1><p className="text-sm text-emerald-600">Online · context-aware IT support</p></div><Button variant="ghost" onClick={exportPdf}>Export PDF</Button></header>
      <div className="scrollbar-thin flex-1 overflow-y-auto p-4">
        {messages.map((msg, i) => (
          <div key={i} className={`mb-4 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[82%] rounded-lg px-4 py-3 ${msg.role === "user" ? "bg-ocean text-white" : "bg-white/70 text-slate-900 dark:bg-white/10 dark:text-white"}`}>
              <p className="leading-7">{msg.content}</p>
              <div className="mt-2 flex items-center justify-between gap-4 text-xs opacity-75"><span>{new Date(msg.timestamp).toLocaleTimeString()}</span>{msg.role === "assistant" && <button onClick={() => speak(msg.content)}><Volume2 size={15} /></button>}</div>
            </div>
          </div>
        ))}
        {typing && <div className="rounded-lg bg-white/60 px-4 py-3 text-sm dark:bg-white/10">AI is typing...</div>}
        <div ref={endRef} />
      </div>
      <div className="border-t border-white/30 p-4">
        <div className="mb-3 flex flex-wrap gap-2">{quickReplies.map((q) => <button key={q} onClick={() => send(q)} className="rounded-full bg-white/60 px-3 py-2 text-xs font-semibold dark:bg-white/10">{q}</button>)}</div>
        <div className="flex gap-2"><button className="rounded-lg bg-white/60 p-3 dark:bg-white/10" onClick={listen}><Mic /></button><button className="rounded-lg bg-white/60 p-3 dark:bg-white/10"><Paperclip /></button><input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} className="min-w-0 flex-1 rounded-lg border-0 bg-white/70 px-4 outline-none dark:bg-slate-950/70" placeholder="Describe your IT support issue..." /><Button onClick={() => send()}><Send size={18} /></Button></div>
      </div>
    </div>
  );
}
