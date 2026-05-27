import React from "react";

export default function StatCard({ label, value, icon: Icon, tone = "text-ocean" }) {
  return (
    <div className="glass rounded-lg p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <div className="min-w-0">
          <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-2 text-2xl font-bold text-slate-950 dark:text-white sm:text-3xl">{value}</p>
        </div>
        <Icon className={`h-6 w-6 shrink-0 sm:h-7 sm:w-7 ${tone}`} />
      </div>
    </div>
  );
}
