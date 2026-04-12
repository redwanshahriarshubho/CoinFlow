import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase/firebase.config";
import axios from "axios";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

const API = import.meta.env.VITE_API_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDbUser = async (email) => {
    try {
      const token = localStorage.getItem("coinflow-token");
      const res = await axios.get(`${API}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDbUser(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const register = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password);

  const updateUser = (name, photo) =>
    updateProfile(auth.currentUser, { displayName: name, photoURL: photo });

  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const googleLogin = () =>
    signInWithPopup(auth, new GoogleAuthProvider());

  const logout = () => {
    localStorage.removeItem("coinflow-token");
    return signOut(auth);
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const res = await axios.post(`${API}/jwt`, { email: currentUser.email });
          localStorage.setItem("coinflow-token", res.data.token);
          await fetchDbUser(currentUser.email);
        } catch (err) {
          console.error(err);
        }
      } else {
        setDbUser(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const refetchDbUser = () => user && fetchDbUser(user.email);

  const value = {
    user,
    dbUser,
    loading,
    register,
    login,
    googleLogin,
    logout,
    updateUser,
    refetchDbUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};