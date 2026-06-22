import { createContext, useContext, useEffect, useState } from "react";
import API from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await API.post("/api/auth/login", { email, password });

    localStorage.setItem("token", data.token);
    localStorage.setItem(
      "user",
      JSON.stringify({
        _id: data._id,
        name: data.name,
        email: data.email,
      })
    );

    setUser({
      _id: data._id,
      name: data.name,
      email: data.email,
    });

    return data;
  };

  const register = async (name, email, password) => {
    const { data } = await API.post("/api/auth/register", {
      name,
      email,
      password,
    });

    localStorage.setItem("token", data.token);
    localStorage.setItem(
      "user",
      JSON.stringify({
        _id: data._id,
        name: data.name,
        email: data.email,
      })
    );

    setUser({
      _id: data._id,
      name: data.name,
      email: data.email,
    });

    return data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);