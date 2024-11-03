import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { RiDeleteBin5Fill } from "react-icons/ri";
import { FaRegEdit } from 'react-icons/fa';
import { FormData } from '../models/FormData';
import axios from 'axios';
import { AiOutlineArrowUp, AiOutlineArrowDown } from 'react-icons/ai';
import { SERVER_IP } from '../api/endpoint';
import { accessToken } from '../api/axiosConfig';

export default function CustomerFormWithTable() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<FormData[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<FormData[]>([]);
  const [searchPhone, setSearchPhone] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<{ field: string; order: 'asc' | 'desc' | null }>({ field: '', order: null });
  // Fetch customers from the API when the component mounts
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response: any = await axios.get(`${SERVER_IP}/api/customers`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${accessToken()}`,
            'WWW-Authenticate': 'Bearer',
          },
        }).catch((err) => {
          if (err.status === 401) {
            navigate("/")
          }
          else {
            console.log(err, "errrorrrrr")
          }
        }); // Make a GET request to your API
        const fetchedCustomers = response.data;
        setCustomers(fetchedCustomers);
        setFilteredCustomers(fetchedCustomers);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };

    fetchCustomers();
  }, []);

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

  // Edit customer function (navigate to form page with customer data)
  const handleEdit = (customer: FormData) => {
    navigate(`/updatecustomer/${customer.app_no}`);
  };

  const handleViewProfile = (phonenumber: number) => {
    const customersWithSamePhone = customers.filter(customer => customer.ph_no === phonenumber);
    navigate('/profiles', { state: { customers: customersWithSamePhone } });
  };

  // Delete customer function
  const handleDelete = (index: number) => {
    const newCustomers = [...customers];
    newCustomers.splice(index, 1);
    setCustomers(newCustomers);
    setFilteredCustomers(newCustomers);
    localStorage.setItem('customers', JSON.stringify(newCustomers));
  };


  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleStatusChange = async (index: number) => {
    const customer = customers[index];
    const selectElement = document.getElementById(`status-${index}`) as HTMLSelectElement;
    const newStatus = selectElement.value as 'pending' | 'completed';
    const updatedCustomer = { ...customer, status: newStatus };

    try {
      // Send the PUT request to update the customer's status
      await axios.put(`${SERVER_IP}/api/customers/${customer.app_no}`, updatedCustomer, {
        headers: {
          Authorization: `Bearer ${accessToken()}`,
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

      // If the API call is successful, update the state
      const updatedCustomers = customers.map((cust, i) => {
        if (i === index) {
          return updatedCustomer;
        }
        return cust;
      });

      setCustomers(updatedCustomers);
      setFilteredCustomers(updatedCustomers);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  // Handle image click to show in modal
  const handleImageClick = (image: string) => {
    setSelectedImage(image); // Set the clicked image as the selected image
  };

  const closeModal = () => {
    setSelectedImage(null); // Close the modal by resetting the selected image
  };

  // Handle sorting
  const handleSort = (field: keyof FormData) => {
    let sortedCustomers = [...filteredCustomers];
    const order = sortOrder.field === field && sortOrder.order === 'asc' ? 'desc' : 'asc';

    sortedCustomers.sort((a, b) => {
      if (a[field] < b[field]) return order === 'asc' ? -1 : 1;
      if (a[field] > b[field]) return order === 'asc' ? 1 : -1;
      return 0;
    });

    setSortOrder({ field, order });
    setFilteredCustomers(sortedCustomers);
  };

  //arrow icon
  const getArrowIcon = (field: string) => {
    if (sortOrder.field === field) {
      return sortOrder.order === 'asc' ? <AiOutlineArrowUp /> : <AiOutlineArrowDown />;
    }
    return null;
  };

  // Count occurrences of phone numbers
  const countPhoneOccurrences = (customers: FormData[]) => {
    const phoneCountMap: { [key: string]: number } = {};
    customers.forEach(customer => {
      phoneCountMap[customer.ph_no] = (phoneCountMap[customer.ph_no] || 0) + 1;
    });
    return phoneCountMap;
  };

  // Get the phone number occurrences count
  const phoneOccurrences = countPhoneOccurrences(filteredCustomers);

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

      {/* Status Filter Dropdown */}
      <div className="mb-4">
        <label>Status Filter: </label>
        <select
          className="border p-2 rounded"
          onChange={(e) => {
            const statusFilter = e.target.value;
            if (statusFilter === 'all') {
              setFilteredCustomers(customers);
            } else {
              const filtered = customers.filter(customer => customer.status === statusFilter);
              setFilteredCustomers(filtered);
            }
          }}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Table to Display Customer Data */}
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            {/* Table headers */}
            {['app_no', 'username', 'ph_no'].map((field, idx) => (
              <th
                key={idx}
                className="border p-2 group relative cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort(field as keyof FormData)}
              >
                <div className="flex items-center justify-between">
                  {field.replace('_', ' ').toUpperCase()}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out">
                    {getArrowIcon(field)}
                  </div>
                </div>
              </th>
            ))}
            <th className="border p-2">Same Customer</th>
            <th className="border p-2">Address</th>
            {/* <th className="border p-2">Phone Number</th> */}
            <th className="border p-2">Item Weight</th>
            <th className="border p-2">Amount</th>
            <th className="border p-2">Pending Amount</th>
            <th className="border p-2">Starting Date</th>
            <th className="border p-2">Ending Date</th>
            <th className="border p-2">Actions</th>
            <th className="border p-2">Notes</th>
            <th className="border p-2">Image</th>
          </tr>
        </thead>
        <tbody>
          {filteredCustomers.length > 0 ? (
            filteredCustomers.slice().map((customer, index) => (
              <tr key={index} className="text-center">
                <td className="border p-2">
                  <Link to={`/customers/${customer.app_no}`} state={customer} className="text-blue-500 hover:underline">{customer.app_no}</Link>
                </td>

                {/* <td className="border p-2">
                  <Link to={`/customers/${customer.app_no}`} state={customer} className="text-blue-500 hover:underline">
                    {phoneOccurrences[customer.ph_no] > 1 ? `${phoneOccurrences[customer.ph_no]} ` : ''}{customer.app_no}
                  </Link>
                </td> */}
                <td className="border p-2">
                  <button
                    onClick={() => handleViewProfile(customer.ph_no)}
                    className="text-blue-500 hover:underline"
                  >
                    {customer.username}
                  </button>
                </td>
                {/* Other customer details */}
                <td className="border p-2">{customer.ph_no}</td>
                <td className="border p-2">{phoneOccurrences[customer.ph_no]}</td>
                <td className="border p-2">{customer.address}</td>
                <td className="border p-2">{customer.item_weight}</td>
                <td className="border p-2">{customer.amount}</td>
                <td className="border p-2">{customer.pending}</td>
                <td className="border p-2">{customer.start_date}</td>
                <td className="border p-2" onChange={() => handleStatusChange(index)}>{customer.end_date}</td>
                <td className="border p-2 space-x-2">
                  <div className='flex gap-4'>
                    <button onClick={() => handleEdit(customer)} className="bg-blue-500 text-white p-2 rounded">
                      <FaRegEdit />
                    </button>
                    <button onClick={() => handleDelete(index)} className="bg-red-500 text-white p-2 rounded">
                      <RiDeleteBin5Fill />
                    </button>
                  </div>
                </td>
                <td className="border p-2">{customer.note}</td>

                <td className="border p-2">
                  {customer.image && customer.image.length > 0 && (
                    <img
                      src={`${SERVER_IP}` + customer.image} // Use the image URL directly
                      alt="Uploaded"
                      className="h-12 w-12 object-cover rounded cursor-pointer"
                      onClick={() => handleImageClick(`${SERVER_IP}` + customer.image)} // Handle image click
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
  const handleClickOutside = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // Check if the clicked element is the background (modal overlay)
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      onClick={handleClickOutside}  // Add onClick handler to the background
    >
      <div className="relative bg-white p-8 rounded-lg shadow-lg max-w-3xl max-h-screen">
        {/* Close button positioned in the top-right corner */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-red-500 text-white p-2 px-4 rounded-full text-4xl"
        >
          &times;
        </button>

        {/* Image */}
        <img src={image} alt="Preview" className="max-w-full max-h-screen object-contain" />
      </div>
    </div>
  );
};
