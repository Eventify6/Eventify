import { useNavigate } from 'react-router-dom';
import './Hero.css';
import Button from '@mui/material/Button';

export default function Hero() {
    const navigate = useNavigate();  // Use navigate here
    function handleCreateEventClick() {
        console.log('clicked');
        navigate('/create-event');  // Use navigate directly
    }
    function handleJoinEventClick() {
        console.log('clicked');
        navigate('/events');  // Use navigate directly
    }


    return (
        <div className="heroContainer">
            <div className="buttons">
                <Button onClick={handleCreateEventClick} variant="contained" color="primary">
                    Create an Event
                </Button>
                <Button onClick={handleJoinEventClick} variant="contained" color="primary">
                    Join an Event
                </Button>
            </div>
        </div>
    );
}
