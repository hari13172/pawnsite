import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Card from './Card';
import { SERVER_IP } from '../api/endpoint';
// @ts-ignore
import Cookies from 'js-cookie';
import { accessToken } from '../api/axiosConfig';

interface DashboardData {
    total: number;
    due_date: number;
    pending: number;
    completed: number;
}

const parseDashboardData = (response: any): DashboardData => {
    return {
        total: response?.total || 0,
        due_date: response?.due_date || 0,
        pending: response?.pending || 0,
        completed: response?.completed || 0,
    };
};

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [dashboardData, setDashboardData] = useState<DashboardData>({
        total: 0,
        due_date: 0,
        pending: 0,
        completed: 0,
    });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDashboardData = async () => {
        try {
            const response = await axios.get(`${SERVER_IP}/api/dashboard`, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${accessToken()}`,
                    'WWW-Authenticate': 'Bearer',
                },
            });

            console.log('Raw API Response:', response.data);
            const parsedData = parseDashboardData(response.data);

            setDashboardData(parsedData);
            setError(null);
            setLoading(false);
        } catch (error: any) {
            if (error.response && error.response.status === 401) {
                setError("Unauthorized - redirecting to login.");
                Cookies.remove('access_token');
                navigate('/');
            } else {
                console.error('Error fetching dashboard data:', error);
                setError('Error fetching dashboard data');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []); // Run only on initial render

    const handleCardClick = (page: string) => {
        navigate(page);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

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
