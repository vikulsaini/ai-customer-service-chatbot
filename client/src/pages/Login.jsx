import { Link, useNavigate } from "react-router-dom";
import { Bot } from "lucide-react";
import Button from "../components/Button";
import Input from "../components/Input";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const onSubmit = async (e) => {
    e.preventDefault();
    const ok = await login(Object.fromEntries(new FormData(e.currentTarget))).catch((err) => alert(err.response?.data?.message || "Login failed"));
    if (ok) navigate("/dashboard");
  };
  return <AuthCard title="Welcome back" footer={<Link className="text-ocean" to="/signup">Create account</Link>} onSubmit={onSubmit} loading={loading} submit="Login" />;
}

export function AuthCard({ title, footer, onSubmit, loading, submit, signup = false }) {
  return (
    <main className="grid min-h-screen place-items-center bg-[linear-gradient(135deg,#d9f99d,#bae6fd,#fef3c7)] p-5 dark:bg-[linear-gradient(135deg,#07111f,#14213d)]">
      <form onSubmit={onSubmit} className="glass w-full max-w-md rounded-lg p-6">
        <div className="mb-6 flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-lg bg-ocean text-white"><Bot /></span><h1 className="text-2xl font-bold text-slate-950 dark:text-white">{title}</h1></div>
        <div className="grid gap-4">
          {signup && <Input label="Full name" name="name" required />}
          <Input label="Email" name="email" type="email" required />
          <Input label="Password" name="password" type="password" required minLength="8" />
          <Button disabled={loading}>{loading ? "Please wait..." : submit}</Button>
        </div>
        <div className="mt-5 flex items-center justify-between text-sm text-slate-600 dark:text-slate-300"><Link to="/forgot-password">Forgot password?</Link>{footer}</div>
      </form>
    </main>
  );
}
