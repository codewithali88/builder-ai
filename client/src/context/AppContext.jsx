import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AppContext = createContext(undefined);

export function AppContextProvider({ children }) {
  // auth state
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const navigate = useNavigate();

  // auth actions
  const checkSession = async () => {
    try {
      const { data } = await api.get("/api/auth/me");
      setUser(data.user);
    } catch (err) {
      setUser(null);
    } finally {
      setLoadingUser(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const login = async (email, password) => {
    try {
      const {data} = await api.post("/api/auth/login", { email, password });
      setUser(data.user);
      toast.success("Welcome Back!");
      navigate("/");
    } catch (error) {
      console.error("Login Failed:", error);
      const errorMessage = error.response?.data?.error || "Invalid email or password.";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  }

  const register = async (name, email, password) => {
    try {
      const {data} = await api.post("/api/auth/register", { name, email, password });
      setUser(data.user);
      toast.success("Account created successfully!");
      navigate("/");
    } catch (error) {
      console.error("Registration Failed:", error);
      const errorMessage = error.response?.data?.error || "Registration failed.";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  }

  return (
    <AppContext
      value={{
        user,
        loadingUser,
        login,
        register
      }}
    >
      {children}
    </AppContext>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within a AppContextProvider");
  }
  return context;
}
