import React, { useEffect, useState, useCallback } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { useNavigate } from 'react-router-dom';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Profile.css';
import { Tabs, Tab, Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography, Chip, Avatar, IconButton } from '@mui/material';
import { getCookie } from '../../utils/cookieUtils';
import { FaUser, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const locales = {
    'en-US': enUS,
};
const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
    getDay,
    locales,
});

const PRIMARY_COLOR = '#1c4f33';

// Dummy events for demonstration
const dummyEvents = [
    {
        id: 1,
        title: 'Masar Egbary Live',
        start: new Date('2024-07-01T19:00'),
        end: new Date('2024-07-01T22:00'),
        allDay: false,
        color: PRIMARY_COLOR,
        location: 'Cairo Opera House',
        description: 'A live concert by Masar Egbary, one of Egypt\'s most popular bands.',
    },
    {
        id: 2,
        title: 'Omar Khairat Concert',
        start: new Date('2024-07-10T20:00'),
        end: new Date('2024-07-10T23:00'),
        allDay: false,
        color: '#256943',
        location: 'Alexandria Library',
        description: 'A magical night with Omar Khairat. Classical music at its best.',
    },
    {
        id: 3,
        title: 'AI Workshop',
        start: new Date('2024-07-05T10:00'),
        end: new Date('2024-07-05T13:00'),
        allDay: false,
        color: '#eaeade',
        location: 'AUC New Cairo',
        description: 'Hands-on workshop on Artificial Intelligence.',
    },
    {
        id: 4,
        title: 'Trips to Fayoum',
        start: new Date('2024-07-12T07:00'),
        end: new Date('2024-07-12T19:00'),
        allDay: false,
        color: '#f7b32b',
        location: 'Fayoum',
        description: 'A day trip to Fayoum for adventure and fun.',
    },
];

function getUserFromCookie() {
    const userData = getCookie('userData');
    if (!userData) return null;
    try {
        return JSON.parse(userData);
    } catch {
        return null;
    }
}

// Custom Toolbar for Calendar
function CustomToolbar({ label, onNavigate }) {
    return (
        <div className="rbc-toolbar-custom">
            <IconButton className="rbc-btn-prev" onClick={() => onNavigate('PREV')}>
                <FaChevronLeft />
            </IconButton>
            <span className="rbc-toolbar-label-custom">{label}</span>
            <IconButton className="rbc-btn-next" onClick={() => onNavigate('NEXT')}>
                <FaChevronRight />
            </IconButton>
        </div>
    );
}

export default function Profile() {
    const [events, setEvents] = useState([]);
    const [tab, setTab] = useState(0);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => {
            setEvents(dummyEvents);
        }, 500);
        setUser(getUserFromCookie());
    }, []);

    const onSelectEvent = useCallback((event) => {
        setSelectedEvent(event);
    }, []);

    const handleCloseDialog = () => setSelectedEvent(null);
    const handleViewDetails = () => {
        if (selectedEvent) {
            navigate(`/eventdetails/${selectedEvent.id}`);
        }
    };

    // Custom month header to show only weekday name
    function CustomMonthHeader({ date }) {
        return (
            <div style={{ textAlign: 'center', fontWeight: 700 }}>
                {format(date, 'EEE')}
            </div>
        );
    }

    // Custom date cell wrapper to show day number and event name, with background color if event exists
    function CustomDateCellWrapper({ value, children }) {
        // Find event for this day
        const event = events.find(
            (e) =>
                e.start.getFullYear() === value.getFullYear() &&
                e.start.getMonth() === value.getMonth() &&
                e.start.getDate() === value.getDate()
        );
        const bgColor = event ? event.color : undefined;
        return (
            <div style={{ background: bgColor || undefined, minHeight: 60, padding: 4 }}>
                <div style={{ fontWeight: 600 }}>{value.getDate()}</div>
                {event && <div>{event.title}</div>}
            </div>
        );
    }

    return (
        <div className="profile-main-layout">
            {/* Left: User Info */}
            <div className="profile-user-info">
                <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                    <Avatar sx={{ bgcolor: '#1c4f33', width: 64, height: 64, fontSize: 32 }}>
                        <FaUser />
                    </Avatar>
                    <Typography variant="h5" fontWeight={700} color="#1c4f33">
                        {user ? `${user.firstName} ${user.lastName}` : 'User Name'}
                    </Typography>
                    <Typography variant="body1" color="#256943" fontWeight={500}>
                        {user?.email || 'user@email.com'}
                    </Typography>
                    <Typography variant="body1" color="#256943" fontWeight={500}>
                        {user?.phone || '+20 100 000 0000'}
                    </Typography>
                    <Chip
                        label={user?.userType === 'admin' ? 'Host' : 'Attendee'}
                        color={user?.userType === 'admin' ? 'primary' : 'success'}
                        sx={{ fontWeight: 700, fontSize: 16, px: 2, py: 1, borderRadius: 2, background: user?.userType === 'admin' ? '#1c4f33' : '#256943', color: '#fff' }}
                    />
                </Box>
            </div>
            {/* Right: Tabs and Calendar */}
            <div className="profile-tabs-section">
                <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
                    <Tab label="Upcoming Events" sx={{ fontWeight: 700, fontSize: 18, color: '#1c4f33' }} />
                </Tabs>
                {tab === 0 && (
                    <div className="profile-calendar-tab">
                        <Calendar
                            localizer={localizer}
                            events={events}
                            startAccessor="start"
                            endAccessor="end"
                            style={{ height: '70vh', width: '100%' }}
                            onSelectEvent={onSelectEvent}
                            popup
                            views={['month']}
                            components={{
                                event: undefined, // default event rendering
                                toolbar: CustomToolbar,
                                month: {
                                    header: CustomMonthHeader,
                                    dateCellWrapper: CustomDateCellWrapper,
                                },
                            }}
                        />
                    </div>
                )}
            </div>
            {/* Event Details Dialog */}
            <Dialog open={!!selectedEvent} onClose={handleCloseDialog} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ background: selectedEvent?.color || '#1c4f33', color: '#fff', fontWeight: 700 }}>
                    {selectedEvent?.title}
                </DialogTitle>
                <DialogContent sx={{ py: 3 }}>
                    <Typography variant="subtitle1" fontWeight={600} color="#1c4f33" mb={1}>
                        {selectedEvent?.location}
                    </Typography>
                    <Typography variant="body2" color="#256943" mb={2}>
                        {selectedEvent?.description}
                    </Typography>
                    <Typography variant="body2" color="#1c4f33">
                        <strong>Start:</strong> {selectedEvent?.start && format(selectedEvent.start, 'PPpp')}
                    </Typography>
                    <Typography variant="body2" color="#1c4f33">
                        <strong>End:</strong> {selectedEvent?.end && format(selectedEvent.end, 'PPpp')}
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
                    <Button
                        variant="contained"
                        sx={{ background: selectedEvent?.color || '#1c4f33', color: '#fff', borderRadius: 2, px: 4, py: 1.5, fontWeight: 600, fontSize: 16 }}
                        onClick={handleViewDetails}
                    >
                        View Event Details
                    </Button>
                    <Button onClick={handleCloseDialog} color="primary">Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

