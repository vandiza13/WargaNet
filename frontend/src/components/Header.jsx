import React from 'react';
import { Menu, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header = ({ setSidebarOpen }) => {
    const { userInfo } = useAuth();

    return (
        <header className="lg:hidden bg-white border-b border-slate-200 p-4 sticky top-0 z-30">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="text-slate-600"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <h1 className="text-xl font-bold text-slate-800">WargaNet</h1>
                </div>
                <div className="flex items-center gap-2">
                    <button className="relative text-slate-600">
                        <Bell className="w-5 h-5" />
                        {/* Notif badge can be added here */}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
