// src/pages/Profile/Profile.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Tabs, Tab, Dialog, DialogTitle, DialogContent,
    DialogActions, Button, Box, Typography, Avatar,
    TextField
} from '@mui/material';
import { FaUser, FaEdit } from 'react-icons/fa';
import { getCookie, setCookie } from '../../utils/cookieUtils';
import MyCalendar from '../../components/Calendar/Calendar';
import './Profile.css';
import HostEvents from '../../components/HostEvents/HostEvents';

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
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editedUser, setEditedUser] = useState(null);
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

            if (!data.events) {
                console.error('No events array in response:', data);
                return [];
            }

            return data.events.map(event => ({
                id: event.id,
                title: event.eventName,
                start: new Date(event.startDate),
                end: new Date(event.endDate),
                location: event.location
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

            if (!data.events) {
                console.error('No events array in response:', data);
                return [];
            }

            return data.events.map(event => ({
                id: event.id,
                title: event.eventName,
                startDate: new Date(event.startDate),
                endDate: new Date(event.endDate),
                location: event.location,
                price: event.price,
                eventImage: event.eventImage,
                eventName: event.eventName
            }));
        } catch (error) {
            console.error('Error fetching hosted events:', error);
            return [];
        }
    };

    useEffect(() => {
        const currentUser = getUserFromCookie();
        if (!currentUser) {
            console.error('No user data found in cookie');
            navigate('/');
            return;
        }

        setUser(currentUser);
        setEditedUser({
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
            email: currentUser.email,
            phone: currentUser.phone
        });
        
        const loadEvents = async () => {
            try {
                // Always fetch registered events for all users
                const registeredEventsList = await fetchRegisteredEvents(currentUser.id);
                setEvents(registeredEventsList);

                // Only fetch hosted events for admin users
                if (currentUser.userType === 'host' || currentUser.userType === 'admin') {
                    const hostedEventsList = await fetchHostedEvents(currentUser.id);
                    setHostedEvents(hostedEventsList);
                }
            } catch (error) {
                console.error('Error loading events:', error);
            }
        };

        loadEvents();
    }, [navigate]);

    const fetchEventAttendees = async (eventId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/events/ticket/list/${eventId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch attendees');
            }
            const data = await response.json();
            return {
                totalTickets: data.total_tickets,
                attendees: data.tickets.map(ticket => ticket.user)
            };
        } catch (error) {
            console.error('Error fetching attendees:', error);
            return { totalTickets: 0, attendees: [] };
        }
    };

    const onSelectEvent = useCallback(async (evt) => {
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
    
    const handleEditChange = (field) => (event) => {
        setEditedUser(prev => ({
            ...prev,
            [field]: event.target.value
        }));
    };

    const handleEditSubmit = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/users/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...editedUser,
                    userType: user.userType // Ensure userType cannot be changed
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update user information');
            }

            // Update the cookie with new user data
            const updatedUser = {
                ...user,
                ...editedUser
            };
            setCookie('userData', JSON.stringify(updatedUser));
            setUser(updatedUser);
            setEditDialogOpen(false);
        } catch (error) {
            console.error('Error updating user information:', error);
            // You might want to show an error message to the user here
        }
    };

    return (
        <div className="profile-main-layout">
            {/* User Info */}
            <div className="profile-user-info">
                <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                    <Avatar sx={{ bgcolor: PRIMARY_COLOR, width: 64, height: 64, fontSize: 32 }}>
                        <FaUser />
                    </Avatar>
                    <Typography variant="h5" fontWeight={700} color={PRIMARY_COLOR}>
                        {user ? `Hello, ${user.firstName} ${user.lastName}` : 'User Name'}
                    </Typography>
                    <Typography variant="h5" fontWeight={700} color="#256943">
                        {user ? `${user.userType}` : 'User Type'}
                    </Typography>
                    <Typography variant="body1" fontWeight={500} color={PRIMARY_COLOR}>
                        {user ? `Phone: ${user.phone}` : 'Phone Number'}
                    </Typography>
                    <Typography variant="body1" color={PRIMARY_COLOR} fontWeight={500}>
                        Email: {user?.email || 'user@email.com'}
                    </Typography>
                    <Button
                        startIcon={<FaEdit />}
                        variant="contained"
                        onClick={() => setEditDialogOpen(true)}
                        sx={{ 
                            backgroundColor: PRIMARY_COLOR,
                            '&:hover': { backgroundColor: '#145127' },
                            mt: 2
                        }}
                    >
                        Edit Info
                    </Button>
                </Box>
            </div>

            {/* Edit User Info Dialog */}
            <Dialog
                open={editDialogOpen}
                onClose={() => setEditDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Edit Profile Information</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                        <TextField
                            label="First Name"
                            value={editedUser?.firstName || ''}
                            onChange={handleEditChange('firstName')}
                            fullWidth
                        />
                        <TextField
                            label="Last Name"
                            value={editedUser?.lastName || ''}
                            onChange={handleEditChange('lastName')}
                            fullWidth
                        />
                        <TextField
                            label="Email"
                            type="email"
                            value={editedUser?.email || ''}
                            onChange={handleEditChange('email')}
                            fullWidth
                        />
                        <TextField
                            label="Phone"
                            value={editedUser?.phone || ''}
                            onChange={handleEditChange('phone')}
                            fullWidth
                        />
                        <Typography variant="body2" color="text.secondary">
                            User Type cannot be changed!
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                    <Button 
                        onClick={handleEditSubmit}
                        variant="contained"
                        sx={{ backgroundColor: PRIMARY_COLOR }}
                    >
                        Save Changes
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Tabs + Calendar */}
            <div className="profile-tabs-section">
                <Tabs 
                    value={tab} 
                    onChange={(_, v) => setTab(v)} 
                    sx={{ mb: 2 }}
                >
                    <Tab label="Upcoming Events" />
                    {(user?.userType === 'host' || user?.userType === 'admin') && <Tab label="Hosted Events" />}
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
                {tab === 1 && (user?.userType === 'host' || user?.userType === 'admin') && (
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
                {/* For non-admin users, Feedback is tab 1 and Points is tab 2 */}
                {/* For admin users, Feedback is tab 2 and Points is tab 3 */}
                {tab === (user?.userType === 'admin' || user?.userType === 'host' ? 2 : 1) && (
                    <div>
                        <Typography variant="h6" textAlign="left" className='feedback-form' sx={{ mt: 4 }}>
                            <a href="https://docs.google.com/forms/d/e/1FAIpQLSfaR7iUY5cY_OfawEEgW9c22EHrVUwYlYN198-dZfNUfUVpRA/viewform?usp=header" target="_blank" rel="noopener noreferrer">Feedback Form</a>
                        </Typography>
                    </div>
                )}
                {tab === (user?.userType === 'admin' || user?.userType === 'host' ? 3 : 2) && (
                    <div className='Points'>
                        <Typography variant="h4" gutterBottom>Points Earned</Typography>
                        <Typography variant="body1">You have earned 500 points</Typography>
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
