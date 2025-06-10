import { useState, useEffect } from 'react';

const useDashboardStats = () => {
    const [stats, setStats] = useState({
        users: { total: 0, label: 'Total Registered Users' },
        hosts: { total: 0, label: 'Total Hosts' },
        attendees: { total: 0, label: 'Total Attendees' },
        revenue: { total: 0, currency: 'EGP' },
        eventPrivacy: { private: 0, public: 0 },
        topCategories: [],
        ticketsSold: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardStats = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/dashboard/stats');
                if (!response.ok) {
                    throw new Error('Failed to fetch dashboard stats');
                }
                const data = await response.json();
                setStats(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchDashboardStats();
    }, []);

    return { stats, loading, error };
};

export default useDashboardStats; 