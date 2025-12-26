// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      try {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (storedUser && token) {
          // Cek apakah storedUser valid JSON
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error("⚠️ Data Login Rusak/Corrupt. Melakukan Logout paksa...", error);
        // Jika data rusak, hapus semuanya biar bersih
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        // Apapun yang terjadi, loading harus selesai agar layar tampil
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const data = await loginUser(email, password);
      // Pastikan backend mengembalikan object user yang benar
      if (!data.user || !data.token) {
          throw new Error("Respon server tidak valid (User/Token hilang)");
      }
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user)); // Simpan sebagai String JSON
      setUser(data.user);
      return true;
    } catch (error) {
      console.error("Login Error:", error);
      throw error.response?.data?.message || 'Login gagal';
    }
  };

  const register = async (nama, noRumah, email, password) => {
    try {
      await registerUser(nama, noRumah, email, password);
      return true;
    } catch (error) {
      throw error.response?.data?.message || 'Registrasi gagal';
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    // Opsional: Redirect paksa ke login bisa dilakukan di komponen UI
    window.location.href = '/auth'; 
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};