export default function Input({ label, className = "", ...props }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">{label}</span>
      <input className={`w-full rounded-lg border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-ocean dark:border-slate-700 dark:bg-slate-950/70 dark:text-white ${className}`} {...props} />
    </label>
  );
}
