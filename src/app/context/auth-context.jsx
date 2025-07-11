"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const cargarUsuarioDesdeToken = () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          setUsuario(decoded);
          setIsAuthenticated(true);
        } catch (err) {
          console.error("Token inválido", err);
          localStorage.removeItem("token");
          setUsuario(null);
          setIsAuthenticated(false);
        }
      } else {
        setUsuario(null);
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };

    cargarUsuarioDesdeToken();

    // Escucha cambios de localStorage (útil para otras pestañas o cambios dinámicos)
    window.addEventListener("storage", cargarUsuarioDesdeToken);

    return () => {
        window.removeEventListener("storage", cargarUsuarioDesdeToken);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setUsuario(null);
    setIsAuthenticated(false);
  };

  const login = (token) => {
  try {
    const decoded = jwtDecode(token);
    localStorage.setItem("token", token);
    setUsuario(decoded);
    setIsAuthenticated(true);
  } catch (err) {
    console.error("Token inválido", err);
  }
};


  return (
    <AuthContext.Provider
      value={{ usuario, isAuthenticated, logout, isLoading, login }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
