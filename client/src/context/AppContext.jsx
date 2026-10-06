import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import api from "../api/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AppContext = createContext(undefined);

export function AppContextProvider({ children }) {
  // auth state
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // state
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [activeProjects, setActiveProjects] = useState(null);
  const [loadingActiveProjects, setLoadingActiveProjects] = useState(true);
  const [chatLoading, setChatLoading] = useState(false);
  const [generatingProjects, setGeneratingProjects] = useState(false);
  const [activeFile, setActiveFile] = useState("./App.js");
  const [showCode, setShowCode] = useState(false);

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
      const { data } = await api.post("/api/auth/login", { email, password });
      setUser(data.user);
      toast.success("Welcome Back!");
      navigate("/");
    } catch (error) {
      console.error("Login Failed:", error);
      const errorMessage =
        error.response?.data?.error || "Invalid email or password.";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await api.post("/api/auth/register", {
        name,
        email,
        password,
      });
      setUser(data.user);
      toast.success("Account created successfully!");
      navigate("/");
    } catch (error) {
      console.error("Registration Failed:", error);
      const errorMessage =
        error.response?.data?.error || "Registration failed.";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    try {
      await api.post("/api/auth/logout");
      setUser(null);
      setProjects([]);
      setActiveProjects(null);
      toast.success("Logged out successfully!");
      navigate("/login");
    } catch (error) {
      console.error("Logout Failed:", error);
      toast.error("Failed to log out.");
    }
  };

  // projects actions
  const loadProjects = async () => {
    try {
      const { data } = await api.get("/api/projects");
      setProjects(data);
    } catch (error) {
      console.error("Failed to load projects:", error);
      toast.error("Failed to load projects.");
    } finally {
      setLoadingProjects(false);
    }
  };

  const loadProject = async (id, silent = false) => {
    if (!user) return;
    if (!silent) setLoadingActiveProjects(true);
    try {
      const { data } = await api.get("/api/projects");
      setActiveProjects(data);

      // default files section
      const files = Object.keys(data.files || {});
      if (files.length > 0) {
        setActiveFile((prev) => {
          if (files.includes(prev)) return prev;
          if (files.includes("./App.js")) return "./App.js";
          return files[0];
        });
      }
    } catch (error) {
      console.error("Failed to load project:", error);
      if (!silent) {
        toast.error("Failed to load project.");
        navigate("/");
      }
    } finally {
      if (!silent) setLoadingActiveProjects(false);
    }
  };

  // automatically load projects when user is set
  useEffect(() => {
    if (!activeProjects) return;

    const isOngoing =
      activeProjects?.status === "generating" ||
      activeProjects?.status === "pending" ||
      activeProjects?.status === "revising";

    if (isOngoing) {
      setChatLoading(true);
      const interval = setInterval(() => {
        loadProject(activeProjects._id, true);
        return () => clearInterval(interval);
      }, 2000);
    } else {
      setChatLoading(false);
    }
  }, [activeProjects?._id, activeProjects?.status, loadProject, user]);

  // generate project
  const handleGenerate = useCallback(
    async (prompt) => {
      if (!user) return;
      setGeneratingProjects(true);
      try {
        const { data } = await api.post("/api/projects", { prompt });
        toast.success("Project generation started!");
        navigate(`/builder/${data._id}`);
      } catch (error) {
        console.error("Failed to generate project:", error);
        toast.error("Failed to generate project.");
      } finally {
        setGeneratingProjects(false);
      }
    },
    [navigate, user],
  );

  // delete project
  const handleDelete = useCallback(
    async (id) => {
      if (!user) return;
      try {
        await api.delete(`/api/projects/${id}`);
        setProjects((prev) => prev.filter((project) => project._id !== id));
        toast.success("Project deleted successfully!");
      } catch (error) {
        console.error("Failed to delete project:", error);
        toast.error("Failed to delete project.");
      }
    },
    [user],
  );

  return (
    <AppContext
      value={{
        user,
        loadingUser,
        login,
        register,
        projects,
        loadingProjects,
        activeProjects,
        loadingActiveProjects,
        chatLoading,
        generatingProjects,
        activeFile,
        setActiveFile,
        showCode,
        setShowCode,
        handleGenerate,
        handleDelete,
        logout,
        loadProjects, 
        loadProject,
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
