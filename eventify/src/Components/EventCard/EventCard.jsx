import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import './EventCard.css';
import { useNavigate } from "react-router-dom";
import { getCookie } from '../../utils/cookieUtils';
import { toast, ToastContainer } from 'react-toastify';
import { useState } from 'react';

export default function EventCard({ event }) {
    const navigate = useNavigate();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editedEvent, setEditedEvent] = useState({
        eventName: event.eventName,
        location: event.location,
        price: event.price,
        category: event.category,
        startDate: new Date(event.startDate).toISOString().split('T')[0]
    });

    const isAdmin = () => {
        const userData = getCookie('userData');
        if (!userData) return false;
        try {
            const user = JSON.parse(userData);
            return user.userType === 'admin';
        } catch {
            return false;
        }
    };

    const handleCardClick = () => {
        if (getCookie('isLoggedIN') === 'true') {
            navigate(`/events/${event.id}`);
        } else {
            toast.error('Please login to view this event');
        }
    };

    const handleEditChange = (field) => (event) => {
        setEditedEvent(prev => ({
            ...prev,
            [field]: event.target.value
        }));
    };

    const handleEditSubmit = async () => {
        if (!isAdmin()) {
            toast.error('Only admins can edit events');
            return;
        }

        try {
            // Create a complete event object that includes all original data plus modifications
            const updatedEvent = {
                ...event,  // Spread all original event properties
                ...editedEvent,  // Override with edited fields
                id: event.id,  // Ensure ID is preserved
                isCharged: Number(editedEvent.price) > 0  // Set isCharged based on price
                

            };

            const response = await fetch(`http://localhost:5000/api/events/update/${event.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedEvent)
            });

            if (!response.ok) {
                throw new Error('Failed to update event');
            }

            toast.success('Event updated successfully');
            setEditDialogOpen(false);
            // Refresh the page to show updated data
            window.location.reload();
        } catch (error) {
            console.error('Error updating event:', error);
            toast.error('Failed to update event');
        }
    };

    const deleteEvent = () => {
        if (!isAdmin()) {
            toast.error('Only admins can delete events');
            return;
        }
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/events/delete/${event.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete event');
            }

            toast.success('Event deleted successfully');
            window.location.reload();
        } catch (error) {
            console.error('Error deleting event:', error);
            toast.error('Failed to delete event');
        } finally {
            setDeleteDialogOpen(false);
        }
    };
    
    return (
        <div className="event-card" >
            <ToastContainer/>
            <div>
                <img src={event.eventImage} alt="" />
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
                    <Button 
                        onClick={handleCardClick} 
                        variant="contained" 
                        color="primary" 
                        sx={{ backgroundColor: '#1c4f33', '&:hover': { backgroundColor: '#145127' } }}
                    >
                        View More
                    </Button>
                    <div className="button">
                    {isAdmin() && (
                        <>
                            <Button 
                                onClick={() => setEditDialogOpen(true)} 
                                variant="contained" 
                                color="primary" 
                                sx={{ backgroundColor: '#1c4f33', '&:hover': { backgroundColor: '#145127' }, color: '#fff' }}
                                className="edit-button"
                            >
                                Edit Event
                            </Button>
                            <Button 
                                onClick={deleteEvent} 
                                variant="contained" 
                                color="error"
                                className="delete-button"
                            >
                                Delete Event
                            </Button>
                            
                        </>
                    )}
                </div></div>
            </div>

            {/* Edit Dialog */}
            <Dialog
                open={editDialogOpen}
                onClose={() => setEditDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Edit Event</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Event Name"
                        type="text"
                        fullWidth
                        value={editedEvent.eventName}
                        onChange={handleEditChange('eventName')}
                    />
                    <TextField
                        margin="dense"
                        label="Location"
                        type="text"
                        fullWidth
                        value={editedEvent.location}
                        onChange={handleEditChange('location')}
                    />
                    <TextField
                        margin="dense"
                        label="Category"
                        type="text"
                        fullWidth
                        value={editedEvent.category}
                        onChange={handleEditChange('category')}
                    />
                    <TextField
                        margin="dense"
                        label="Price"
                        type="number"
                        fullWidth
                        value={editedEvent.price}
                        onChange={handleEditChange('price')}
                    />
                    <TextField
                        margin="dense"
                        label="Start Date"
                        type="date"
                        fullWidth
                        value={editedEvent.startDate}
                        onChange={handleEditChange('startDate')}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleEditSubmit} variant="contained" color="primary">
                        Save Changes
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
            >
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete "{event.eventName}"? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button 
                        onClick={handleDeleteConfirm} 
                        color="error" 
                        variant="contained"
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}