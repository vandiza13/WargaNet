import React from 'react';
import Icon from './Icon';

const PlaceholderPage = ({ title, icon }) => (
    <div className="text-center p-10 bg-white rounded-lg shadow-md animate-fade-in-up">
        <Icon name={icon} className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{title}</h1>
        <p className="text-gray-500">Fitur ini sedang dalam pengembangan dan akan segera tersedia.</p>
    </div>
);

export default PlaceholderPage;
