import { createContext, useContext, useState, useEffect, useLayoutEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../api";
import { toast } from "sonner";

const AuthContext = createContext();

const publicRoutes = ["/home", "/login", "/signup", "/terms", "/privacy", "/contact"];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const login = async (email, password) => {
    try {
      const res = await axiosInstance.post("/auth/login", { email, password }, { withCredentials: true });
      localStorage.setItem("accessToken", res.data.accessToken);
      setUser(res.data.user);
      console.log("login successful", res);
      toast.success("Login successful");
      navigate("/dashboard");

    } catch (error) {
      toast.error(error.response.data.message);
      console.log({ status: error.status, data: error.response.data });
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post("/auth/logout", {}, { withCredentials: true });
      localStorage.removeItem("accessToken");
      setUser(null);
      navigate("/home");
    } catch (error) {
      console.log({ status: error.status, data: error.response.data });
    }
  };

  const checkAuth = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        setUser(null);
        if (!publicRoutes.includes(location.pathname)) {
          navigate("/login");
        }
        return;
      }
      const res = await axiosInstance.get("/user/profile", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setUser({
        id: res.data.id,
        email: res.data.email,
        name: res.data.name,
        createdAt: res.data.createdAt,
      });
    } catch (error) {
      console.log({ status: error.status, data: error.response.data });
      if (!publicRoutes.includes(location.pathname)) {
        navigate("/login");
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, checkAuth, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);