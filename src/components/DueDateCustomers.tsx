import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { SERVER_IP } from '../api/endpoint';
import { accessToken } from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

interface Customer {
    app_no: string;
    username: string;
    address: string;
    ph_no: string;
    item_weight: string;
    amount: string;
    pending: string;
    start_date: string;
    end_date: string;
    note: string;
    status: 'pending' | 'completed';
    images: string[];
}

const DueDateCustomers: React.FC = () => {
    const [dueDateCustomers, setDueDateCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate()

    useEffect(() => {
        const fetchDueCustomers = async () => {
            try {
                const response: any = await axios.get(`${SERVER_IP}/api/due_customers`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'WWW-Authenticate': 'Bearer',
                    },
                }).catch((err) => {
                    if (err.status === 401) {
                        navigate("/")
                    }
                    else {
                        console.log(err, "errrorrrrr")
                    }
                });
                setDueDateCustomers(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching due customers:', error);
                setError('Error fetching due customers.');
                setLoading(false);
            }
        };

        fetchDueCustomers();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Due Date Customers</h2>

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
                    {dueDateCustomers.map((customer, index) => (
                        <tr key={index} className="text-center">
                            <td className="border p-2">{customer.app_no}</td>
                            <td className="border p-2">{customer.username}</td>
                            <td className="border p-2">{customer.address}</td>
                            <td className="border p-2">{customer.ph_no}</td>
                            <td className="border p-2">{customer.item_weight}</td>
                            <td className="border p-2">{customer.amount}</td>
                            <td className="border p-2">{customer.pending}</td>
                            <td className="border p-2">{customer.start_date}</td>
                            <td className="border p-2">{customer.end_date}</td>
                            <td className="border p-2">{customer.status}</td>
                            <td className="border p-2">{customer.note}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DueDateCustomers;
