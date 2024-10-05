import React from 'react';

interface CardProps {
    title: string;
    value: string;
    onClick: () => void;
}

const Card: React.FC<CardProps> = ({ title, value, onClick }) => {
    return (
        <div
            className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
            onClick={onClick}
        >
            <h2 className="text-xl font-semibold">{title}</h2>
            <p className="mt-4 text-center text-gray-600 text-2xl">{value}</p>
        </div>
    );
};

export default Card;
