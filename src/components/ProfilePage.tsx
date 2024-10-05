import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

interface Payment {
    date: string;
    amount: string;
}

interface FormData {
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
    status: 'pending' | 'completed';
    payments: Payment[];
}

const ProfilePage: React.FC = () => {
    const location = useLocation();
    const customerData = location.state as FormData;

    const [payments, setPayments] = useState<Payment[]>(customerData.payments);
    const [pendingAmount, setPendingAmount] = useState<string>(customerData.PendingAmount);

    if (!customerData) {
        return <div>No customer data available.</div>;
    }

    // Check if the due date has passed and if there's still pending amount
    const currentDate = new Date();
    const dueDate = new Date(customerData.EndingDate);
    const isDueDatePassed = dueDate.getTime() < currentDate.getTime();
    const hasPendingAmount = parseFloat(pendingAmount) > 0;

    // Check if the entire due is paid off
    const isDueCompleted = parseFloat(pendingAmount) === 0;

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
                    <p>{customerData.applicationNumber}</p>
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
                    <p>{customerData.phonenumber}</p>
                </div>
                <div>
                    <label>Item Weight:</label>
                    <p>{customerData.ItemWeight}</p>
                </div>
                <div>
                    <label>Amount:</label>
                    <p>{customerData.amount}</p>
                </div>
                <div>
                    <label>Pending Amount:</label>
                    <p>{pendingAmount}</p>
                </div>
                <div>
                    <label>Current Amount:</label>
                    <p>{customerData.CurrentAmount}</p>
                </div>
                <div>
                    <label>Starting Date:</label>
                    <p>{customerData.StaringDate}</p>
                </div>
                <div>
                    <label>Ending Date:</label>
                    <p>{customerData.EndingDate}</p>
                </div>
                <div>
                    <label>Status:</label>
                    <p>{customerData.status}</p>
                </div>

            </div>
            {customerData.payments && customerData.payments.length > 0 && (
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
                            {customerData.payments.map((payment, index) => (
                                <tr key={index} className="text-center">
                                    <td className="border p-2">{new Date(payment.date).toLocaleDateString()}</td>
                                    <td className="border p-2">{payment.amount}</td>
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
