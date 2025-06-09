import { useState, useMemo } from 'react';
import './CustomersList.css';

export default function CustomersList({ customers, eventName, onClose }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');

    const filteredAndSortedCustomers = useMemo(() => {
        let filtered = customers;
        if (searchTerm) {
            filtered = customers.filter(customer =>
                `${customer.firstName} ${customer.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        const sorted = [...filtered].sort((a, b) => {
            const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
            const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
            if (nameA < nameB) return sortOrder === 'asc' ? -1 : 1;
            if (nameA > nameB) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });

        return sorted;
    }, [customers, searchTerm, sortOrder]);

    const handleSort = () => {
        setSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'));
    };

    return (
        <div className='modal-overlay' onClick={onClose}>
            <div className='modal-content' onClick={(e) => e.stopPropagation()}>
                <div className='modal-header'>
                    <h2>{eventName} - Registered Customers ({filteredAndSortedCustomers.length})</h2>
                    <button className='close-button' onClick={onClose}>&times;</button>
                </div>
                <div className='controls-container'>
                    <input
                        type="text"
                        placeholder="Search customers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="searchInput"
                    />
                    <button onClick={handleSort} className="sortButton">
                        Sort {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
                    </button>
                </div>
                <div className='customers-list'>
                    {filteredAndSortedCustomers.length > 0 ? (
                        filteredAndSortedCustomers.map((customer, index) => (
                            <div className='customer-item' key={index}>
                                <p>{customer.firstName} {customer.lastName}</p>
                            </div>
                        ))
                    ) : (
                        <p>No customers found.</p>
                    )}
                </div>
            </div>
        </div>
    );
}