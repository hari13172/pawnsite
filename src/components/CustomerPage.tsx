import React, { useEffect, useState } from 'react';
import { ChangeEvent, FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Types for data
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
    images: File[];
    status: 'pending' | 'completed';
    payments: Payment[];
}

interface FormErrors {
    applicationNumber?: string;
    username?: string;
    address?: string;
    phonenumber?: string;
    ItemWeight?: string;
    amount?: string;
    PendingAmount?: string;
    CurrentAmount?: string;
    StaringDate?: string;
    EndingDate?: string;
    note?: string;
}

const CustomerPage: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        applicationNumber: "",
        username: "",
        address: "",
        phonenumber: "",
        ItemWeight: "",
        amount: "",
        PendingAmount: "",
        CurrentAmount: "",
        StaringDate: "",
        EndingDate: "",
        note: "",
        images: [],
        status: 'pending',
        payments: []
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const navigate = useNavigate();
    const location = useLocation();

    const handleReset = () => {
        setFormData({
            applicationNumber: "",
            username: "",
            address: "",
            phonenumber: "",
            ItemWeight: "",
            amount: "",
            PendingAmount: "",
            CurrentAmount: "",
            StaringDate: "",
            EndingDate: "",
            note: "",
            images: [],
            status: 'pending',
            payments: []
        });
        setErrors({});
    };

    useEffect(() => {
        if (location.state && location.state.customerData) {
            const customerData = location.state.customerData as FormData;
            setFormData({
                ...customerData,
                payments: customerData.payments || []
            });
        }
    }, [location.state]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if (name === 'phonenumber') {
            // Check if the phone number already exists in stored customers
            const storedCustomers = JSON.parse(localStorage.getItem('customers') || '[]');
            const existingCustomer = storedCustomers.find(
                (customer: FormData) => customer.phonenumber === value
            );

            if (existingCustomer) {
                // Auto-fill the form with the existing customer's data excluding amount and pending amount
                setFormData(prevFormData => ({
                    ...prevFormData,
                    applicationNumber: existingCustomer.applicationNumber,
                    username: existingCustomer.username,
                    address: existingCustomer.address,
                    phonenumber: existingCustomer.phonenumber,
                    ItemWeight: existingCustomer.ItemWeight,
                    StaringDate: existingCustomer.StaringDate,
                    EndingDate: existingCustomer.EndingDate,
                    note: existingCustomer.note,
                    images: existingCustomer.images,
                    status: existingCustomer.status,
                    payments: []
                }));
                return;
            }
        }

        setFormData((prevFormData) => {
            let updatedFormData = { ...prevFormData, [name]: value };

            if (name === "CurrentAmount" || name === "amount") {
                const amountValue = parseFloat(updatedFormData.amount) || 0;
                const totalPaid = prevFormData.payments.reduce((acc, payment) => acc + parseFloat(payment.amount), 0);
                const currentAmountValue = parseFloat(updatedFormData.CurrentAmount) || 0;
                const pendingAmount = (amountValue - totalPaid - currentAmountValue).toFixed(2);

                updatedFormData = { ...updatedFormData, PendingAmount: pendingAmount };
            }

            return updatedFormData;
        });
    };

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            const imageReaders = files.map(file => {
                return new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result as string);
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });
            });

            Promise.all(imageReaders).then(imageDataUrls => {
                setFormData({
                    ...formData,
                    images: imageDataUrls,  // Store base64 encoded images
                });
            });
        }
    };

    const validate = (): boolean => {
        let tempErrors: FormErrors = {};
        const phoneRegex = /^[0-9]{10}$/;
        const weightRegex = /^[0-9]+(\.[0-9]{1,2})?$/;
        const amountRegex = /^[0-9]+(\.[0-9]{1,2})?$/;

        if (!formData.applicationNumber) tempErrors.applicationNumber = "Application number is required";
        if (!formData.username) tempErrors.username = "Username is required";
        if (!formData.address) tempErrors.address = "Address is required";
        if (!phoneRegex.test(formData.phonenumber)) tempErrors.phonenumber = "Phone number must be 10 digits";
        if (!weightRegex.test(formData.ItemWeight)) tempErrors.ItemWeight = "Weight should be a valid number";
        if (!amountRegex.test(formData.amount)) tempErrors.amount = "Amount should be a valid number";
        if (!amountRegex.test(formData.PendingAmount)) tempErrors.PendingAmount = "Pending amount should be a valid number";
        if (!amountRegex.test(formData.CurrentAmount)) tempErrors.CurrentAmount = "Current amount should be a valid number";
        if (!formData.StaringDate) tempErrors.StaringDate = "Starting Date is required";
        if (!formData.EndingDate) tempErrors.EndingDate = "Ending Date is required";

        const storedCustomers = JSON.parse(localStorage.getItem('customers') || '[]');
        const existingCustomer = storedCustomers.find(
            (customer: FormData) => customer.applicationNumber === formData.applicationNumber
        );

        if (existingCustomer && location.state?.customerData?.applicationNumber !== formData.applicationNumber) {
            tempErrors.applicationNumber = "Application number already used";
        }

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    // const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    //     e.preventDefault();
    //     if (validate()) {
    //         const storedCustomers = JSON.parse(localStorage.getItem('customers') || '{}');

    //         // Group by phone number
    //         const customerGroup = storedCustomers[formData.phonenumber] || [];


    //         const newPayment: Payment = {
    //             date: new Date().toISOString(),
    //             amount: formData.CurrentAmount,
    //         };

    //         const updatedFormData = {
    //             ...formData,
    //             payments: [...formData.payments, newPayment],
    //             PendingAmount: formData.amount, // Start fresh pending amount
    //             CurrentAmount: "", // Clear the CurrentAmount for the next entry
    //         };




    //         // Store each entry separately, even if the phone number matches
    //         if (storedCustomers[formData.phonenumber]) {
    //             storedCustomers[formData.phonenumber].push(updatedFormData);
    //         } else {
    //             storedCustomers[formData.phonenumber] = [updatedFormData];
    //         }

    //         storedCustomers.push(updatedFormData);

    //         // Push the new entry under the phone number group
    //         customerGroup.push(updatedFormData);
    //         storedCustomers[formData.phonenumber] = customerGroup;

    //         // Save updated data to local storage
    //         localStorage.setItem('customers', JSON.stringify(storedCustomers));

    //         // Navigate back to the customer list
    //         navigate('/customers');
    //     }
    // };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (validate()) {
            const storedCustomers = JSON.parse(localStorage.getItem('customers') || '[]');

            const newPayment: Payment = {
                date: new Date().toISOString(),
                amount: formData.CurrentAmount
            };

            const updatedFormData = {
                ...formData,
                payments: [...formData.payments, newPayment],
                CurrentAmount: "", // Reset current amount
            };

            if (location.state?.customerData) {
                // Update existing customer
                const updatedCustomers = storedCustomers.map((customer: FormData) =>
                    customer.applicationNumber === location.state.customerData.applicationNumber
                        ? { ...updatedFormData }
                        : customer
                );
                localStorage.setItem('customers', JSON.stringify(updatedCustomers));
            } else {
                // Add a new customer
                storedCustomers.push(updatedFormData);
                localStorage.setItem('customers', JSON.stringify(storedCustomers));
            }

            // After saving, navigate back to the customer table and profile page
            navigate('/customers', { state: updatedFormData }); // This ensures that the updated customer data is passed back
        }
    };
    return (
        <div className='p-6'>
            <h2 className='text-2xl font-bold mb-6'>Customer Form</h2>
            <form onSubmit={handleSubmit}>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div>
                        <label className='block'>Application Number</label>
                        <input
                            type="text"
                            name='applicationNumber'
                            value={formData.applicationNumber}
                            onChange={handleInputChange}
                            className='w-full p-2 border border-gray-300 rounded mt-1'
                        />
                        {errors.applicationNumber && <span className='text-red-500'>{errors.applicationNumber}</span>}
                    </div>

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
                        <label className='block'>Phonenumber</label>
                        <input
                            type="number"
                            name='phonenumber'
                            value={formData.phonenumber}
                            onChange={handleInputChange}
                            className='w-full p-2 border border-gray-300 rounded mt-1'
                        />
                        {errors.phonenumber && <span className='text-red-500'>{errors.phonenumber}</span>}
                    </div>

                    <div>
                        <label className='block'>Item Weight</label>
                        <input
                            type="number"
                            name='ItemWeight'
                            value={formData.ItemWeight}
                            onChange={handleInputChange}
                            className='w-full p-2 border border-gray-300 rounded mt-1'
                        />
                        {errors.ItemWeight && <span className='text-red-500'>{errors.ItemWeight}</span>}
                    </div>

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

                    <div>
                        <label className='block'>Pending Amount</label>
                        <input
                            type="number"
                            name='PendingAmount'
                            disabled
                            value={formData.PendingAmount}
                            className='w-full p-2 border border-gray-300 rounded mt-1'
                        />
                        {errors.PendingAmount && <span className='text-red-500'>{errors.PendingAmount}</span>}
                    </div>

                    <div>
                        <label className='block'>Current amount</label>
                        <input
                            type="number"
                            name='CurrentAmount'
                            value={formData.CurrentAmount}
                            onChange={handleInputChange}
                            className='w-full p-2 border border-gray-300 rounded mt-1'
                        />
                        {errors.CurrentAmount && <span className='text-red-500'>{errors.CurrentAmount}</span>}
                    </div>

                    <div>
                        <label className='block'>Starting Date</label>
                        <input
                            type="date"
                            name='StaringDate'
                            value={formData.StaringDate}
                            onChange={handleInputChange}
                            className='w-full p-2 border border-gray-300 rounded mt-1'
                        />
                        {errors.StaringDate && <span className='text-red-500'>{errors.StaringDate}</span>}
                    </div>

                    <div>
                        <label className='block'>Ending Date</label>
                        <input
                            type="date"
                            name='EndingDate'
                            value={formData.EndingDate}
                            onChange={handleInputChange}
                            className='w-full p-2 border border-gray-300 rounded mt-1'
                        />
                        {errors.EndingDate && <span className='text-red-500'>{errors.EndingDate}</span>}
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
                            name='images'
                            multiple
                            onChange={handleImageUpload}
                            className='w-full p-2 border border-gray-300 rounded mt-1'
                        />
                        {formData.images.length > 0 && (
                            <div className="mt-2">
                                {formData.images.map((image, idx) => (
                                    <div key={idx}>{image.name}</div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className='mt-6'>
                    <button className="bg-blue-500 text-white p-3 rounded mr-4" type='submit'>{location.state?.customerData ? "Update" : "Save"}</button>
                    <button onClick={handleReset} className="bg-blue-500 text-white p-3 rounded mr-4" type='button'>Reset</button>
                </div>
            </form>
        </div>
    );
};

export default CustomerPage;
