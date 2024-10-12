import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Customer {
    applicationNumber: string;
    username: string;
    address: string;
    phonenumber: string;
    ItemWeight: string;
    amount: string;
    PendingAmount: string;
    StaringDate: string;
    EndingDate: string;
    note: string;
    status: 'pending' | 'completed';
    images: string[];
}

const CompletedCustomers: React.FC = () => {
    const [completedCustomers, setCompletedCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch completed customers from the API
    useEffect(() => {
        const fetchCompletedCustomers = async () => {
            try {
                const response = await axios.get('http://172.20.0.26:8000/completed_customers');
                setCompletedCustomers(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching completed customers:', error);
                setError('Error fetching completed customers.');
                setLoading(false);
            }
        };

        fetchCompletedCustomers();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Completed Customers</h2>

            <table className="min-w-full bg-white border">
                <thead>
                    <tr>
                        <th className="border p-2">Application Number</th>
                        <th className="border p-2">Username</th>
                        <th className="border p-2">Address</th>
                        <th className="border p-2">Phone Number</th>
                        <th className="border p-2">Item Weight</th>
                        <th className="border p-2">Amount</th>
                        <th className="border p-2">Pending Amount</th>
                        <th className="border p-2">Starting Date</th>
                        <th className="border p-2">Ending Date</th>
                        <th className="border p-2">Status</th>
                        <th className="border p-2">Notes</th>
                    </tr>
                </thead>
                <tbody>
                    {completedCustomers.map((customer, index) => (
                        <tr key={index} className="text-center">
                            <td className="border p-2">{customer.applicationNumber}</td>
                            <td className="border p-2">{customer.username}</td>
                            <td className="border p-2">{customer.address}</td>
                            <td className="border p-2">{customer.phonenumber}</td>
                            <td className="border p-2">{customer.ItemWeight}</td>
                            <td className="border p-2">{customer.amount}</td>
                            <td className="border p-2">{customer.PendingAmount}</td>
                            <td className="border p-2">{customer.StaringDate}</td>
                            <td className="border p-2">{customer.EndingDate}</td>
                            <td className="border p-2">{customer.status}</td>
                            <td className="border p-2">{customer.note}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CompletedCustomers;
