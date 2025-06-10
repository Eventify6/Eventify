import { useNavigate } from 'react-router-dom';
import './Hero.css';
import Button from '@mui/material/Button';
import { getCookie } from '../../utils/cookieUtils';
import { useEffect, useState } from 'react';

export default function Hero() {
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);
    
    function handleCreateEventClick() {
        navigate('/create-event');
    }
    
    function handleJoinEventClick() {
        navigate('/events');
    }

    useEffect(() => {
        // Function to check user type
        const checkUserType = () => {
            const userData = getCookie('userData');
            const user = userData ? JSON.parse(userData) : null;
            setIsAdmin(user?.userType === 'host' || user?.userType === 'admin');
        };

        // Initial check
        checkUserType();

        // Listen for login/signup events
        window.addEventListener('userLogin', checkUserType);
        window.addEventListener('userSignup', checkUserType);
        window.addEventListener('userLogout', () => {
            setIsAdmin(false);
            navigate('/');
        });

        return () => {
            window.removeEventListener('userLogin', checkUserType);
            window.removeEventListener('userSignup', checkUserType);
            window.removeEventListener('userLogout', () => {
                setIsAdmin(false);
                navigate('/');
            });
        };
    }, [navigate]);

    return (
        <div className="heroContainer">
            <div className="buttons">
                {isAdmin && (
                    <Button onClick={handleCreateEventClick} variant="contained" color="primary">
                        Create an Event
                    </Button>
                )}
                <Button onClick={handleJoinEventClick} variant="contained" color="primary">
                    Join an Event
                </Button>
            </div>
        </div>
    );
}
