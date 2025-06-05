import { Button } from "@mui/material";
import './EventCard.css';
import { useNavigate } from "react-router-dom";
import { getCookie } from '../../utils/cookieUtils';

export default function EventCard({ event }) {
    const navigate = useNavigate();
    const handleCardClick = () => {
        if (getCookie('isLoggedIN') === 'true') {
            navigate(`/events/${event.id}`);
        } else {
            window.dispatchEvent(new Event('open-login-modal'));
        }
    };
    return (
        <div className="event-card" onClick={handleCardClick}>
            <div><img src={event.image} alt="" />
                <span className="event-card-category">{event.category}</span>
            </div>
            <div>
                <span className="event-card-title">{event.title}</span>
                <span className="event-card-date">{new Date(event.date).toLocaleDateString()}</span>
                <div className="event-card-details">
                    <div className="event-card-location-price">
                        <span className="event-card-location">{event.location}</span>
                        <span className="event-card-price">{event.price}</span>
                    </div>
                    <Button variant="contained" color="primary" sx={{ backgroundColor: '#1c4f33', '&:hover': { backgroundColor: '#145127' } }}>View More</Button>
                </div>
            </div>
        </div>
    );
}