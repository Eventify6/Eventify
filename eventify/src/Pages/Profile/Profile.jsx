// Profile.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Tabs, Tab, Dialog, DialogTitle, DialogContent,
    DialogActions, Button, Box, Typography, Avatar
} from '@mui/material';
import { FaUser } from 'react-icons/fa';
import { getCookie } from '../../utils/cookieUtils';
import MyCalendar from '../../Components/Calendar/Calendar';
import './Profile.css';

const PRIMARY_COLOR = '#1c4f33';

function getUserFromCookie() {
    const userData = getCookie('userData');
    if (!userData) return null;
    try { return JSON.parse(userData); }
    catch { return null; }
}

// some fake events to demonstrate
const dummyEvents = [
    { id: 1, title: 'Visit Egyptian Museum', date: '2025-06-10', location: 'Cairo Museum' },
    { id: 2, title: 'Pyramid Tour', date: '2025-06-15', location: 'Giza Plateau' },
    { id: 3, title: 'Nile Dinner Cruise', date: '2025-06-20', location: 'Nile River' },
];

export default function Profile() {
    const [events, setEvents] = useState([]);
    const [tab, setTab] = useState(0);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // load our dummy events and user
        setEvents(dummyEvents);
        setUser(getUserFromCookie());
    }, []);

    const onSelectEvent = useCallback(evt => setSelectedEvent(evt), []);
    const handleCloseDialog = () => setSelectedEvent(null);
    const handleViewDetails = () => {
        if (selectedEvent) navigate(`/eventdetails/${selectedEvent.id}`);
    };

    return (
        <div className="profile-main-layout">
            {/* user info */}
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

            {/* tabs + calendar */}
            <div className="profile-tabs-section">
                <Tabs
                    value={tab}
                    onChange={(_, v) => setTab(v)}
                    sx={{ mb: 2 }}
                >
                    <Tab label="Upcoming Events"
                    />
                </Tabs>

                {tab === 0 && (
                    <MyCalendar
                        events={events}
                        onSelectEvent={onSelectEvent}
                        primaryColor={PRIMARY_COLOR}
                    />
                )}
            </div>

            {/* event details dialog */}
            <Dialog open={!!selectedEvent} onClose={handleCloseDialog}>
                <DialogTitle>{selectedEvent?.title}</DialogTitle>
                <DialogContent>
                    <Typography>Location: {selectedEvent?.location}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        onClick={handleViewDetails}
                        sx={{ backgroundColor: PRIMARY_COLOR, cursor: 'pointer' }}
                    >
                        View Details
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
