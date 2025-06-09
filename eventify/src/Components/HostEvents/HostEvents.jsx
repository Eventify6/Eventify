import { useState } from 'react';
import './HostEvents.css';
import { dummyEvents } from '../../Data/events';
import CustomersList from '../CustomersList/CustomersList';

export default function HostEvents() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const handleOpenModal = (event) => {
        setSelectedEvent(event);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedEvent(null);
    };

    return (
        <>
            {dummyEvents.length > 0 ? (
                <div className='eventsContainer'>
                    {dummyEvents.map((event) => (
                        <div className='eventCard' key={event.id} onClick={() => handleOpenModal(event)}>
                            <img src={event.image} alt={event.title} />
                            <h3>{event.title}</h3>
                            <p>{event.description}</p>
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
                    customers={selectedEvent.customers}
                    eventName={selectedEvent.title}
                    onClose={handleCloseModal}
                />
            )}
        </>
    );
}