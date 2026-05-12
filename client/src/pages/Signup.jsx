import { Link, useNavigate } from "react-router-dom";
import { AuthCard } from "./Login";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const { signup, loading } = useAuth();
  const navigate = useNavigate();
  const onSubmit = async (e) => {
    e.preventDefault();
    const ok = await signup(Object.fromEntries(new FormData(e.currentTarget))).catch((err) => alert(err.response?.data?.message || "Signup failed"));
    if (ok) navigate("/dashboard");
  };
  return <AuthCard title="Create your account" footer={<Link className="text-ocean" to="/login">Already registered</Link>} onSubmit={onSubmit} loading={loading} submit="Signup" signup />;
}
