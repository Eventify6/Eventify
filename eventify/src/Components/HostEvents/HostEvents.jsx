import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box, IconButton } from '@mui/material';
import { MdEdit, MdDelete } from 'react-icons/md';
import './HostEvents.css';
import CustomersList from '../CustomersList/CustomersList';

const HostEvents = ({ events, isAdmin, onEdit, onDelete }) => {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [selectedEvent, setSelectedEvent] = React.useState(null);
    const [customers, setCustomers] = React.useState([]);
    console.log(events);
    
    const fetchCustomers = async (eventId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/events/ticket/list/${eventId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch customers');
            }
            const data = await response.json();
            // Extract users from tickets array
            return data.tickets.map(ticket => ticket.user);
        } catch (error) {
            console.error('Error fetching customers:', error);
            return [];
        }
    };

    const handleOpenModal = async (event) => {
        setSelectedEvent(event);
        const customersList = await fetchCustomers(event.id);
        setCustomers(customersList);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedEvent(null);
        setCustomers([]);
    };

    return (
        <>
            <div className="hosted-events-grid">
                {events.map((event) => (
                    <Card key={event.id} className="hosted-event-card">
                        <Box sx={{ position: 'relative' }}>
                            <CardMedia
                                component="img"
                                height="140"
                                image={event.eventImage || 'default-event-image.jpg'}
                                alt={event.eventName}
                            />
                            {isAdmin && (
                                <Box sx={{
                                    position: 'absolute',
                                    top: 8,
                                    right: 8,
                                    display: 'flex',
                                    gap: 1,
                                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                    borderRadius: '4px',
                                    padding: '4px'
                                }}>
                                    <IconButton
                                        size="small"
                                        onClick={() => onEdit(event.id)}
                                        sx={{ color: '#1c4f33' }}
                                    >
                                        <MdEdit />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        onClick={() => onDelete(event)}
                                        sx={{ color: '#d32f2f' }}
                                    >
                                        <MdDelete />
                                    </IconButton>
                                </Box>
                            )}
                        </Box>
                        <CardContent>
                            <Typography variant="h6" component="div" gutterBottom>
                                {event.eventName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                Location: {event.location}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                Start: {new Date(event.startDate).toLocaleString()}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                End: {new Date(event.endDate).toLocaleString()}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Price: ${event.price}
                            </Typography>
                        </CardContent>
                    </Card>
                ))}
            </div>
            {isModalOpen && selectedEvent && (
                <CustomersList
                    customers={customers}
                    eventName={selectedEvent.eventName}
                    onClose={handleCloseModal}
                />
            )}
        </>
    );
};

export default HostEvents;