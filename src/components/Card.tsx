import React from 'react';

interface CardProps {
    title: string;
    value: string;
}

const Card: React.FC<CardProps> = ({ title, value }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">{title}</h2>
            <p className="mt-4 text-gray-600">{value}</p>
        </div>
    );
};

export default Card;
