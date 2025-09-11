import React from 'react';
import Icon from './Icon';

const Card = ({ icon, title, value, color, onClick }) => {
    const colorClasses = {
        blue: 'bg-blue-100 text-blue-600',
        green: 'bg-green-100 text-green-600',
        yellow: 'bg-yellow-100 text-yellow-600',
        red: 'bg-red-100 text-red-600',
        purple: 'bg-purple-100 text-purple-600',
    };
    return (
        <div onClick={onClick} className={`bg-white p-6 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer`}>
            <div className="flex items-center">
                <div className={`p-3 rounded-full ${colorClasses[color]}`}>
                    <Icon name={icon} className="w-7 h-7" />
                </div>
                <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                    <p className="text-gray-600 text-sm">{value}</p>
                </div>
            </div>
        </div>
    );
};

export default Card;
