import React, { useState } from "react";
import toast from "react-hot-toast";
import Button from "../components/Button";
import Input from "../components/Input";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function Profile() {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const save = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.put("/users/update", { name });
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success("Profile updated");
    } catch (error) {
      if (error.response?.status !== 401) toast.error(error.response?.data?.message || "Unable to update profile.");
    }
  };
  return (
    <form onSubmit={save} className="glass max-w-2xl rounded-lg p-4 sm:p-6">
      <h1 className="mb-5 text-2xl font-bold sm:text-3xl">User Profile</h1>
      <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <Input className="mt-4" label="Email" value={user?.email || ""} disabled />
      <Button className="mt-5 w-full sm:w-auto">Save profile</Button>
    </form>
  );
}
