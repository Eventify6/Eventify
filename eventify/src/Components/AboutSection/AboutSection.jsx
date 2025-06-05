import React from 'react';
import './AboutSection.css';

export default function AboutSection() {
    return (
        <section className="about-section">
            <div className="about-cards">
                <div className="about-card">
                    <img src={'/assets/image/about us.png'} alt="about-us" />
                    <h2>About Us</h2>
                    <p>
                        Welcome to Eventify! We are passionate about making event management seamless and enjoyable. Whether you're planning a small gathering or a large conference, our platform empowers you to create, manage, and promote your events with ease. Join a growing community of event organizers and attendees who trust Eventify to deliver memorable experiences every time.
                    </p>
                </div>
                <div className="about-card">
                    <img src={'/assets/image/celebrate.png'} alt="about-us" />

                    <h2>What We Offer</h2>
                    <ul>
                        <li>Event Creation</li>
                        <li>Booking</li>
                        <li>Payment Integration</li>
                        <li>Comprehensive Event Services</li>
                    </ul>
                    <p>
                        From ticketing to payments and everything in between, Eventify is your one-stop solution for all event needs.
                    </p>
                </div>
            </div>
        </section>
    );
} 