import { createContext, useContext, useState, useEffect } from "react";
import { loginApi, signupApi, getProfileApi } from "../api/auth";
import api from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on refresh
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
            setUser(res.data);
            localStorage.setItem("user", JSON.stringify(res.data));
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

  // LOGIN
  const login = async (email, password) => {
    try {
      const res = await loginApi({ email, password });

      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(user);
    } catch (err) {
      // Fake login for UI testing
      const fakeUser = {
        name: "Shivam Sharma",
        email,
        role: "admin",
      };

      localStorage.setItem("token", "fake-token");
      localStorage.setItem("user", JSON.stringify(fakeUser));
      setUser(fakeUser);
    }
  };

  // SIGNUP
  const signup = async (email, password) => {
    try {
      const res = await signupApi({ email, password });

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(user);
    } catch (err) {
      // Fake signup (fallback)
      const fakeUser = {
        name: "New User",
        email,
        role: "police",
      };

      localStorage.setItem("token", "fake-token");
      localStorage.setItem("user", JSON.stringify(fakeUser));
      setUser(fakeUser);
    }
  };

  // LOGOUT
  const logout = () => {
    localStorage.clear();
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);