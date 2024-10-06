import React from 'react';
import { Link, useLocation } from 'react-router-dom';

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

const Profile: React.FC = () => {
    const location = useLocation();

    // Ensure that location.state and location.state.customers are defined
    const customers = location.state?.customers as Customer[] | undefined;

    if (!customers || customers.length === 0) {
        return <div>No customer data available.</div>;
    }

    const firstCustomer = customers[0];

    // Default logo URL in case no profile image is provided
    const defaultLogo = "https://via.placeholder.com/150"; // Replace this with your default logo URL if you have one

    return (
        <div className="p-6">
            <h2 className="text-3xl font-bold mb-6">Customer Profile</h2>

            <div className="flex items-center mb-6">
                {/* Profile Image or Default Logo */}
                <img
                    src={firstCustomer.images && firstCustomer.images.length > 0 ? firstCustomer.images[0] : defaultLogo}
                    alt="Profile"
                    className="rounded-full h-24 w-24 mr-4"
                />
                <div>
                    <h3 className="text-xl font-bold">{firstCustomer.username}</h3>
                    <p className="text-gray-600">{firstCustomer.address}</p>
                    <p className="text-gray-600">{firstCustomer.phonenumber}</p>
                </div>
            </div>

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
                    {customers.map((customer, index) => (
                        <tr key={index} className="text-center">
                            <td className="border p-2">
                                <Link to="/profile" state={customer} className="text-blue-500 hover:underline">
                                    {customer.applicationNumber}
                                </Link>
                            </td>
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

export default Profile;
