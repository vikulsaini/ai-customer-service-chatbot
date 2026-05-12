export default function Button({ children, className = "", variant = "primary", ...props }) {
  const variants = {
    primary: "bg-ocean text-white hover:bg-teal-800",
    ghost: "bg-white/50 text-slate-800 hover:bg-white dark:bg-white/10 dark:text-white",
    danger: "bg-rose-600 text-white hover:bg-rose-700"
  };
  return (
    <button className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition disabled:opacity-60 ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
