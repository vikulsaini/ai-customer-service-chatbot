import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { BarChart3, Bot, HelpCircle, History, LogOut, Menu, Moon, Settings, Shield, Sun, Ticket, User, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const linkClass = ({ isActive }) =>
  `flex min-h-11 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${isActive ? "bg-ocean text-white" : "text-slate-700 hover:bg-white/60 dark:text-slate-200 dark:hover:bg-white/10"}`;

const AppNav = ({ nav, onNavigate }) => (
  <nav className="grid gap-2">
    {nav.map(([to, Icon, label]) => (
      <NavLink key={to} to={to} onClick={onNavigate} className={linkClass}>
        <Icon size={18} />
        <span>{label}</span>
      </NavLink>
    ))}
  </nav>
);

const AccountActions = ({ dark, toggleTheme, logout, navigate }) => (
  <div className="mt-5 grid grid-cols-2 gap-2">
    <button aria-label="Toggle theme" onClick={toggleTheme} className="grid min-h-11 place-items-center rounded-lg bg-white/50 p-3 dark:bg-white/10">
      {dark ? <Sun /> : <Moon />}
    </button>
    <button
      aria-label="Logout"
      onClick={async () => {
        await logout();
        navigate("/");
      }}
      className="grid min-h-11 place-items-center rounded-lg bg-white/50 p-3 text-rose-600 dark:bg-white/10"
    >
      <LogOut />
    </button>
  </div>
);

export default function AppLayout() {
  const { user, logout, isAdmin } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const nav = [
    ["/dashboard", BarChart3, "Dashboard"],
    ["/chat", Bot, "Chatbot"],
    ["/history", History, "History"],
    ["/tickets", Ticket, "Tickets"],
    ["/faq", HelpCircle, "FAQ"],
    ["/profile", User, "Profile"],
    ["/settings", Settings, "Settings"]
  ];
  if (isAdmin) nav.splice(2, 0, ["/admin", Shield, "Admin"]);

  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top_left,#ccfbf1,transparent_34%),linear-gradient(135deg,#f8fafc,#e0f2fe)] text-slate-900 dark:bg-[linear-gradient(135deg,#07111f,#10201d)] dark:text-white">
      <header className="sticky top-0 z-40 border-b border-white/30 bg-white/75 px-3 py-3 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/75 md:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <button aria-label="Open navigation" onClick={() => setDrawerOpen(true)} className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-white/70 text-slate-900 shadow-sm dark:bg-white/10 dark:text-white">
            <Menu />
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold">AI Support</p>
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user?.name || "Customer"}</p>
          </div>
          <button aria-label="Toggle theme" onClick={toggleTheme} className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-white/70 text-slate-900 shadow-sm dark:bg-white/10 dark:text-white">
            {dark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button aria-label="Close navigation overlay" className="absolute inset-0 bg-slate-950/45" onClick={() => setDrawerOpen(false)} />
          <aside className="glass relative z-10 flex h-full w-[min(86vw,320px)] flex-col rounded-none p-4 shadow-2xl">
            <div className="mb-6 flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-ocean text-white"><Bot /></div>
                <div className="min-w-0">
                  <p className="truncate font-bold">AI Support</p>
                  <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user?.name}</p>
                </div>
              </div>
              <button aria-label="Close navigation" onClick={() => setDrawerOpen(false)} className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white/60 dark:bg-white/10">
                <X />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto pr-1">
              <AppNav nav={nav} onNavigate={() => setDrawerOpen(false)} />
            </div>
            <AccountActions dark={dark} toggleTheme={toggleTheme} logout={logout} navigate={navigate} />
          </aside>
        </div>
      )}

      <div className="mx-auto flex min-h-[calc(100vh-68px)] max-w-7xl gap-4 p-3 md:min-h-screen md:p-6">
        <aside className="glass sticky top-6 hidden h-[calc(100vh-3rem)] w-64 shrink-0 rounded-lg p-4 md:flex md:flex-col">
          <div className="mb-6 flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-lg bg-ocean text-white"><Bot /></div>
            <div className="min-w-0">
              <p className="truncate font-bold">AI Support</p>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user?.name}</p>
            </div>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto pr-1">
            <AppNav nav={nav} />
          </div>
          <AccountActions dark={dark} toggleTheme={toggleTheme} logout={logout} navigate={navigate} />
        </aside>
        <section className="min-w-0 flex-1 pb-3 md:pb-0"><Outlet /></section>
      </div>
    </main>
  );
}
