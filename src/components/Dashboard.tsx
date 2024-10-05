import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from './Card';

interface Customer {
    applicationNumber: string;
    username: string;
    address: string;
    phonenumber: string;
    ItemWeight: string;
    amount: string;
    PendingAmount: string;
    CurrentAmount: string;
    StaringDate: string;
    EndingDate: string;
    note: string;
    status: 'pending' | 'completed';
    images: string[]; // Will store image URLs or base64 strings
}

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [customers, setCustomers] = useState<Customer[]>([]);

    useEffect(() => {
        const storedCustomers = localStorage.getItem('customers');
        if (storedCustomers) {
            setCustomers(JSON.parse(storedCustomers));
        }
    }, []);

    // Calculate the total number of customers
    const totalCustomers = customers.length;

    // Calculate the number of customers with due dates (ending date passed)
    const dueDateCustomers = customers.filter(customer => {
        const endingDate = new Date(customer.EndingDate);
        const today = new Date();
        return endingDate < today;
    });

    // Calculate the number of customers with status 'pending'
    const pendingCustomers = customers.filter(customer => customer.status === 'pending');

    // Calculate the number of customers with status 'completed'
    const completedCustomers = customers.filter(customer => customer.status === 'completed');

    // Navigate and pass data to pages
    const handleCardClick = (page: string, data: Customer[]) => {
        navigate(page, { state: { data } });
    };

    const cardData = [
        { title: 'Total Customers', value: totalCustomers.toString(), page: '/all-customers', data: customers },
        { title: 'Due Date Customers', value: dueDateCustomers.length.toString(), page: '/due-customers', data: dueDateCustomers },
        { title: 'Pending Customers', value: pendingCustomers.length.toString(), page: '/pending-customers', data: pendingCustomers },
        { title: 'Completed Customers', value: completedCustomers.length.toString(), page: '/completed-customers', data: completedCustomers },
    ];

    return (
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cardData.map((data, idx) => (
                <Card
                    key={idx}
                    title={data.title}
                    value={data.value}
                    onClick={() => handleCardClick(data.page, data.data)}
                />
            ))}
        </div>
    );
};

export default Dashboard;
