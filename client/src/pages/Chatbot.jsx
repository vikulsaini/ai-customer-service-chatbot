import React, { useEffect, useRef, useState } from "react";
import { jsPDF } from "jspdf";
import { Mic, Paperclip, Send, Volume2 } from "lucide-react";
import toast from "react-hot-toast";
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
    try {
      const { data } = await api.post("/chat/message", { message: value, chatId });
      setChatId(data.chat._id);
      setQuickReplies(data.quickReplies);
      setMessages((m) => [...m, { role: "assistant", content: data.reply, timestamp: new Date(), meta: data.analysis }]);
    } catch (error) {
      if (error.response?.status !== 401) toast.error(error.response?.data?.message || "AI response failed. Please try again.");
      setMessages((m) => [...m, { role: "assistant", content: "I could not process that request right now. Please try again in a moment.", timestamp: new Date() }]);
    } finally {
      setTyping(false);
    }
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
    <div className="glass flex h-[calc(100dvh-5.75rem)] min-h-[520px] flex-col overflow-hidden rounded-lg md:h-[calc(100vh-3rem)]">
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-white/30 p-3 sm:p-4">
        <div className="min-w-0">
          <h1 className="truncate text-xl font-bold sm:text-2xl">AI Chatbot</h1>
          <p className="truncate text-xs text-emerald-600 sm:text-sm">Online · context-aware IT support</p>
        </div>
        <Button variant="ghost" onClick={exportPdf} className="shrink-0 px-3 text-xs sm:px-4 sm:text-sm">Export PDF</Button>
      </header>

      <div className="scrollbar-thin flex-1 overflow-y-auto p-3 sm:p-4">
        {messages.map((msg, i) => (
          <div key={i} className={`mb-4 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[90%] break-words rounded-lg px-3 py-3 text-sm sm:max-w-[82%] sm:px-4 sm:text-base ${msg.role === "user" ? "bg-ocean text-white" : "bg-white/70 text-slate-900 dark:bg-white/10 dark:text-white"}`}>
              <p className="whitespace-pre-wrap leading-6 sm:leading-7">{msg.content}</p>
              <div className="mt-2 flex items-center justify-between gap-4 text-xs opacity-75">
                <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
                {msg.role === "assistant" && <button aria-label="Speak reply" onClick={() => speak(msg.content)}><Volume2 size={15} /></button>}
              </div>
            </div>
          </div>
        ))}
        {typing && <div className="rounded-lg bg-white/60 px-4 py-3 text-sm dark:bg-white/10">AI is typing...</div>}
        <div ref={endRef} />
      </div>

      <div className="shrink-0 border-t border-white/30 p-3 sm:p-4">
        <div className="mb-3 flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible">
          {quickReplies.map((q) => (
            <button key={q} onClick={() => send(q)} className="min-h-9 shrink-0 rounded-full bg-white/60 px-3 py-2 text-xs font-semibold dark:bg-white/10">
              {q}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-[auto_auto_1fr_auto] gap-2">
          <button aria-label="Voice input" className="grid h-11 w-11 place-items-center rounded-lg bg-white/60 dark:bg-white/10" onClick={listen}><Mic size={19} /></button>
          <button aria-label="Attach file" className="grid h-11 w-11 place-items-center rounded-lg bg-white/60 dark:bg-white/10"><Paperclip size={19} /></button>
          <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} className="min-w-0 rounded-lg border-0 bg-white/70 px-3 text-sm outline-none dark:bg-slate-950/70 sm:px-4" placeholder="Describe your IT issue..." />
          <Button aria-label="Send message" onClick={() => send()} className="h-11 min-w-11 px-3"><Send size={18} /></Button>
        </div>
      </div>
    </div>
  );
}
