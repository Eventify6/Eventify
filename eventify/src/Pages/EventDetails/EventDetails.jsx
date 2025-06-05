import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './EventDetails.css';
import { FaInstagram, FaFacebook, FaTwitter } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { getCookie } from '../../utils/cookieUtils';

// Import Swiper 
import 'swiper/css';
import 'swiper/css/pagination';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Tabs, Tab, TextField, Snackbar, Typography, Box } from '@mui/material';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import { SocialMediaBoostPrices } from '../../Data/Enums';

const dummyEvents = [
    {
        id: 4,
        eventName: 'Masar Egbary Live',
        eventImage: '/assets/image/masarEgbary.png',
        startDate: '2024-07-01T19:00',
        endDate: '2024-07-01T22:00',
        location: 'Cairo Opera House',
        description: 'A live concert by Masar Egbary, one of Egypt\'s most popular bands. Enjoy an unforgettable night of music and entertainment.',
        category: 'Band',
        isCharged: true,
        instapay: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-_BK9GurJ4SaUZKwIu65RA4c1JrS6kWkWgQ&s',
        price: 200,
        isAttendeeLimit: true,
        attendeeLimit: 500,
        isPrivate: false,
        socialMediaBoost: ['socials', 'Email'],
        schedule: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        previousImages: ['/assets/image/sharmoofers.png', '/assets/image/sharmoofers.png'],
        instagramLink: 'https://instagram.com/masaregbary',
        facebookLink: 'https://facebook.com/masaregbary',
        twitterLink: 'https://twitter.com/masaregbary',
        agreement: true
    }
];

export default function EventDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    useEffect(() => {
        if (getCookie('isLoggedIN') !== 'true') {
            navigate('/');
            setTimeout(() => {
                window.dispatchEvent(new Event('open-login-modal'));
            }, 100);
        }
    }, [navigate]);
    const event = dummyEvents.find(e => e.id === Number(id));
    const [open, setOpen] = useState(false);
    const [tab, setTab] = useState(0);
    const [cardDetails, setCardDetails] = useState({
        name: '',
        number: '',
        expiry: '',
        cvv: ''
    });
    const [receiptOpen, setReceiptOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const handleModalOpen = () => {
        setOpen(true);
    };

    const handleModalClose = () => {
        setOpen(false);
        setTab(0);
        setCardDetails({ name: '', number: '', expiry: '', cvv: '' });
    };

    const handleTabChange = (e, newValue) => {
        setTab(newValue);
    };

    const handleCardInput = (e) => {
        setCardDetails({ ...cardDetails, [e.target.name]: e.target.value });
    };

    const handlePayNow = () => {
        setOpen(false);
        setReceiptOpen(true);
    };

    const handleReceiptClose = () => {
        setReceiptOpen(false);
    };

    const handleAddToCalendar = () => {
        setSnackbarOpen(true);
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };


    const total = (event?.price || 0);

    if (!event) {
        return (
            <div className='event-details-page-container'>
                <h2>Event Not Found</h2>
                <p>No event found with ID: {id}</p>
            </div>
        );
    }

    return (
        <div className='event-details-page-container'>
            <div className='event-details-page-container-header'>
                <img src={event.eventImage} alt={event.eventName} />
                <div className='event-details-page-container-header-info'>
                    <div className="event-details-page-container-header-info-title-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 style={{ margin: 0 }}>{event.eventName}</h2>
                        <p className="event-category" style={{ color: 'white' }}>{event.category}</p>
                    </div>
                    <span className='event-details-page-container-header-info-description'>{event.description}</span>

                    <div>
                        <p><strong>Location:</strong> {event.location}</p>

                        <h4 className="hours-section-title">Hours</h4>
                        <div className="hours-section-details">
                            <span><strong>From:</strong> {new Date(event.startDate).toLocaleDateString()} {new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            <span><strong>To:</strong> {new Date(event.endDate).toLocaleDateString()} {new Date(event.endDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                    </div>

                    <div className='event-social-links'>
                        {event.instagramLink && <a href={event.instagramLink} target="_blank" rel="noopener noreferrer"><FaInstagram style={{ color: '#E4405F', fontSize: '24px' }} /></a>}
                        {event.facebookLink && <a href={event.facebookLink} target="_blank" rel="noopener noreferrer"><FaFacebook style={{ color: '#1877F2', fontSize: '24px' }} /></a>}
                        {event.twitterLink && <a href={event.twitterLink} target="_blank" rel="noopener noreferrer"><FaTwitter style={{ color: '#1DA1F2', fontSize: '24px' }} /></a>}
                    </div>
                    <p><strong>Price:</strong> {event.isCharged ? `${event.price} EGP` : 'FREE!'}</p>
                    {event.isCharged && <Button onClick={handleModalOpen} style={{ backgroundColor: '#1c4f33', color: '#fff' }}>Pay Now</Button>}
                </div>
            </div>

            <div>
                {event.previousImages.length > 0 && (
                    <div className="swiper-container">
                        <h4>Previous Event Images</h4>
                        <Swiper
                            pagination={{
                                dynamicBullets: true,
                            }}
                            slidesPerView={3}
                            loop={true}
                            speed={2500}
                            navigation={true}
                            freeMode={true}
                            allowTouchMove={false}
                            spaceBetween={36}
                            modules={[Autoplay]}
                            autoplay={{
                                delay: false,
                                disableOnInteraction: false,
                            }}
                            className="mySwiper"
                        >
                            {event.previousImages.map((image, index) => (
                                <SwiperSlide key={index}><img src={image} alt={`Previous Event ${index}`} /></SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                )}
                <p><strong>Schedule:</strong> <a href={event.schedule} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}><button style={{ backgroundColor: '#1c4f33', color: 'whitesmoke', border: 'none', borderRadius: '8px', padding: '10px 20px', cursor: 'pointer' }}>Download Schedule</button></a></p>
            </div>

            <Dialog open={open} onClose={handleModalClose} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ background: '#1c4f33', color: 'white' }}>Pay for Event</DialogTitle>
                <DialogContent sx={{ minHeight: 320, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Tabs value={tab} onChange={handleTabChange} centered sx={{ marginBottom: 2 }}>
                        <Tab label="Credit Card" />
                        <Tab label="Instapay" />
                    </Tabs>
                    {tab === 0 && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                            <TextField label="Cardholder Name" name="name" value={cardDetails.name} onChange={handleCardInput} variant="outlined" fullWidth />
                            <TextField label="Card Number" name="number" value={cardDetails.number} onChange={handleCardInput} variant="outlined" fullWidth />
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <TextField label="Expiry Date" name="expiry" value={cardDetails.expiry} onChange={handleCardInput} variant="outlined" fullWidth />
                                <TextField label="CVV" name="cvv" value={cardDetails.cvv} onChange={handleCardInput} variant="outlined" fullWidth />
                            </Box>
                        </Box>
                    )}
                    {tab === 1 && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
                            <img src={event.instapay} alt="Instapay QR" style={{ width: 180, marginBottom: 16, borderRadius: 8 }} />
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
                    <Button onClick={handlePayNow} variant="contained" sx={{ background: '#1c4f33', color: 'white', borderRadius: 2, px: 4, py: 1.5, fontWeight: 600, fontSize: 16 }}>Pay Now</Button>
                    <Button onClick={handleModalClose} color="primary">Close</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={receiptOpen} onClose={handleReceiptClose} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ background: '#1c4f33', color: 'white' }}>Payment Receipt</DialogTitle>
                <DialogContent>
                    <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Payment Details</Typography>
                    <Box sx={{ mb: 2 }}>
                        <Typography><strong>Event:</strong> {event.eventName}</Typography>
                        <Typography><strong>Base Price:</strong> {event.price} EGP</Typography>
                        <Typography sx={{ mt: 1 }}><strong>Site Services:</strong> {total * 0.1} EGP</Typography>
                        <Typography sx={{ mt: 1 }}><strong>Total:</strong> {total + total * 0.1} EGP</Typography>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
                    <Button onClick={handleAddToCalendar} variant="contained" sx={{ background: '#1c4f33', color: 'white', borderRadius: 2, px: 4, py: 1.5, fontWeight: 600, fontSize: 16 }}>Add to Calendar</Button>
                    <Button onClick={handleReceiptClose} color="primary">Close</Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                message="Added to calendar!"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            />
        </div>
    );
}
