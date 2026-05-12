import { useState } from "react";
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
    const { data } = await api.put("/users/update", { name });
    setUser(data.user);
    localStorage.setItem("user", JSON.stringify(data.user));
    toast.success("Profile updated");
  };
  return <form onSubmit={save} className="glass max-w-2xl rounded-lg p-6"><h1 className="mb-5 text-3xl font-bold">User Profile</h1><Input label="Name" value={name} onChange={(e) => setName(e.target.value)} /><Input className="mt-4" label="Email" value={user?.email || ""} disabled /><Button className="mt-5">Save profile</Button></form>;
}
