import { createContext, useContext, useState, useEffect } from "react";
import { loginApi, signupApi, getProfileApi } from "../api/auth";
import api from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      if (storedUser) {
        setUser(JSON.parse(storedUser));
        setLoading(false);
      } else {
        getProfileApi()
          .then((res) => {
            // backend returns { success, data: { userId, name, email, role } }
            const userData = res.data.data;
            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData));
          })
          .catch(() => {
            localStorage.clear();
            setUser(null);
          })
          .finally(() => setLoading(false));
      }
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await loginApi({ email, password });
    // backend returns { success, token, expiresIn, user: { _id, name, role } }
    const { token, user: userData } = res.data;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUser(userData);
  };

  const signup = async (name, email, password) => {
    const res = await signupApi({ name, email, password });
    // backend returns { _id, name, email, role, token }
    const { token, name: uName, email: uEmail, role, _id } = res.data;
    const userData = { _id, name: uName, email: uEmail, role };
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUser(userData);
  };

  const logout = () => {
    localStorage.clear();
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);