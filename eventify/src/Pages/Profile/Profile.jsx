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

const dummyEvents = [
    {
        id: 1,
        title: 'Visit Egyptian Museum',
        start: '2025-06-10T09:00:00',
        end: '2025-06-10T11:30:00',
        location: 'Cairo Museum'
    },
    {
        id: 2,
        title: 'Pyramid Tour',
        start: new Date(2025, 5, 15, 14, 0),
        end: new Date(2025, 5, 15, 17, 30),
        location: 'Giza Plateau'
    },
    {
        id: 3,
        title: 'Nile Dinner Cruise',
        start: '2025-06-20T19:00:00',
        end: '2025-06-20T21:00:00',
        location: 'Nile River'
    },
];

export default function Profile() {
    const [events, setEvents] = useState([]);
    const [tab, setTab] = useState(0);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        setEvents(dummyEvents);
        setUser(getUserFromCookie());
    }, []);

    const onSelectEvent = useCallback(evt => setSelectedEvent(evt), []);
    const handleCloseDialog = () => setSelectedEvent(null);
    const handleViewDetails = () => {
        if (selectedEvent) {
            navigate(`/eventdetails/${selectedEvent.id}`);
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
                    <Tab label="Hosted Events" />
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
                {tab === 1 && (
                    <HostEvents />
                )}
                {tab === 3 && (
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
                            <Typography>
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
