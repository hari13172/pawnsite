import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';


interface FormData {
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
}

export default function Report() {
    const [customers, setCustomers] = useState<FormData[]>([]);
    const [filteredCustomers, setFilteredCustomers] = useState<FormData[]>([]);
    const [searchPhone, setSearchPhone] = useState<string>('');

    // Load customers from local storage when the component mounts
    useEffect(() => {
        const storedCustomers = localStorage.getItem('customers');
        if (storedCustomers) {
            const parsedCustomers = JSON.parse(storedCustomers);
            setCustomers(parsedCustomers);
            setFilteredCustomers(parsedCustomers);
        }
    }, []);

    // Handle search for phone number filtering
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchPhone(query);
        if (query === '') {
            setFilteredCustomers(customers);
        } else {
            const filtered = customers.filter((customer) =>
                customer.phonenumber.includes(query)
            );
            setFilteredCustomers(filtered);
        }
    };

    // Function to download the data as CSV
    const downloadCSV = () => {
        const headers = [
            "Application Number",
            "Username",
            "Address",
            "Phone Number",
            "Item Weight",
            "Amount",
            "Pending Amount",
            "Starting Date",
            "Ending Date",
            "Status",
            "Notes"
        ];

        const rows = filteredCustomers.map(customer => [
            customer.applicationNumber,
            customer.username,
            customer.address,
            customer.phonenumber,
            customer.ItemWeight,
            customer.amount,
            customer.PendingAmount,
            customer.StaringDate,
            customer.EndingDate,
            customer.status,
            customer.note
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', 'customers_report.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Customer Report</h2>

            {/* Phone Number Filter */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Filter by phone number"
                    value={searchPhone}
                    onChange={handleSearch}
                    className="border p-2 rounded"
                />
            </div>

            {/* Download CSV Button */}
            <div className="mb-4">
                <button onClick={downloadCSV} className="bg-green-500 text-white p-2 rounded">
                    Download CSV
                </button>
            </div>

            {/* Table to Display Customer Data */}
            <table className="min-w-full bg-white border">
                <thead>
                    <tr>
                        {/* Table headers */}
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
                    {filteredCustomers.length > 0 ? (
                        filteredCustomers.map((customer, index) => (
                            <tr key={index} className="text-center">
                                <td className="border p-2">
                                    <Link to="/profile" state={customer} className="text-blue-500 hover:underline">
                                        {customer.applicationNumber}
                                    </Link>
                                </td>
                                <td className="border p-2">
                                    <Link to="/profile" state={customer} className="text-blue-500 hover:underline">
                                        {customer.username}
                                    </Link>
                                </td>
                                <td className="border p-2">{customer.address}</td>
                                <td className="border p-2">{customer.phonenumber}</td>
                                <td className="border p-2">{customer.ItemWeight}</td>
                                <td className="border p-2">{customer.amount}</td>
                                <td className="border p-2">{customer.PendingAmount}</td>
                                <td className="border p-2">{customer.StaringDate}</td>
                                <td className="border p-2">{customer.EndingDate}</td>
                                <td className="border p-2">{customer.status === 'pending' ? 'Pending' : 'Completed'}</td>
                                <td className="border p-2">{customer.note}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={12} className="text-center p-4">No customers found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
