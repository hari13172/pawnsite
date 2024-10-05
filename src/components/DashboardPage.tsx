import React from 'react';
import Card from './Card';

const Dashboard: React.FC = () => {
    const cardData = [
        { title: 'Total Customers', value: '1,200' },
        { title: 'Total Loans', value: '$450,000' },
        { title: 'Pending Approvals', value: '24' },
        { title: 'Revenue', value: '$320,000' },
    ];

    return (
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cardData.map((data, idx) => (
                <Card key={idx} title={data.title} value={data.value} />
            ))}
        </div>
    );
};

export default Dashboard;
