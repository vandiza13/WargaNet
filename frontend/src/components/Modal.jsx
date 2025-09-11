import React from 'react';
import { X } from 'lucide-react';
import Icon from './Icon'; // Kita impor komponen Ikon

const Modal = ({ isOpen, onClose, title, children, icon }) => { // Tambahkan 'icon' sebagai properti baru
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-start justify-center z-50 p-4 pt-15">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col animate-fade-in-up">
                <div className="flex justify-between items-center p-5 border-b border-gray-200">
                    {/* Grupkan ikon dan judul */}
                    <div className="flex items-center gap-3">
                        {icon && <Icon name={icon} className="w-6 h-6 text-primary-600" />}
                        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;

