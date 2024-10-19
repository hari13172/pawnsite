import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// @ts-ignore
import Cookies from 'js-cookie'; // Import js-cookie library
import { SERVER_IP } from '../api/endpoint';


const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState<string>('');
    const [otp, setOtp] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const payload = { email: username, otp };

            // Make a POST request to the API
            const response = await axios.post(
                `${SERVER_IP}/api/verify-otp`,
                payload
            );

            if (response.status === 200) {
                const { access_token } = response.data;

                // Store the access token in cookies
                Cookies.set('access_token', access_token, { expires: 1 }); // Expires in 1 day

                setError(null); // Clear any previous errors
                navigate('/dashboard'); // Navigate to the dashboard on success
            } else {
                setError('Invalid username or OTP'); // Handle unexpected status codes
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Invalid username or OTP'); // Handle errors
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium">Email</label>
                        <input
                            type="email"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 border rounded"
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium">OTP</label>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full px-4 py-2 border rounded"
                            placeholder="Enter the OTP"
                            required
                        />
                    </div>

                    {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
