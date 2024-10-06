import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: '"http://172.20.0.26:8000/add_customers"', // Replace with your actual base URL
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});
