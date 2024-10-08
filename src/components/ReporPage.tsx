import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FormData } from '../models/FormData';


export default function Report() {
    const [customers, setCustomers] = useState<FormData[]>([]);
    const [filteredCustomers, setFilteredCustomers] = useState<FormData[]>([]);
    const [searchPhone, setSearchPhone] = useState<string>('');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const navigate = useNavigate();



    // Load customers from local storage when the component mounts
    useEffect(() => {
        const storedCustomers = localStorage.getItem('customers');
        if (storedCustomers) {
            const parsedCustomers = JSON.parse(storedCustomers);
            setCustomers(parsedCustomers);
            setFilteredCustomers(parsedCustomers);
        }
    }, []);


    const handleViewProfile = (phonenumber: number) => {
        const customersWithSamePhone = customers.filter(customer => customer.ph_no === phonenumber);
        navigate('/profiles', { state: { customers: customersWithSamePhone } });
    };

    // Handle search for phone number filtering
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchPhone(query);
        if (query === '') {
            setFilteredCustomers(customers);
        } else {
            const filtered = customers.filter((customer) =>
                customer.ph_no.toString().includes(query)
            );
            setFilteredCustomers(filtered);
        }
    };

    // Handle image click to show in modal
    const handleImageClick = (image: string) => {
        setSelectedImage(image);
    };

    const closeModal = () => {
        setSelectedImage(null);
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
            "Notes",
            "image"
        ];

        const rows = filteredCustomers.map(customer => [
            customer.app_no,
            customer.username,
            customer.address,
            customer.ph_no,
            customer.item_weight,
            customer.amount,
            customer.pending,
            customer.start_date,
            customer.end_date,
            customer.status,
            customer.note,
            customer.image.join('|') // Joining image URLs or base64 strings with '|'
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(item => `"${item}"`).join(',')) // Wrap each item with quotes
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
                        <th className="border p-2">Image</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredCustomers.length > 0 ? (
                        filteredCustomers.map((customer, index) => (
                            <tr key={index} className="text-center">
                                <td className="border p-2">
                                    <Link to="/profile" state={customer} className="text-blue-500 hover:underline">
                                        {customer.app_no}
                                    </Link>
                                </td>
                                <td className="border p-2">
                                    <button
                                        onClick={() => handleViewProfile(customer.ph_no)}
                                        className="text-blue-500 hover:underline"
                                    >
                                        {customer.username}
                                    </button>
                                </td>
                                <td className="border p-2">{customer.address}</td>
                                <td className="border p-2">{customer.ph_no}</td>
                                <td className="border p-2">{customer.item_weight}</td>
                                <td className="border p-2">{customer.amount}</td>
                                <td className="border p-2">{customer.pending}</td>
                                <td className="border p-2">{customer.start_date}</td>
                                <td className="border p-2">{customer.end_date}</td>
                                <td className="border p-2">{customer.status === 'pending' ? 'Pending' : 'Completed'}</td>
                                <td className="border p-2">{customer.note}</td>
                                <td className="border p-2">
                                    {customer.image && customer.image.length > 0 ? (
                                        <img
                                            src={customer.image[0]}
                                            alt="Uploaded"
                                            onClick={() => handleImageClick(customer.image[0])}
                                            className="h-12 w-12 object-cover rounded cursor-pointer"
                                        />
                                    ) : (
                                        'No Image'
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={12} className="text-center p-4">No customers found</td>
                        </tr>
                    )}
                </tbody>
            </table>
            {selectedImage && <ImageModal image={selectedImage} onClose={closeModal} />}
        </div>
    );
}



// Modal Component for Image Preview
const ImageModal = ({ image, onClose }: { image: string; onClose: () => void }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg shadow-lg max-w-3xl max-h-screen">
                <img src={image} alt="Preview" className="max-w-full max-h-screen object-contain" />
                <button onClick={onClose} className="mt-4 bg-red-500 text-white p-2 rounded">
                    Close
                </button>
            </div>
        </div>
    );
};