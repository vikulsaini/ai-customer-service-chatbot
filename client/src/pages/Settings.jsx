import React from "react";
import { Bell, Globe2, Languages } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function Settings() {
  const { dark, toggleTheme } = useTheme();
  const rows = [["Dark mode", dark, toggleTheme], ["Real-time notifications", true, () => {}], ["Speech synthesis", true, () => {}], ["Multilingual assistant", true, () => {}]];
  const icons = [Globe2, Bell, Languages, Languages];
  return (
    <div className="glass max-w-3xl rounded-lg p-4 sm:p-6">
      <h1 className="mb-5 text-2xl font-bold sm:text-3xl">Settings</h1>
      <div className="grid gap-3">{rows.map(([label, active, onClick], i) => { const Icon = icons[i]; return <button key={label} onClick={onClick} className="flex min-h-14 items-center justify-between gap-4 rounded-lg bg-white/55 p-4 text-left dark:bg-white/10"><span className="flex min-w-0 items-center gap-3"><Icon className="shrink-0" /><span className="break-words">{label}</span></span><span className={`h-6 w-11 shrink-0 rounded-full p-1 ${active ? "bg-ocean" : "bg-slate-300"}`}><span className={`block h-4 w-4 rounded-full bg-white transition ${active ? "translate-x-5" : ""}`} /></span></button>; })}</div>
    </div>
  );
}
