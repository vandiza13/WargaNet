import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUserInfo = localStorage.getItem('userInfo');
        if (storedUserInfo) {
            try {
                const decodedToken = jwtDecode(JSON.parse(storedUserInfo).token);
                if (decodedToken.exp * 1000 < Date.now()) {
                    logout();
                } else {
                    setUserInfo(JSON.parse(storedUserInfo));
                }
            } catch (error) {
                console.error("FAILED to decode token:", error);
                logout();
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const { data } = await API.post('/auth/login', { email, password });
            localStorage.setItem('userInfo', JSON.stringify(data));
            setUserInfo(data);
        } catch (error) {
            throw error.response.data.message || 'Login Gagal';
        }
    };

    const register = async (nama, noRumah, email, password) => {
        try {
            const { data } = await API.post('/auth/register', { nama, noRumah, email, password });
            // Tidak login otomatis, user harus menunggu approval
            return data;
        } catch (error) {
            throw error.response.data.message || 'Registrasi Gagal';
        }
    };

    const logout = () => {
        localStorage.removeItem('userInfo');
        setUserInfo(null);
        window.location.hash = 'login';
    };

    const updateUserInfo = (newUserData) => {
        setUserInfo(currentUserInfo => {
            const updatedInfo = { ...currentUserInfo, ...newUserData };
            localStorage.setItem('userInfo', JSON.stringify(updatedInfo));
            return updatedInfo;
        });
    };

    const value = {
        userInfo,
        loading,
        login,
        register,
        logout,
        updateUserInfo,
    };

    return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

// Pastikan baris export ini ada dan benar
export const useAuth = () => useContext(AuthContext);

