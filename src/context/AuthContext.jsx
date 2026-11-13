import { createContext, useContext } from "react";

export const AuthContext = createContext({
  currentUser: null,
  onLogout: () => {},
});

export const useAuth = () => useContext(AuthContext);