import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/api";

const AppContext = createContext(undefined);

export function AppContextProvider({ children }) {
  // auth state
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // auth actions
  const checkSession = async () => {
    try {
      const { data } = await api.get("/api/auth/me");
      // setUser(data.user);
    } catch (err) {
      setUser(null);
    } finally {
      setLoadingUser(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  return (
    <AppContext
      value={{
        user,
        loadingUser,
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
