import React from 'react';
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
    note: string;
    status: 'pending' | 'completed';
    payments?: Payment[];
}

const Profile: React.FC = () => {
    const location = useLocation();
    const customerData = location.state as FormData;

    if (!customerData) {
        return <div>No customer data available.</div>;
    }

    return (
        <div className="p-6">
            <h2 className="text-3xl font-bold mb-6">Customer Profile</h2>

            <div className="flex items-center mb-6">
                {/* Profile Image */}
                <img
                    src={`https://via.placeholder.com/150`} // Placeholder image
                    alt="Profile"
                    className="rounded-full h-24 w-24 mr-4"
                />
                <div>
                    <h3 className="text-xl font-bold">{customerData.username}</h3>
                    <p className="text-gray-600">{customerData.address}</p>
                    <p className="text-gray-600">{customerData.phonenumber}</p>
                </div>
            </div>

            {/* Customer Data Table */}
            <h3 className="text-2xl font-bold mb-4">Customer Details</h3>
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
                    <tr className="text-center">
                        <td className="border p-2">{customerData.applicationNumber}</td>
                        <td className="border p-2">{customerData.username}</td>
                        <td className="border p-2">{customerData.address}</td>
                        <td className="border p-2">{customerData.phonenumber}</td>
                        <td className="border p-2">{customerData.ItemWeight}</td>
                        <td className="border p-2">{customerData.amount}</td>
                        <td className="border p-2">{customerData.PendingAmount}</td>
                        <td className="border p-2">{customerData.StaringDate}</td>
                        <td className="border p-2">{customerData.EndingDate}</td>
                        <td className="border p-2">{customerData.status === 'pending' ? 'Pending' : 'Completed'}</td>
                        <td className="border p-2">{customerData.note}</td>
                    </tr>
                </tbody>
            </table>

            {/* Display Payment Log if available */}
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

export default Profile;
