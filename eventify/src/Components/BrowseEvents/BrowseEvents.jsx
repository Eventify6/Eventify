import React, { useState, useMemo } from 'react';
import EventCard from '../EventCard/EventCard';
import { Events as Categories } from '../../Data/Enums';
import './BrowseEvents.css';
import { dummyEvents } from '../../Data/events';


export default function BrowseEvents() {
    const [category, setCategory] = useState('');
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('date');

    const filteredEvents = useMemo(() => {
        let events = [...dummyEvents];
        if (category) {
            events = events.filter(e => e.category === category);
        }
        if (search) {
            events = events.filter(e => e.title.toLowerCase().includes(search.toLowerCase()));
        }
        if (sort === 'date') {
            events.sort((a, b) => new Date(a.date) - new Date(b.date));
        } else if (sort === 'name') {
            events.sort((a, b) => a.title.localeCompare(b.title));
        }
        return events;
    }, [category, search, sort]);

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
                {filteredEvents.map(event => (
                    <EventCard event={event} key={event.id} />
                ))}
            </div>
        </div>
    );
}