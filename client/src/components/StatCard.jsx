import React from "react";

export default function StatCard({ label, value, icon: Icon, tone = "text-ocean" }) {
  return (
    <div className="glass rounded-lg p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">{value}</p>
        </div>
        <Icon className={`h-7 w-7 ${tone}`} />
      </div>
    </div>
  );
}
