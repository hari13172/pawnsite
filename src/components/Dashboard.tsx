import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Card from './Card';
import { SERVER_IP } from '../api/endpoint';
// @ts-ignore
import Cookies from 'js-cookie';
import { accessToken } from '../api/axiosConfig';


// Types for the API response
interface DashboardData {
    total: number;
    due_date: number;
    pending: number;
    completed: number;
}

// Function to parse API response
const parseDashboardData = (response: string): DashboardData | null => {
    try {
        const parsedData: DashboardData = JSON.parse(response);
        return parsedData;
    } catch (error) {
        console.error("Error parsing dashboard data:", error);
        return null;
    }
};

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [dashboardData, setDashboardData] = useState<DashboardData>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch dashboard data from the API
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {



                const response: any = await axios.get(`${SERVER_IP}/api/dashboard`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'WWW-Authenticate': 'Bearer',
                    },
                }).catch((err) => {
                    if (err.status === 401) {
                        navigate("/")
                    }
                    else {
                        console.log(err, "errrorrrrr")
                    }
                })

                // Log raw API response to ensure structure is correct
                console.log('Raw API Response:', response.data);

                // Parse the string response using the parseDashboardData function
                const parsedData = parseDashboardData(response.data);
                console.log('Raw API Response:', parsedData);

                if (response.data) {
                    setDashboardData(response.data);
                } else {
                    setError('Failed to parse dashboard data');
                }

                setLoading(false);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                setError('Error fetching dashboard data');
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // Handle card click and navigation
    const handleCardClick = (page: string) => {
        navigate(page);
    };

    // Check if data is loading or there's an error
    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    // Ensure dashboardData is not null
    if (!dashboardData) {
        return <div>Error: Could not fetch data from the server.</div>;
    }

    // Card data based on API response
    const cardData = [
        { title: 'Total Customers', value: dashboardData.total.toString(), page: '/customers' },
        { title: 'Due Date Customers', value: dashboardData.due_date.toString(), page: '/due-customers' },
        { title: 'Pending Customers', value: dashboardData.pending.toString(), page: '/pending-customers' },
        { title: 'Completed Customers', value: dashboardData.completed.toString(), page: '/completed-customers' },
    ];

    return (
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cardData.map((data, idx) => (
                <Card
                    key={idx}
                    title={data.title}
                    value={data.value}
                    onClick={() => handleCardClick(data.page)}
                />
            ))}
        </div>
    );
};

export default Dashboard;
