import React, { useEffect, useState } from 'react';
import { ChangeEvent, FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { axiosInstance } from '../api/axiosConfig';
import { FORM_URL } from '../api/endpoint';

// Types for data
interface Payment {
    date: string;
    amount: number;
}

interface FormData {
    app_no: number | ''; // Ensures a default value
    username: string;
    address: string;
    ph_no: number | '';  // Ensures a default value
    item_weight: number | ''; // Ensures a default value
    amount: number | ''; // Ensures a default value
    pending: number | ''; // Ensures a default value
    current_amount: number | ''; // Ensures a default value
    start_date: string;
    end_date: string;
    note: string;
    image: File[]; // Changed to File[] to store the file objects
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

const CustomerPage: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        app_no: 0, // Default to empty string
        username: "",
        address: "",
        ph_no: 0, // Default to empty string
        item_weight: 0, // Default to empty string
        amount: 0, // Default to empty string
        pending: 0, // Default to empty string
        current_amount: 0, // Default to empty string
        start_date: "",
        end_date: "",
        note: "",
        image: [],
        status: 'pending',
        payments: []
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const navigate = useNavigate();
    const location = useLocation();

    const handleReset = () => {
        setFormData({
            app_no: '',
            username: "",
            address: "",
            ph_no: '',
            item_weight: '',
            amount: '',
            pending: '',
            current_amount: '',
            start_date: "",
            end_date: "",
            note: "",
            image: [],
            status: 'pending',
            payments: []
        });
        setErrors({});
    };

    const fetchCustomerByPhone = async (phone: string) => {
        try {
            const response = await axiosInstance.get(`http://172.20.0.26:8000/filter/${phone}`);
            const customerData = response.data[0];
            console.log(customerData)
            if (customerData) {
                setFormData({
                    ...formData,
                    username: customerData.username,
                    address: customerData.address,
                    ph_no: customerData.ph_no,
                });
            }
        } catch (error) {
            console.error('Error fetching customer by phone number:', error);
        }
    };

    const handlePhoneNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
        const phone = e.target.value;
        setPhoneNumber(phone);

        if (phone.length === 10) {
            fetchCustomerByPhone(phone);
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setFormData((prevFormData) => {
            let updatedFormData = { ...prevFormData, [name]: value };

            if (name === "current_amount" || name === "amount") {
                const amountValue = parseFloat(updatedFormData.amount as any) || 0;
                const totalPaid = prevFormData.payments.reduce((acc, payment) => acc + parseFloat(payment.amount as any), 0);
                const current_amountValue = parseFloat(updatedFormData.current_amount as any) || 0;
                const pending = parseInt((amountValue - totalPaid - current_amountValue).toFixed(2));

                updatedFormData = { ...updatedFormData, pending };
            }

            return updatedFormData;
        });
    };

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setFormData({
                ...formData,
                image: files  // Store file object(s) directly
            });
        }
    };

    const validate = (): boolean => {
        let tempErrors: FormErrors = {};
        const phoneRegex = /^[0-9]{10}$/;
        const weightRegex = /^[0-9]+(\.[0-9]{1,2})?$/;
        const amountRegex = /^[0-9]+(\.[0-9]{1,2})?$/;
        console.log(formData.ph_no)
        if (!formData.app_no) tempErrors.app_no = "Application number is required";
        if (!formData.username) tempErrors.username = "Username is required";
        if (!formData.address) tempErrors.address = "Address is required";
        if (String(formData.ph_no).length != 10) tempErrors.ph_no = "Phone number must be 10 digits";
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

                // Append each image file to FormData
                if (formData.image && formData.image.length > 0) {
                    formData.image.forEach((file) => {
                        formDataToSend.append('image', file);  // Send as a file
                    });
                }

                // Make the POST request using axiosInstance
                const response = await axiosInstance.post(FORM_URL, formDataToSend, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                console.log("Customer added successfully", response.data);
                navigate('/customers');
            } catch (error) {
                console.error('Error adding customer:', error);
            }
        }
    };

    return (
        <div className='p-6'>
            <h2 className='text-2xl font-bold mb-6'>Customer Form</h2>
            <form onSubmit={handleSubmit}>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    {/* Phone Number Search */}
                    <div>
                        <label className='block'>Phone Number</label>
                        <input
                            type="text"
                            name='ph_no'
                            value={phoneNumber}
                            onChange={handlePhoneNumberChange}
                            className='w-full p-2 border border-gray-300 rounded mt-1'
                            placeholder="Enter phone number to search"
                        />
                        {errors.ph_no && <span className='text-red-500'>{errors.ph_no}</span>}
                    </div>

                    {/* Application Number */}
                    <div>
                        <label className='block'>Application Number</label>
                        <input
                            type="number"
                            name='app_no'
                            value={formData.app_no || ''}
                            onChange={handleInputChange}
                            className='w-full p-2 border border-gray-300 rounded mt-1'
                        />
                        {errors.app_no && <span className='text-red-500'>{errors.app_no}</span>}
                    </div>

                    {/* Other form fields like username, address, item_weight, etc. */}
                    <div>
                        <label className='block'>UserName</label>
                        <input
                            type="text"
                            name='username'
                            value={formData.username}
                            onChange={handleInputChange}
                            className='w-full p-2 border border-gray-300 rounded mt-1'
                        />
                        {errors.username && <span className='text-red-500'>{errors.username}</span>}
                    </div>

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

                    <div>
                        <label className='block'>Item Weight</label>
                        <input
                            type="number"
                            name='item_weight'
                            value={formData.item_weight || ''}
                            onChange={handleInputChange}
                            className='w-full p-2 border border-gray-300 rounded mt-1'
                        />
                        {errors.item_weight && <span className='text-red-500'>{errors.item_weight}</span>}
                    </div>

                    <div>
                        <label className='block'>Amount</label>
                        <input
                            type="number"
                            name='amount'
                            value={formData.amount || ''}
                            onChange={handleInputChange}
                            className='w-full p-2 border border-gray-300 rounded mt-1'
                        />
                        {errors.amount && <span className='text-red-500'>{errors.amount}</span>}
                    </div>

                    <div>
                        <label className='block'>Pending Amount</label>
                        <input
                            type="number"
                            name='pending'
                            disabled
                            value={formData.pending || ''}
                            className='w-full p-2 border border-gray-300 rounded mt-1'
                        />
                        {errors.pending && <span className='text-red-500'>{errors.pending}</span>}
                    </div>

                    <div>
                        <label className='block'>Current Amount</label>
                        <input
                            placeholder='0'
                            type="number"
                            name='current_amount'
                            value={formData.current_amount || ''}
                            onChange={handleInputChange}
                            className='w-full p-2 border border-gray-300 rounded mt-1'
                        />
                        {errors.current_amount && <span className='text-red-500'>{errors.current_amount}</span>}
                    </div>

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
                        Save
                    </button>
                    <button onClick={handleReset} className="bg-blue-500 text-white p-3 rounded mr-4" type='button'>Reset</button>
                </div>
            </form>
        </div>
    );
};

export default CustomerPage;
