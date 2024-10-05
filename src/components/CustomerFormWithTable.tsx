import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { RiDeleteBin5Fill } from "react-icons/ri";
import { FaRegEdit } from 'react-icons/fa';

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
  images: string[]; // Will store image URLs or base64 strings
}

export default function CustomerFormWithTable() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<FormData[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<FormData[]>([]);
  const [searchPhone, setSearchPhone] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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

  // Edit customer function (navigate to form page with customer data)
  const handleEdit = (customer: FormData) => {
    navigate('/addcustomer', { state: { customerData: customer } });
  };

  // Delete customer function
  const handleDelete = (index: number) => {
    const newCustomers = [...customers];
    newCustomers.splice(index, 1);
    setCustomers(newCustomers);
    setFilteredCustomers(newCustomers);
    localStorage.setItem('customers', JSON.stringify(newCustomers));
  };

  // Toggle status function
  const handleStatusChange = (index: number, newstatus: 'pending' | 'completed') => {
    const updatedCustomers = customers.map((customer, i) => {
      if (i === index) {
        return {
          ...customer,
          status: newstatus,
        };
      }
      return customer;
    });

    setCustomers(updatedCustomers);
    setFilteredCustomers(updatedCustomers);
    localStorage.setItem('customers', JSON.stringify(updatedCustomers));
  };

  // Handle image click to show in modal
  const handleImageClick = (image: string) => {
    setSelectedImage(image); // Set the clicked image as the selected image
  };

  const closeModal = () => {
    setSelectedImage(null); // Close the modal by resetting the selected image
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Customer List</h2>

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
            <th className="border p-2">Actions</th>
            <th className="border p-2">Notes</th>
            <th className="border p-2">Image</th>
          </tr>
        </thead>
        <tbody>
          {filteredCustomers.length > 0 ? (
            filteredCustomers.map((customer, index) => (
              <tr key={index} className="text-center">
                <td className="border p-2">
                  <Link to="/profile" state={customer} className="text-blue-500 hover:underline">{customer.applicationNumber}</Link>
                </td>
                <td className="border p-2">
                  <Link to="/profiles" state={customer} className="text-blue-500 hover:underline">
                    {customer.username}
                  </Link>
                </td>
                {/* Other customer details */}
                <td className="border p-2">{customer.address}</td>
                <td className="border p-2">{customer.phonenumber}</td>
                <td className="border p-2">{customer.ItemWeight}</td>
                <td className="border p-2">{customer.amount}</td>
                <td className="border p-2">{customer.PendingAmount}</td>
                <td className="border p-2">{customer.StaringDate}</td>
                <td className="border p-2">{customer.EndingDate}</td>
                {/* <td className="border p-2">{customer.status === 'pending' ? 'Pending' : 'Completed'}</td> */}
                <td className='border-2'>
                  <select className="border p-2 rounded" value={customer.status} onChange={(e) => handleStatusChange(index, e.target.value as 'pending' | 'completed')} >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                  </select>
                </td>
                <td className="border p-2 space-x-2">
                  <div className='flex gap-4'>
                    <button onClick={() => handleEdit(customer)} className="bg-blue-500 text-white p-2 rounded">
                      <FaRegEdit />
                    </button>
                    <button onClick={() => handleDelete(index)} className="bg-red-500 text-white p-2 rounded">
                      <RiDeleteBin5Fill />
                    </button>
                    {/* <button onClick={() => handleStatusChange(index)} className="bg-green-500 text-white p-2 rounded">
                      {customer.status === 'pending' ? <IoCheckmarkDoneSharp /> : <MdPendingActions />}
                    </button> */}
                  </div>
                </td>
                <td className="border p-2">{customer.note}</td>

                <td className="border p-2">
                  {customer.images && customer.images.length > 0 && (
                    <img
                      src={customer.images[0]} // Use the image URL directly
                      alt="Uploaded"
                      className="h-12 w-12 object-cover rounded cursor-pointer"
                      onClick={() => handleImageClick(customer.images[0])} // Handle image click
                    />
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
