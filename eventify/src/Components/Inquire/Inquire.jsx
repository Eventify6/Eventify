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
                    <input
                        type="email"
                        className={`inquire-input${touched && !isValidEmail(email) ? ' invalid' : ''}`}
                        placeholder="Enter your email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        onBlur={() => setTouched(true)}
                        required
                    />
                    <button
                        type="submit"
                        className="inquire-btn"
                        disabled={!isValidEmail(email)}
                    >
                        Subscribe
                    </button>
                </div>
                {touched && !isValidEmail(email) && (
                    <span className="error-msg">Please enter a valid email address.</span>
                )}
                {subscribed && (
                    <span className="success-msg">Thank you for subscribing!</span>
                )}
            </form>
        </section>
    );
} 