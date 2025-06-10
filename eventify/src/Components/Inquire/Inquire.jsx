import React, { useState } from 'react';
import './Inquire.css';

export default function Inquire() {
    const [email, setEmail] = useState('');
    const [touched, setTouched] = useState(false);
    const [subscribed, setSubscribed] = useState(false);

    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setTouched(true);
        if (isValidEmail(email)) {
            setSubscribed(true);
            setEmail('');
            setTimeout(() => setSubscribed(false), 2500);
        }
    };

    return (
        <section className="inquire-section">
            <form className="inquire-form" onSubmit={handleSubmit} autoComplete="off">
                <h2 className="inquire-title">Stay in the Loop!</h2>
                <div className="input-group">
                  
                    <h4>If you have any inquiries don't hesitate to contact us!</h4>
                    <a
                    href="mailto:eventify66@gmail.com?subject=Inquiry from User"
                    className="inquire-btn"
                    >
                    Email
                    </a>
                </div>
            
            </form>
        </section>
    );
} 