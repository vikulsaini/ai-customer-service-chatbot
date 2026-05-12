import React, { useState } from "react";
import toast from "react-hot-toast";
import Button from "../components/Button";
import Input from "../components/Input";
import api from "../services/api";

export default function ForgotPassword() {
  const [token, setToken] = useState("");
  const submit = async (e) => {
    e.preventDefault();
    const { data } = await api.post("/auth/forgot-password", Object.fromEntries(new FormData(e.currentTarget)));
    setToken(data.resetToken || "");
    toast.success(data.message);
  };
  return (
    <main className="grid min-h-screen place-items-center bg-[#eef7f4] p-5 dark:bg-[#07111f]">
      <form onSubmit={submit} className="glass w-full max-w-md rounded-lg p-6">
        <h1 className="mb-5 text-2xl font-bold dark:text-white">Forgot Password</h1>
        <Input label="Registered email" name="email" type="email" required />
        <Button className="mt-4 w-full">Generate reset token</Button>
        {token && <p className="mt-4 rounded-lg bg-white/60 p-3 text-sm text-slate-700 dark:bg-white/10 dark:text-slate-200">Demo reset token: {token}</p>}
      </form>
    </main>
  );
}
