// src/pages/Profile/Profile.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Tabs, Tab, Dialog, DialogTitle, DialogContent,
    DialogActions, Button, Box, Typography, Avatar
} from '@mui/material';
import { FaUser } from 'react-icons/fa';
import { getCookie } from '../../utils/cookieUtils';
import MyCalendar from '../../components/Calendar/Calendar';
import './Profile.css';
import HostEvents from '../../Components/HostEvents/HostEvents';

const PRIMARY_COLOR = '#1c4f33';

function getUserFromCookie() {
    const userData = getCookie('userData');
    if (!userData) return null;
    try { return JSON.parse(userData); }
    catch { return null; }
}

export default function Profile() {
    const [events, setEvents] = useState([]);
    const [hostedEvents, setHostedEvents] = useState([]);
    const [tab, setTab] = useState(0);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    console.log(user);
    const userData = getCookie('userData');

    const fetchRegisteredEvents = async (userId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/events/ticket/getByUserId/${userId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch registered events');
            }
            const data = await response.json();
            console.log('Fetched registered events:', data);

            return data.events.map(event => ({
                id: event.id,
                title: event.eventName,
                start: new Date(event.startDate),
                end: new Date(event.endDate),
                location: event.location,
                attendees: [] // Will be populated when clicked for hosts
            }));
        } catch (error) {
            console.error('Error fetching registered events:', error);
            return [];
        }
    };

    const fetchHostedEvents = async (organizerId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/events/getByOrganizerId/${organizerId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch hosted events');
            }
            const data = await response.json();
            console.log('Fetched hosted events:', data);

            return data.events.map(event => ({
                id: event.id,
                title: event.eventName,
                startDate: new Date(event.startDate),
                endDate: new Date(event.endDate),
                location: event.location,
                price: event.price,
                eventImage: event.eventImage,
                eventName: event.eventName,
                attendees: [] // Will be populated when clicked for hosts
            }));
        } catch (error) {
            console.error('Error fetching hosted events:', error);
            return [];
        }
    };

    useEffect(() => {
        const currentUser = getUserFromCookie();
        setUser(currentUser);
        
        if (!currentUser) {
            navigate('/');
            return;
        }

        const loadEvents = async () => {
            // Always fetch registered events for all users
            const registeredEventsList = await fetchRegisteredEvents(currentUser.id);
            setEvents(registeredEventsList);

            // Only fetch hosted events for admin users
            if (currentUser.userType === 'admin') {
                const hostedEventsList = await fetchHostedEvents(currentUser.id);
                setHostedEvents(hostedEventsList);
            }
        };

        loadEvents();
    }, []);


    const onSelectEvent = useCallback((evt) => {
        setSelectedEvent(evt);
    }, []);

    const handleCloseDialog = () => setSelectedEvent(null);
    const handleViewDetails = () => {
        if (selectedEvent) {
            navigate(`/eventdetails/${selectedEvent.id}`);
        }
    };

    useEffect(() => {
        const handleLogout = () => {
            navigate('/');
        };

        window.addEventListener('userLogout', handleLogout);

        return () => window.removeEventListener('userLogout', handleLogout);
    }, []);
    console.log(user?.userType);
    
    return (
        <div className="profile-main-layout">
            {/* User Info */}
            <div className="profile-user-info">
                <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                    <Avatar sx={{ bgcolor: PRIMARY_COLOR, width: 64, height: 64, fontSize: 32 }}>
                        <FaUser />
                    </Avatar>
                    <Typography variant="h5" fontWeight={700} color={PRIMARY_COLOR}>
                        {user ? `${user.firstName} ${user.lastName}` : 'User Name'}
                    </Typography>
                    <Typography variant="body1" color="#256943" fontWeight={500}>
                        {user?.email || 'user@email.com'}
                    </Typography>
                </Box>
            </div>

            {/* Tabs + Calendar */}
            <div className="profile-tabs-section">
                <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
                    <Tab label="Upcoming Events" />
                    {user?.userType === 'admin' && <Tab label="Hosted Events" />}
                    <Tab label="Feedback Form" />
                    <Tab label="Earned Points" />
                </Tabs>

                {tab === 0 && (
                    <MyCalendar
                        events={events}
                        onSelectEvent={onSelectEvent}
                        primaryColor={PRIMARY_COLOR}
                    />
                )}
                {tab === 1 && user?.userType === 'admin' && (
                    <div className="hosted-events-container">
                        {hostedEvents.length > 0 ? (
                            <HostEvents events={hostedEvents} />
                        ) : (
                            <Typography variant="h6" textAlign="center" sx={{ mt: 4 }}>
                                No hosted events found
                            </Typography>
                        )}
                    </div>
                )}
                {tab === (user?.userType === 'admin' ? 3 : 2) && (
                    <div className='Points'>
                        <h4>Points Earned</h4>
                        <p>You have earned 500 points</p>
                    </div>
                )}
            </div>

            {/* Event Details Dialog */}
            <Dialog open={!!selectedEvent} onClose={handleCloseDialog}>
                {selectedEvent && (
                    <>
                        <DialogTitle>{selectedEvent.title}</DialogTitle>
                        <DialogContent dividers>
                            <Typography gutterBottom>
                                Location: {selectedEvent.location}
                            </Typography>
                            <Typography gutterBottom>
                                Starts:{' '}
                                {(
                                    selectedEvent.start instanceof Date
                                        ? selectedEvent.start
                                        : new Date(selectedEvent.start)
                                ).toLocaleString()}
                            </Typography>
                            <Typography gutterBottom>
                                Ends:{' '}
                                {(
                                    selectedEvent.end instanceof Date
                                        ? selectedEvent.end
                                        : new Date(selectedEvent.end)
                                ).toLocaleString()}
                            </Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                variant="contained"
                                onClick={handleViewDetails}
                                sx={{ backgroundColor: PRIMARY_COLOR }}
                            >
                                View Details
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </div>
    );
}
