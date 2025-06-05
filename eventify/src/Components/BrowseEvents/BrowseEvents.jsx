import React, { useState, useMemo } from 'react';
import EventCard from '../EventCard/EventCard';
import { Events as Categories } from '../../Data/Enums';
import './BrowseEvents.css';

const dummyEvents = [
    {
        id: 1,
        title: 'Masar Egbary Live',
        date: '2024-07-01T19:00',
        category: 'Band',
        location: 'Cairo Opera House',
        price: '200 EGP',
        image: '/assets/image/masarEgbary.png',
    },
    {
        id: 2,
        title: 'Omar Khairat Concert',
        date: '2024-07-10T20:00',
        category: 'Classical',
        location: 'Alexandria Library',
        price: '350 EGP',
        image: '/assets/image/omarKhairat.png',
    },
    {
        id: 3,
        title: 'Wegz Live',
        date: '2024-07-15T21:00',
        category: 'Entertainment',
        location: 'El Sawy Culturewheel',
        price: '400 EGP',
        image: '/assets/image/wegz.png',
    },
    {
        id: 4,
        title: 'AI Workshop',
        date: '2024-07-05T10:00',
        category: 'Workshop',
        location: 'AUC New Cairo',
        price: 'Free',
        image: '/assets/image/AI.png',
    },
    {
        id: 5,
        title: 'Sharmoofers Night',
        date: '2024-07-20T19:30',
        category: 'Band',
        location: 'Zed Park',
        price: '250 EGP',
        image: '/assets/image/sharmoofers.png',
    },
    {
        id: 6,
        title: 'Tamer Ashour Musical',
        date: '2024-07-18T18:00',
        category: 'Musical',
        location: 'Cairo Stadium',
        price: '300 EGP',
        image: '/assets/image/tamerAshour.png',
    },
    {
        id: 7,
        title: 'Educational Camp',
        date: '2024-07-25T09:00',
        category: 'Camp',
        location: 'Wadi Degla',
        price: '150 EGP',
        image: '/assets/image/celebrate.png',
    },
    {
        id: 8,
        title: 'Trips to Fayoum',
        date: '2024-07-12T07:00',
        category: 'Trips',
        location: 'Fayoum',
        price: '500 EGP',
        image: '/assets/image/about us.png',
    },
    {
        id: 9,
        title: 'Exhibition: Modern Art',
        date: '2024-07-22T11:00',
        category: 'Exhibition',
        location: 'Gezira Art Center',
        price: '100 EGP',
        image: '/assets/image/your-image.jpeg',
    },
];

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