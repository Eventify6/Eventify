import React from 'react';
import { FaFacebook, FaWhatsapp, FaInstagram } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-left">
                <span className="footer-brand">Eventify</span>
            </div>
            <div className="footer-center">
                <span className="copyright">&copy; {new Date().getFullYear()} All rights reserved.</span>
            </div>
            <div className="footer-right">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="footer-icon facebook">
                    <FaFacebook />
                </a>
                <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" className="footer-icon whatsapp">
                    <FaWhatsapp />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer-icon instagram">
                    <FaInstagram />
                </a>
            </div>
        </footer>
    );
};

export default Footer; 