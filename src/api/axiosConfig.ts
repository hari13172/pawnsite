import axios from 'axios';
import { SERVER_IP } from './endpoint';
// @ts-ignore
import Cookies from 'js-cookie';

export const axiosInstance = axios.create({
    baseURL: (`${SERVER_IP}/api/add_customers`), // Replace with your actual base URL 
    withCredentials: true,
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});


export const accessToken = () => Cookies.get('access_token') ;