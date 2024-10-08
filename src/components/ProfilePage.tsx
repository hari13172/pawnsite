import React, { useEffect, useState } from 'react';
import { json, useParams } from 'react-router-dom';
import axios from 'axios';
import { FormData } from '../models/FormData';


const ProfilePage: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Fetch id from route params
    const [customerData, setCustomerData] = useState<FormData | null>(null);
    const [pendingAmount, setPendingAmount] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    // Fetch customer data when the component mounts
    useEffect(() => {
        const fetchCustomerData = async () => {
            try {
                const response = await axios.get(`http://172.20.0.26:8000/customers/${id}`);
                setCustomerData(response.data);
                setPendingAmount(response.data.PendingAmount);
            } catch (error) {
                console.error('Error fetching customer data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomerData();
    }, [id]); // Make sure to run this effect whenever the id changes

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!customerData) {
        return <div>No customer data available.</div>;
    }

    // Check if the due date has passed and if there's still pending amount
    const currentDate = new Date();
    const dueDate = new Date(customerData.end_date);
    const isDueDatePassed = dueDate.getTime() < currentDate.getTime();
    const hasPendingAmount = pendingAmount > 0;

    // Check if the entire due is paid off
    const isDueCompleted = pendingAmount === 0;
    // Safely parse the payment history or return an empty array if invalid
    const payment_dump = (() => {
        try {
            return JSON.parse(customerData.payment_history || '[]');
        } catch (error) {
            console.error("Error parsing payment history:", error);
            return [];
        }
    })();

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Customer Profile</h2>

            {/* Display a warning if the due date has passed and there is a pending amount */}
            {isDueDatePassed && hasPendingAmount && (
                <div className="text-red-500 font-bold mb-4">
                    ⚠️ The due date has passed for this customer!
                </div>
            )}

            {/* Display a message if due is completed */}
            {isDueCompleted && (
                <div className="text-green-500 font-bold mb-4">
                    ✅ All dues are completed!
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label>Application Number:</label>
                    <p>{customerData.app_no}</p>
                </div>
                <div>
                    <label>Username:</label>
                    <p>{customerData.username}</p>
                </div>
                <div>
                    <label>Address:</label>
                    <p>{customerData.address}</p>
                </div>
                <div>
                    <label>Phone Number:</label>
                    <p>{customerData.ph_no}</p>
                </div>
                <div>
                    <label>Item Weight:</label>
                    <p>{customerData.item_weight}</p>
                </div>
                <div>
                    <label>Amount:</label>
                    <p>{customerData.amount?.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }) || '-'}</p>
                </div>
                <div>
                    <label>Pending Amount:</label>
                    <p>{customerData.pending?.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }) || '-'}</p>
                </div>
                <div>
                    <label>Current Amount:</label>
                    <p>{customerData.current_amount?.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }) || '-'}</p>
                </div>
                <div>
                    <label>Starting Date:</label>
                    <p>{new Date(customerData.start_date).toLocaleDateString() || '-'}</p>
                </div>
                <div>
                    <label>Ending Date:</label>
                    <p>{new Date(customerData.end_date).toLocaleDateString() || '-'}</p>
                </div>
                <div>
                    <label>Status:</label>
                    <p>{customerData.status}</p>
                </div>
            </div>

            {payment_dump && payment_dump.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-2xl font-bold mb-4">Payment History</h3>
                    <table className="min-w-full bg-white border">
                        <thead>
                            <tr>
                                <th className="border p-2">Payment Date</th>
                                <th className="border p-2">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payment_dump.map((payment: any, index: any) => (
                                <tr key={index} className="text-center">
                                    <td className="border p-2">{new Date(payment.date).toLocaleDateString() || '-'}</td>
                                    <td className="border p-2">{payment.payment?.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }) || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
