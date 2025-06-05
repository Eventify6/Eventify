import { Link } from 'react-router-dom';
import './Navbar.css';
import { FaUser } from "react-icons/fa";
import { useState, useEffect, useRef } from 'react';
import Modal from '../Modal/Modal';
import LoginSignup from '../LoginSignup/LoginSignup';
import { getCookie } from '../../utils/cookieUtils';
import { Menu, MenuItem, IconButton, Avatar, Box, Typography } from '@mui/material';
import { removeCookie } from '../../utils/cookieUtils';

export default function Navbar() {
    const [modalOpen, setModalOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const openMenu = Boolean(anchorEl);
    const profileRef = useRef(null);
    const [menuWidth, setMenuWidth] = useState(null);
    const menuRef = useRef(null); // New ref for menu to detect outside clicks

    useEffect(() => {
        const userData = getCookie('userData');
        if (userData) {
            try {
                setUser(JSON.parse(userData));
            } catch {
                setUser(null);
            }
        }

        // Close menu when clicked outside of the menu or profile
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target) && !profileRef.current.contains(event.target)) {
                setAnchorEl(null);  // Close menu if clicked outside
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const handleUserIconClick = () => setModalOpen(true);
    const handleClose = () => setModalOpen(false);
    const handleAuth = () => {
        const userData = getCookie('userData');
        if (userData) {
            setUser(JSON.parse(userData));
        }
        setModalOpen(false);
    };

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
        if (profileRef.current) {
            setMenuWidth(profileRef.current.offsetWidth);
        }
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    const handleLogout = () => {
        removeCookie('isLoggedIN');
        removeCookie('userData');
        setUser(null);
        handleMenuClose();
    };

    return (
        <nav className='navContainer'>
            <h2>Eventify</h2>
            <ul className='nav-links'>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/contact">Contact Us</Link></li>
                <li>
                    {user ? (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <IconButton
                                ref={profileRef}
                                onClick={handleMenuOpen}
                                sx={{ p: 0, color: '#eaeade' }}
                                aria-controls={openMenu ? 'profile-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={openMenu ? 'true' : undefined}
                            >
                                <Avatar sx={{ bgcolor: '#1c4f33', width: 32, height: 32, fontSize: 18 }}>
                                    <FaUser />
                                </Avatar>
                                {user.firstName && (<span>{user.firstName} {user.lastName}</span>)}
                            </IconButton>

                            <Menu
                                ref={menuRef}
                                id="profile-menu"
                                anchorEl={anchorEl}
                                open={openMenu}
                                onClose={handleMenuClose}
                                PaperProps={{
                                    sx: {
                                        backgroundColor: '#1c4f33',
                                        color: '#eaeade',
                                        mt: 1.5,
                                        borderRadius: 2,
                                        minWidth: '140px',
                                    },
                                    className: 'mui-profile-menu custom-profile-menu',
                                }}
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                            >
                                <MenuItem
                                    onClick={() => { handleMenuClose(); window.location.href = '/profile'; }}
                                    sx={{ fontWeight: 600, cursor: 'pointer', color: '#eaeade', '&:hover': { backgroundColor: '#256943' } }}
                                >
                                    Profile
                                </MenuItem>
                                <MenuItem
                                    onClick={handleLogout}
                                    sx={{ fontWeight: 600, cursor: 'pointer', color: '#eaeade', '&:hover': { backgroundColor: '#256943' } }}
                                >
                                    Logout
                                </MenuItem>
                            </Menu>
                        </Box>
                    ) : (
                        <IconButton sx={{ color: '#eaeade' }} onClick={handleUserIconClick}>
                            <FaUser className='icon-btn' />
                        </IconButton>
                    )}
                </li>
            </ul>
            <Modal open={modalOpen} onClose={handleClose}>
                <LoginSignup onAuth={handleAuth} />
            </Modal>
        </nav>
    );
}
