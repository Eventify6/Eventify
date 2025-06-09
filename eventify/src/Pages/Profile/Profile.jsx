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
    {
        id: 1,
        eventName: 'Visit Egyptian Museum',
        start: new Date('2025-06-10T09:00:00'),
        end: new Date('2025-06-10T17:00:00'),
        location: 'Cairo Museum',
        description: 'A guided tour of the Egyptian Museum, home to an extensive collection of ancient Egyptian antiquities.',
        category: 'Cultural',
        isCharged: true,
        price: 250,
        isAttendeeLimit: true,
        attendeeLimit: 100,
        isPrivate: false,
        eventImage: 'https://source.unsplash.com/random/800x600?museum',
        schedule: null, // No schedule pdf for this one
        instagramLink: 'https://instagram.com/egyptianmuseum',
        facebookLink: '',
        twitterLink: '',
    },
    {
        id: 2,
        eventName: 'Pyramid Tour',
        start: new Date('2025-06-15T08:00:00'),
        end: new Date('2025-06-15T14:00:00'),
        location: 'Giza Plateau',
        description: 'Explore the iconic Pyramids of Giza and the Great Sphinx. A once in a lifetime experience.',
        category: 'Tour',
        isCharged: true,
        price: 500,
        isAttendeeLimit: true,
        attendeeLimit: 50,
        isPrivate: false,
        eventImage: 'https://source.unsplash.com/random/800x600?pyramids',
        schedule: null,
        instagramLink: '',
        facebookLink: 'https://facebook.com/pyramidsofgiza',
        twitterLink: '',
    },
    {
        id: 3,
        eventName: 'Nile Dinner Cruise',
        start: new Date('2025-06-20T19:00:00'),
        end: new Date('2025-06-20T22:00:00'),
        location: 'Nile River',
        description: 'Enjoy a relaxing dinner cruise on the Nile river with live entertainment and stunning views of Cairo at night.',
        category: 'Entertainment',
        isCharged: true,
        price: 350,
        isAttendeeLimit: false,
        attendeeLimit: 0,
        isPrivate: true,
        eventImage: 'https://source.unsplash.com/random/800x600?nilecruise',
        schedule: null,
        instagramLink: '',
        facebookLink: '',
        twitterLink: '',
    },
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
                        events={events.map(e => ({ ...e, title: e.eventName, start: e.start, end: e.end }))}
                        onSelectEvent={onSelectEvent}
                        primaryColor={PRIMARY_COLOR}
                    />
                )}
            </div>

            {/* event details dialog */}
            <Dialog open={!!selectedEvent} onClose={handleCloseDialog}>
                <DialogTitle>{selectedEvent?.eventName}</DialogTitle>
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
