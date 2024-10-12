import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Card from './Card';

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
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch dashboard data from the API
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await axios.get('http://172.20.0.26:8000/dashboard');

                // Log raw API response to ensure structure is correct
                console.log('Raw API Response:', response.data);

                // Parse the string response using the parseDashboardData function
                const parsedData = parseDashboardData(response.data);

                if (parsedData) {
                    setDashboardData(parsedData);
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
        { title: 'Total Customers', value: dashboardData.total.toString(), page: '/all-customers' },
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
