import { Button } from "@mui/material";
import './EventCard.css';
import { useNavigate } from "react-router-dom";
import { getCookie } from '../../utils/cookieUtils';
import { toast, ToastContainer } from 'react-toastify';
export default function EventCard({ event }) {
    const navigate = useNavigate();
    const handleCardClick = () => {
        if (getCookie('isLoggedIN') === 'true') {
            navigate(`/events/${event.id}`);
        } else {
            toast.error('Please login to view this event');
        }
    };
    console.log(event.eventImage);
    
    return (
        <div className="event-card" >
            <ToastContainer/>
            <div><img src={event.eventImage} alt="" />
                <span className="event-card-category">{event.category}</span>
            </div>
            <div>
                <span className="event-card-title">{event.eventName}</span>
                <span className="event-card-date">{new Date(event.startDate).toLocaleDateString()}</span>
                <div className="event-card-details">
                    <div className="event-card-location-price">
                        <span className="event-card-location">{event.location}</span>
                        {event.isCharged ? <span className="event-card-price">{event.price} LE</span> : <span className="event-card-price">Free</span>}
                    </div>
                    <Button onClick={handleCardClick} variant="contained" color="primary" sx={{ backgroundColor: '#1c4f33', '&:hover': { backgroundColor: '#145127' } }}>View More</Button>
                </div>
            </div>
        </div>
    );
}