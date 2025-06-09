import React, { useState, useEffect, useMemo } from 'react';
import EventCard from '../EventCard/EventCard';
import { Events as Categories } from '../../Data/Enums';
import './BrowseEvents.css';

export default function BrowseEvents() {
    const [events, setEvents] = useState([]);
    const [category, setCategory] = useState('');
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('date');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/events/list');
                if (!response.ok) {
                    throw new Error('Failed to fetch events');
                }
                const data = await response.json();
                setEvents(data.events);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const filteredEvents = useMemo(() => {
        let filtered = [...events];
        if (category) {
            filtered = filtered.filter(e => e.category === category);
        }
        if (search) {
            filtered = filtered.filter(e => e.eventName.toLowerCase().includes(search.toLowerCase()));
        }
        if (sort === 'date') {
            filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
        } else if (sort === 'name') {
            filtered.sort((a, b) => a.eventName.localeCompare(b.title));
        }
        return filtered;
    }, [events, category, search, sort]);
    console.log(events);
    return (
        <div className="browse-events-container">
            <p className="browse-events-title">Browse Events</p>

            <div className="browse-events-toolbar">
                <div className="browse-events-filter">
                    <label htmlFor="category">Category</label>
                    <select
                        id="category"
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                    >
                        <option value="">All</option>
                        {Categories.map(cat => (
                            <option key={cat.value} value={cat.label}>{cat.label}</option>
                        ))}
                    </select>
                </div>

                <div className="browse-events-search">
                    <label htmlFor="search">Search by Name</label>
                    <input
                        id="search"
                        type="text"
                        placeholder="Search by Name"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>

                <div className="browse-events-sort">
                    <label>Sort</label>
                    <div className="sort-buttons">
                        <button
                            className={sort === 'date' ? 'active' : ''}
                            onClick={() => setSort('date')}
                            type="button"
                        >
                            Sort by Date
                        </button>
                        <button
                            className={sort === 'name' ? 'active' : ''}
                            onClick={() => setSort('name')}
                            type="button"
                        >
                            Sort by Name
                        </button>
                    </div>
                </div>
            </div>

            <div className="browse-events-grid">
                {loading && <p>Loading events...</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {!loading && !error && filteredEvents.map(event => (
                    <EventCard event={event} key={event.id} />
                ))}
            </div>
        </div>
    );
}
