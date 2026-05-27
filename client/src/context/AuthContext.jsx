import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user") || "null"));
  const [loading, setLoading] = useState(false);

  const clearSession = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  useEffect(() => {
    const handleExpiredSession = () => {
      clearSession();
      toast.error("Session expired. Please login again.");
    };

    window.addEventListener("auth:expired", handleExpiredSession);
    return () => window.removeEventListener("auth:expired", handleExpiredSession);
  }, []);

  const persist = (payload) => {
    if (!payload?.token || !payload?.user) throw new Error("Invalid authentication response");
    localStorage.setItem("token", payload.token);
    localStorage.setItem("user", JSON.stringify(payload.user));
    setUser(payload.user);
  };

  const login = async (form) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", form);
      persist(data);
      toast.success("Welcome back");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (form) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", form);
      persist(data);
      toast.success(data.message || "Account created");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await api.post("/auth/logout").catch(() => {});
    clearSession();
  };

  const value = useMemo(() => ({ user, setUser, loading, login, signup, logout, isAdmin: user?.role === "admin" }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
