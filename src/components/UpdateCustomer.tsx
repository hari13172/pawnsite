import React, { useEffect, useState } from 'react';
import { ChangeEvent, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { axiosInstance } from '../api/axiosConfig';
import { PUT_URL, SERVER_IP } from '../api/endpoint';
import axios from 'axios';

// Types for data
interface Payment {
    date: string;
    amount: number;
}

interface FormData {
    app_no: number;
    username: string;
    address: string;
    ph_no: number;
    item_weight: number;
    amount: number;
    pending: number;
    current_amount: number;
    start_date: string;
    end_date: string;
    note: string;
    image: File[];  // Changed to File[] to store the file objects
    status: 'pending' | 'completed';
    payments: Payment[];
}

interface FormErrors {
    app_no?: string;
    username?: string;
    address?: string;
    ph_no?: string;
    item_weight?: string;
    amount?: string;
    pending?: string;
    current_amount?: string;
    start_date?: string;
    end_date?: string;
    note?: string;
}

const UpdateCustomer: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        app_no: 0,
        username: "",
        address: "",
        ph_no: 0,
        item_weight: 0,
        amount: 0,
        pending: 0,
        current_amount: 0,
        start_date: "",
        end_date: "",
        note: "",
        image: [],
        status: 'pending',
        payments: []
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>(); // Fetch id from route params
    const [, setLoading] = useState(true);



    // Fetch customer data when the component mounts
    useEffect(() => {
        const fetchCustomerData = async () => {
            try {
                const response = await axios.get(`${SERVER_IP}/api/customers/${id}`);
                const customerData = response.data;
                setFormData({
                    ...customerData,
                    current_amount: 0, // Reset current amount to avoid conflict
                });
            } catch (error) {
                console.error('Error fetching customer data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomerData();
    }, [id]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setFormData((prevFormData) => {
            let updatedFormData = { ...prevFormData, [name]: value };

            return updatedFormData;
        });
    };




    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            // Ensure we are storing an array of file objects
            setFormData({
                ...formData,
                image: files,  // Store the file(s) as an array of File objects
            });
        }
    };


    const validate = (): boolean => {
        let tempErrors: FormErrors = {};
        const phoneRegex = /^[0-9]{10}$/;
        const weightRegex = /^[0-9]+(\.[0-9]{1,2})?$/;
        const amountRegex = /^[0-9]+(\.[0-9]{1,2})?$/;

        if (!formData.app_no) tempErrors.app_no = "Application number is required";
        if (!formData.username) tempErrors.username = "Username is required";
        if (!formData.address) tempErrors.address = "Address is required";
        if (!phoneRegex.test(String(formData.ph_no))) tempErrors.ph_no = "Phone number must be 10 digits";
        if (!weightRegex.test(String(formData.item_weight))) tempErrors.item_weight = "Weight should be a valid number";
        if (!amountRegex.test(String(formData.amount))) tempErrors.amount = "Amount should be a valid number";
        if (!amountRegex.test(String(formData.pending))) tempErrors.pending = "Pending amount should be a valid number";
        if (!amountRegex.test(String(formData.current_amount))) tempErrors.current_amount = "Current amount should be a valid number";
        if (!formData.start_date) tempErrors.start_date = "Starting Date is required";
        if (!formData.end_date) tempErrors.end_date = "Ending Date is required";

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (validate()) {
            try {
                const formDataToSend = new FormData();

                // Append other form fields to FormData
                formDataToSend.append('app_no', String(formData.app_no));
                formDataToSend.append('username', formData.username);
                formDataToSend.append('address', formData.address);
                formDataToSend.append('ph_no', String(formData.ph_no));
                formDataToSend.append('item_weight', String(formData.item_weight));
                formDataToSend.append('amount', String(formData.amount));
                formDataToSend.append('pending', String(formData.pending));
                formDataToSend.append('current_amount', String(formData.current_amount));
                formDataToSend.append('start_date', formData.start_date);
                formDataToSend.append('end_date', formData.end_date);
                formDataToSend.append('note', formData.note);
                formDataToSend.append('status', formData.status);

                // Check if image is an array of files, then append each file to formDataToSend
                if (Array.isArray(formData.image)) {
                    formData.image.forEach((file) => {
                        formDataToSend.append('image', file);  // Send as a file
                    });
                }

                // Make the PUT request using axiosInstance
                const response = await axiosInstance.put(PUT_URL + id, formDataToSend, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                console.log("Customer updated successfully", response.data);
                navigate('/customers');
            } catch (error) {
                console.error('Error updating customer:', error);
            }
        }
    };


    const handleStatusChange = async (newStatus: 'pending' | 'completed') => {
        try {
            const updatedFormData = { ...formData, status: newStatus };

            // Send the PUT request to update the customer's status
            // await axios.put(`http://172.20.0.26/api:8000/customers/${formData.app_no}`, updatedFormData);

            // If the API call is successful, update the formData state
            setFormData(updatedFormData);

            console.log('Status updated successfully');
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    return (
        <div className='p-6'>
            <h2 className='text-2xl font-bold mb-6'>Customer Update Form</h2>
            <form onSubmit={handleSubmit}>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    {/* Application Number */}
                    <div>
                        <label className='block'>Application Number</label>
                        <input
                            type="number"
                            name='app_no'
                            value={formData.app_no}
                            onChange={handleInputChange}
                            className='w-full p-2 border border-gray-300 rounded mt-1'
                        />
                        {errors.app_no && <span className='text-red-500'>{errors.app_no}</span>}
                    </div>

                    {/* Username */}
                    <div>
                        <label className='block'>Username</label>
                        <input
                            type="text"
                            name='username'
                            value={formData.username}
                            onChange={handleInputChange}
                            className='w-full p-2 border border-gray-300 rounded mt-1'
                        />
                        {errors.username && <span className='text-red-500'>{errors.username}</span>}
                    </div>

                    {/* Address */}
                    <div>
                        <label className='block'>Address</label>
                        <input
                            type="text"
                            name='address'
                            value={formData.address}
                            onChange={handleInputChange}
                            className='w-full p-2 border border-gray-300 rounded mt-1'
                        />
                        {errors.address && <span className='text-red-500'>{errors.address}</span>}
                    </div>

                    {/* Phone Number */}
                    <div>
                        <label className='block'>Phone Number</label>
                        <input
                            type="number"
                            name='ph_no'
                            value={formData.ph_no}
                            onChange={handleInputChange}
                            className='w-full p-2 border border-gray-300 rounded mt-1'
                        />
                        {errors.ph_no && <span className='text-red-500'>{errors.ph_no}</span>}
                    </div>

                    {/* Item Weight */}
                    <div>
                        <label className='block'>Item Weight</label>
                        <input
                            type="number"
                            name='item_weight'
                            value={formData.item_weight}
                            onChange={handleInputChange}
                            className='w-full p-2 border border-gray-300 rounded mt-1'
                        />
                        {errors.item_weight && <span className='text-red-500'>{errors.item_weight}</span>}
                    </div>

                    {/* Amount */}
                    <div>
                        <label className='block'>Amount</label>
                        <input
                            type="number"
                            name='amount'
                            value={formData.amount}
                            onChange={handleInputChange}
                            className='w-full p-2 border border-gray-300 rounded mt-1'
                        />
                        {errors.amount && <span className='text-red-500'>{errors.amount}</span>}
                    </div>


                    {/* Start Date */}
                    <div>
                        <label className='block'>Starting Date</label>
                        <input
                            type="date"
                            name='start_date'
                            value={formData.start_date}
                            onChange={handleInputChange}
                            className='w-full p-2 border border-gray-300 rounded mt-1'
                        />
                        {errors.start_date && <span className='text-red-500'>{errors.start_date}</span>}
                    </div>

                    {/* End Date */}
                    <div>
                        <label className='block'>Ending Date</label>
                        <input
                            type="date"
                            name='end_date'
                            value={formData.end_date}
                            onChange={handleInputChange}
                            className='w-full p-2 border border-gray-300 rounded mt-1'
                        />
                        {errors.end_date && <span className='text-red-500'>{errors.end_date}</span>}
                    </div>

                    {/* Pending Amount */}
                    <div>
                        <label className='block'>Pending Amount</label>
                        <input
                            type="number"
                            name='pending'
                            disabled
                            value={formData.pending}
                            className='w-full p-2 border border-gray-300 rounded mt-1'
                        />
                        {errors.pending && <span className='text-red-500'>{errors.pending}</span>}
                    </div>

                    {/* Current Amount */}
                    <div>
                        <label className='block'>Current Amount</label>
                        <input
                            placeholder='0'
                            type="number"
                            name='current_amount'
                            value={formData.current_amount}
                            onChange={handleInputChange}
                            className='w-full p-2 border border-gray-300 rounded mt-1'
                        />
                        {errors.current_amount && <span className='text-red-500'>{errors.current_amount}</span>}
                    </div>


                    {/* Note */}
                    <div>
                        <label className='block'>Note</label>
                        <input
                            type="text"
                            name='note'
                            value={formData.note}
                            onChange={handleInputChange}
                            className='w-full p-2 border border-gray-300 rounded mt-1'
                        />
                        {errors.note && <span className='text-red-500'>{errors.note}</span>}
                    </div>

                    <div className='border-2 p-2'>
                        <select className="border p-2 rounded" value={formData.status} onChange={(e) => handleStatusChange(e.target.value as 'pending' | 'completed')} >
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className='block'>Upload Image</label>
                        <input
                            type="file"
                            name='image'
                            multiple
                            onChange={handleImageUpload}
                            className='w-full p-2 border border-gray-300 rounded mt-1'
                            accept='image/*'
                        />
                    </div>
                </div>

                <div className='mt-6'>
                    <button className="bg-blue-500 text-white p-3 rounded mr-4" type='submit'>
                        {id ? "Update" : "Save"}
                    </button>
                    {/* <button onClick={handleReset} className="bg-blue-500 text-white p-3 rounded mr-4" type='button'>Reset</button> */}
                </div>
            </form>
        </div>
    );
};

export default UpdateCustomer;
