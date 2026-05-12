import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { BarChart3, Bot, LogOut, Moon, Settings, Shield, Sun, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${isActive ? "bg-ocean text-white" : "text-slate-700 hover:bg-white/60 dark:text-slate-200 dark:hover:bg-white/10"}`;

export default function AppLayout() {
  const { user, logout, isAdmin } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const nav = [
    ["/dashboard", BarChart3, "Dashboard"],
    ["/chat", Bot, "Chatbot"],
    ["/profile", User, "Profile"],
    ["/settings", Settings, "Settings"]
  ];
  if (isAdmin) nav.splice(2, 0, ["/admin", Shield, "Admin"]);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#ccfbf1,transparent_34%),linear-gradient(135deg,#f8fafc,#e0f2fe)] text-slate-900 dark:bg-[linear-gradient(135deg,#07111f,#10201d)] dark:text-white">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-4 p-3 md:flex-row md:p-6">
        <aside className="glass rounded-lg p-4 md:w-64">
          <div className="mb-6 flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-lg bg-ocean text-white"><Bot /></div>
            <div>
              <p className="font-bold">AI Support</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{user?.name}</p>
            </div>
          </div>
          <nav className="grid gap-2">{nav.map(([to, Icon, label]) => <NavLink key={to} to={to} className={linkClass}><Icon size={18} />{label}</NavLink>)}</nav>
          <div className="mt-5 grid grid-cols-2 gap-2">
            <button aria-label="Toggle theme" onClick={toggleTheme} className="rounded-lg bg-white/50 p-3 dark:bg-white/10">{dark ? <Sun /> : <Moon />}</button>
            <button aria-label="Logout" onClick={async () => { await logout(); navigate("/"); }} className="rounded-lg bg-white/50 p-3 text-rose-600 dark:bg-white/10"><LogOut /></button>
          </div>
        </aside>
        <section className="min-w-0 flex-1"><Outlet /></section>
      </div>
    </main>
  );
}
