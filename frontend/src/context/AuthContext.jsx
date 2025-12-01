import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  // Cargar usuario desde localStorage al iniciar
  const [usuario, setUsuario] = useState(() => {
    try {
      const saved = localStorage.getItem("usuario");
      if (!saved) return null;
      return JSON.parse(saved);
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem("token") || null);

  // ⬆️ Cada vez que cambia usuario o token → guardamos
  useEffect(() => {
    if (usuario) localStorage.setItem("usuario", JSON.stringify(usuario));
    else localStorage.removeItem("usuario");
  }, [usuario]);

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  // 🔐 LOGIN con JWT
  const login = async ({ nombreDeUsuario, contrasena }) => {
    try {
      const data = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ nombreDeUsuario, contrasena }),
      });

      // Caso especial: si no tiene rol
      if (data.needsRoleSelection) {
        localStorage.setItem("userId", data.userId);
        navigate("/botones-rol");
        return true;
      }

      // Guardamos el usuario + token
      setUsuario(data.user);
      setToken(data.token);

      navigate("/");

      return true;

    } catch (error) {
      console.error("Error en login:", error);
      return false;
    }
  };

  // 🚪 LOGOUT
  const logout = () => {
    setUsuario(null);
    setToken(null);
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ usuario, token, login, logout, setUsuario }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
