import { useState } from 'react';
import './HostEvents.css';
import CustomersList from '../CustomersList/CustomersList';

export default function HostEvents({ events }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [customers, setCustomers] = useState([]);
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
            {events.length > 0 ? (
                <div className='eventsContainer'>
                    {events.map((event) => (
                        <div className='eventCard' key={event.id} onClick={() => handleOpenModal(event)}>
                            <img src={event.eventImage} alt={event.eventName} />
                            <h3>{event.eventName}</h3>
                            <p>{event.description}</p>
                            <div className="event-details">
                                <p>Date: {new Date(event.startDate).toLocaleDateString()}</p>
                                <p>Location: {event.location}</p>
                                <p>Price: ${event.price}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className='noEventsContainer'>
                    <p>No events found</p>
                </div>
            )}
            {isModalOpen && selectedEvent && (
                <CustomersList
                    customers={customers}
                    eventName={selectedEvent.eventName}
                    onClose={handleCloseModal}
                />
            )}
        </>
    );
}