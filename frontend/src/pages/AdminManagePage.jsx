import React from 'react';

const AdminManagePage = ({ title }) => {
    return (
        <div className="animate-fade-in-up">
            <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
            <p className="text-gray-500 mt-1">Halaman untuk mengelola {title.toLowerCase()}.</p>
        </div>
    );
};

export default AdminManagePage;
